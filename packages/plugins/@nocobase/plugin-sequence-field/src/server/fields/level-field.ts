import {
  BaseColumnFieldOptions,
  DataTypes,
  Field,
  FieldContext,
  Model,
  Transactionable,
  ValidationError,
  ValidationErrorItem,
} from '@nocobase/database';

export interface Pattern {
  validate?(options): string | null;
  generate(this: LevelField, instance: Model, options: Transactionable): Promise<string> | string;
  batchGenerate(this: LevelField, instances: Model[], values: string[], options: Transactionable): Promise<void> | void;
  getLength(options): number;
  getMatcher(options): string;
  update?(this: LevelField, instance: Model, value: string, options, transactionable: Transactionable): Promise<void>;
}

export interface LevelFieldOptions extends BaseColumnFieldOptions {
  type: 'level';
}
/**
 * 树层级代码
 */
export class LevelField extends Field {
  matcher: RegExp;
  get dataType() {
    return DataTypes.INTEGER;
  }
  constructor(options: LevelFieldOptions, context: FieldContext) {
    super(options, context);
    // if (!options.patterns || !options.patterns.length) {
    //   throw new Error('at least one pattern should be defined for sequence type');
    // }
    // options.patterns.forEach((pattern) => {
    //   const P = sequencePatterns.get(pattern.type);
    //   if (!P) {
    //     throw new Error(`pattern type ${pattern.type} is not registered`);
    //   }
    //   if (P.validate) {
    //     const error = P.validate(pattern.options);
    //     if (error) {
    //       throw new Error(error);
    //     }
    //   }
    // });

    // const patterns = options.patterns.map(({ type, options }) => sequencePatterns.get(type).getMatcher(options));
    // this.matcher = new RegExp(`^${patterns.map((p) => `(${p})`).join('')}$`, 'i');
  }

  validate = (instance: Model) => {
    const { name, inputable, match } = this.options;
    const value = instance.get(name);
    if (value != null && inputable && match && !this.match(value)) {
      throw new ValidationError('sequence pattern not match', [
        new ValidationErrorItem(
          `input value of ${name} field not match the sequence pattern (${this.matcher.toString()}) which is required`,
          'validation error', // NOTE: type should only be this which in sequelize enum set
          name,
          value,
          instance,
          'sequence_pattern_not_match',
          name,
          [],
        ),
      ]);
    }
  };

  setValue = async (instance: Model, options) => {
    const { name } = this.options;
    const { transaction } = options;
    const parentId = instance.get('parentId');
    let level = 0;
    if (parentId == null) {
      level = 0;
    } else {
      /* 求取父节点的level */
      const sql = `SELECT level FROM ${this.collection.name} WHERE id = ${parentId}`;
      const [rows] = (await this.database.sequelize.query(sql, { transaction: transaction })) as any;
      if (rows?.[0]?.level != null) {
        level = rows[0].level + 1;
      }
    }
    instance.set(name, level);
  };

  setGroupValue = async (instances: Model[], { transaction }) => {
    if (!instances.length) {
      return;
    }
    /**
     * 步骤 创建临时表、计算新的深度、更新节点的深度、 删除临时表
     */
    const temporayTableName = `${this.collection.name}_new_depths`;
    const tableName = `${this.collection.name}`;
    const sql = [];
    /* 创建临时表 */
    sql.push(`CREATE TEMPORARY TABLE ${temporayTableName} (
      node_id INT PRIMARY KEY,
      new_level INT
    )`);
    /* 计算新的深度 */
    sql.push(`INSERT INTO ${temporayTableName} (node_id, new_level)
    SELECT t.id, p.level + 1
    FROM ${tableName} t
    JOIN ${tableName} p ON t.parentId = p.id;`);
    /* 更新节点的深度 */
    sql.push(`
    UPDATE ${tableName}
INNER JOIN ${temporayTableName} ON ${tableName}.id = ${temporayTableName}.node_id
SET ${tableName}.level = ${temporayTableName}.new_level;
    `);
    /* 删除临时表 */
    sql.push(`DROP TABLE ${temporayTableName};`);
    /**
     * 数组倒转
     */
    sql.reverse();

    let isSuccess = true;
    while (sql.length && isSuccess) {
      const cSql = sql.pop();
      try {
        const result = await this.database.sequelize.query(cSql, { transaction: transaction });

        // 处理查询结果
      } catch (error) {
        // 处理错误
        isSuccess = false;
      }
    }
  };

  cleanHook = (_, options) => {
    options.skipIndividualHooks.delete(`${this.collection.name}.beforeCreate.${this.name}`);
  };

  match(value) {
    return typeof value === 'string' ? value.match(this.matcher) : null;
  }

  async update(instance: Model, options) {}

  bind() {
    super.bind();
    this.on('beforeCreate', this.setValue);
    // this.on('beforeBulkCreate', this.setGroupValue);
    this.on('afterBulkCreate', this.setGroupValue);
  }

  unbind() {
    super.unbind();
    this.off('beforeCreate', this.setValue);
    // this.off('beforeBulkCreate', this.setGroupValue);
    this.off('afterBulkCreate', this.setGroupValue);
  }
}
