import { Context, Next } from '@nocobase/actions';
import { Collection, Repository } from '@nocobase/database';
import { uid } from '@nocobase/utils';
import xlsx from 'node-xlsx';
import XLSX from 'xlsx';
import { namespace } from '../../';
import { pick } from 'lodash';

const IMPORT_LIMIT_COUNT = 10000;
const convertToTreeData = function (data) {
  const map = {};
  let node = [];
  data.forEach(function (record) {
    const value = record.value;
    const keys = Object.keys(value).filter((key) => key !== 'parent');
    const newVal = pick(value, keys);
    if (!map[record.rowIndex]) {
      map[record.rowIndex] = {
        children: [],
        rowIndex: record.rowIndex,
        ...newVal,
      };
    }

    // map[record.rowIndex].data = record;

    if (record.parentIndex !== undefined) {
      if (!map[record.parentIndex]) {
        map[record.parentIndex] = {
          children: [],
        };
      }
      map[record.parentIndex].children.push(map[record.rowIndex]);
    } else {
      node.push(map[record.rowIndex]);
    }
  });

  return node;
};
function flattenTree(treeData: any[]): any[] {
  let result: any[] = [];

  function flatten({ rowIndex, value, children }) {
    result.push(rowIndex);

    if (children.length) {
      children.forEach((child) => {
        flatten(child);
      });
    }
  }
  treeData.forEach((node) => {
    flatten(node);
  });

  return result;
}
class Importer {
  repository: Repository;
  collection: Collection;
  isTreeTable: boolean;
  columns: any[];
  items: any[][] = [];
  headerRow;
  context: Context;

  constructor(ctx: Context) {
    const { resourceName, resourceOf } = ctx.action;
    this.context = ctx;
    this.repository = ctx.db.getRepository<any>(resourceName, resourceOf);
    this.collection = ctx.db.getCollection(resourceName);
    this.isTreeTable = this.collection.options.template === 'tree';
    if (!this.isTreeTable) {
      this.parseXlsx();
    } else {
      this.parseTreeXlsx();
    }
  }

  getRows() {
    const workbook = XLSX.read(this.context.file.buffer, {
      type: 'buffer',
      // cellDates: true,
      // raw: false,
    });
    const r = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(r, { header: 1, defval: null, raw: false });
    return rows;
  }
  parseXlsx() {
    const rows = this.getRows();
    let columns = (this.context.request.body as any).columns as any[];
    if (typeof columns === 'string') {
      columns = JSON.parse(columns);
    }
    this.columns = columns
      .map((column) => {
        return {
          ...column,
          field: this.collection.fields.get(column.dataIndex[0]),
        };
      })
      .filter((col) => col.field);
    const str = this.columns.map((column) => column.defaultTitle).join('||');
    for (const row of rows) {
      if (this.hasHeaderRow()) {
        if (row && row.join('').trim()) {
          this.items.push(row);
        }
      }
      if (str === row.filter((r) => r).join('||')) {
        this.headerRow = row;
      }
    }
  }
  parseTreeXlsx() {
    const rows = this.getRows();
    let columns = (this.context.request.body as any).columns as any[];
    if (typeof columns === 'string') {
      columns = JSON.parse(columns);
    }
    this.columns = columns
      .map((column) => {
        return {
          ...column,
          field: this.collection.fields.get(column.dataIndex[0]),
        };
      })
      .filter((col) => col.field);
    const str = this.columns.map((column) => column.defaultTitle).join('||');
    for (const row of rows) {
      if (this.hasHeaderRow()) {
        if (row && row.join('').trim()) {
          this.items.push(row);
        }
      }
      if (str === row.filter((r) => r).join('||')) {
        this.headerRow = row;
      }
    }
  }
  getFieldByIndex(index) {
    return this.columns[index].field;
  }
  async getItems(rowIndexs, { transaction }) {
    const items: any[] = [];
    const newItems = [];
    for (const index of rowIndexs) {
      newItems.push(this.items[index]);
    }
    for (const row of newItems) {
      const values = {};
      const errors = [];
      for (let index = 0; index < row.length; index++) {
        if (!this.columns[index]) {
          continue;
        }
        const column = this.columns[index];
        const { field, defaultTitle } = column;
        let value = row[index];
        if (value === undefined || value === null) {
          continue;
        }
        const parser = this.context.db.buildFieldValueParser(field, { ...this.context, column });
        await parser.setValue(typeof value === 'string' ? value.trim() : value, { transaction });
        value = parser.getValue();
        if (parser.errors.length > 0) {
          errors.push(`${defaultTitle}: ${parser.errors.join(';')}`);
        }
        if (value === undefined) {
          continue;
        }
        values[field.name] = value;
      }
      items.push({
        row,
        values,
        errors,
      });
    }
    return items;
  }

  hasSortField() {
    return !!this.collection.options.sortable;
  }

  async run() {
    return await this.context.db.sequelize.transaction(async (transaction) => {
      if (!this.isTreeTable) {
        /* 判断这个表是不是树结构 */
        const rowIndexs = new Array(this.items.length).fill(0).map((_, index) => index);
        return await this.addValues(rowIndexs, { transaction }, [[], []]);
      } else {
        /**
         * 树形结构数据增加
         */
        const { treeData } = this.getTreeData();

        return await this.addTreeValues(treeData, { transaction }, [[], []]);
      }
    });
  }
  async addValues(rowIndexs, { transaction }, result = [[], []]) {
    let sort = 0;
    if (this.hasSortField()) {
      sort = await this.repository.model.max<number, any>('sort', { transaction });
    }
    for (const { row, values, errors } of await this.getItems(rowIndexs, { transaction })) {
      if (errors.length > 0) {
        row.push(errors.join(';'));
        result[1].push(row);
        continue;
      }
      if (this.hasSortField()) {
        values['sort'] = ++sort;
      }
      try {
        const instance = await this.repository.create({
          values,
          transaction,
          logging: false,
          context: this.context,
        });
        result[0].push(instance);
      } catch (error) {
        this.context.log.error(error, row);
        row.push(error.message);
        result[1].push(row);
      }
    }
    return result;
  }

  async getItemByRowIndex(rowIndex, { transaction }, instance) {
    const row = this.items[rowIndex];
    const values = {};
    const errors = [];
    for (let index = 0; index < row.length; index++) {
      if (!this.columns[index]) {
        continue;
      }
      const column = this.columns[index];
      const { field, defaultTitle } = column;
      let value = row[index];
      if (value === undefined || value === null) {
        continue;
      }
      const parser = this.context.db.buildFieldValueParser(field, { ...this.context, column });
      await parser.setValue(typeof value === 'string' ? value.trim() : value, { transaction }, instance);
      value = parser.getValue();
      if (parser.errors.length > 0) {
        errors.push(`${defaultTitle}: ${parser.errors.join(';')}`);
      }
      if (value === undefined) {
        continue;
      }
      values[field.name] = value;
    }
    return {
      row,
      values,
      errors,
    };
  }

  async addValue({ rowIndex }, { transaction }, result = [[], []], parent?) {
    let sort = 0;
    if (this.hasSortField()) {
      sort = await this.repository.model.max<number, any>('sort', { transaction });
    }
    const { row, values, errors } = await this.getItemByRowIndex(rowIndex, { transaction }, parent);
    if (errors.length > 0) {
      row.push(errors.join(';'));
      result[1].push(row);
      return {
        isSuccess: false,
      };
      // continue;
    }
    if (this.hasSortField()) {
      values['sort'] = ++sort;
    }
    // try {
    const instance = await this.repository.create({
      values,
      transaction,
      logging: false,
      context: this.context,
    });

    result[0].push(instance);
    return {
      isSuccess: true,
      instance,
    };
    // } catch (error) {
    // this.context.log.error(error, row);
    // row.push(error.message);
    // result[1].push(row);
    // return {
    //   isSuccess: false,
    //   errorMsg: error.message,
    // };
    // }
    // }
  }

  async addTreeValues(treeData: any[], { transaction }, result = [[], []]) {
    await this.addTreeNodes(treeData, { transaction }, result);
    // 返回结果
    return result;
  }
  async addTreeNodes(treeData: any[], { transaction }, result = [[], []], parent?) {
    let sort = 0;
    if (this.hasSortField()) {
      sort = await this.repository.model.max<number, any>('sort', { transaction });
    }
    for (let node of treeData) {
      const { rowIndex, children, ...values } = node;
      const { isSuccess, instance } = await this.addValue(node, { transaction }, result, parent);
      if (!isSuccess) {
        continue;
      } else {
        if (children.length) {
          await this.addTreeNodes(children, { transaction }, result, instance);
        }
      }
    }
    // 返回结果
    return result;
  }
  getTreeData() {
    const columns = this.columns;
    const rows = this.items;
    const levelMap = new Map();
    const levels = new Set<number>();
    const columnIndex = columns.findIndex((column) => column.field.name === 'level');
    const pColIndexs = [];
    const nColIndexs = [];
    columns.forEach((col, index) => {
      if (col.field.name == 'parent') {
        const names = col.dataIndex.slice(1, col.dataIndex.length).join('.');
        const nColIndex = columns.findIndex((column) => column.dataIndex.join('.') === names);
        if (nColIndex !== -1) {
          pColIndexs.push(index);
          nColIndexs.push(nColIndex);
        }
      }
    });
    rows.forEach((row, index) => {
      const level = row[columnIndex] || 0;
      const rowIndexs = levelMap.get(level) || [];
      levels.add(new Number(level).valueOf());
      rowIndexs.push(index);
      if (!levelMap.has(level)) {
        levelMap.set(level, rowIndexs);
      }
    });

    function arraysAreEqual(a, b) {
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    const parentIndexMap = new Map();
    rows.forEach((row, rowIndex) => {
      // const children = [];
      const cValues = nColIndexs.map((colIndex) => {
        return rows[rowIndex][colIndex];
      });
      rows.forEach((row, subRowIndex) => {
        if (rowIndex === subRowIndex) {
          return;
        }
        const pValues = pColIndexs.map((colIndex) => {
          return rows[subRowIndex][colIndex];
        });
        if (arraysAreEqual(cValues, pValues)) {
          parentIndexMap.set(subRowIndex, rowIndex);
        }
      });
    });
    const records = [];
    rows.forEach((row, rowIndex) => {
      const parentIndex = parentIndexMap.get(rowIndex);
      let item: any = {
        rowIndex,
      };
      let rowValue = {};
      this.columns.forEach((column, columnIndex) => {
        const colValue = row[columnIndex];
        const dataIndex = column.dataIndex;
        const colObjectValue = dataIndex.reduceRight((prev, curr) => {
          return { [curr]: prev };
        }, colValue);
        rowValue = Object.assign(true, rowValue, {
          ...colObjectValue,
        });
      });
      item.value = rowValue;
      if (parentIndex !== undefined) {
        item.parentIndex = parentIndex;
      }
      records.push(item);
    });
    const treeData = convertToTreeData(records);
    const sortRowIndexs = flattenTree(treeData);

    return {
      treeData,
      sortRowIndexs,
    };
  }
  hasHeaderRow() {
    return !!this.headerRow;
  }
}

export async function importXlsx(ctx: Context, next: Next) {
  const importer = new Importer(ctx);
  if (!importer.hasHeaderRow()) {
    ctx.throw(400, ctx.t('Imported template does not match, please download again.', { ns: namespace }));
  }
  const columnIndex = importer.columns.findIndex((column) => column.field.name === 'level');
  if (importer.isTreeTable && columnIndex == -1) {
    ctx.throw(400, ctx.t('Tree table missing level field', { ns: namespace }));
  }
  const [success, failure] = await importer.run();
  ctx.body = {
    rows: xlsx.build([
      {
        name: `${uid()}.xlsx`,
        data: [importer.headerRow].concat(failure),
      },
    ]),
    successCount: success.length,
    failureCount: failure.length,
  };

  await next();
}
