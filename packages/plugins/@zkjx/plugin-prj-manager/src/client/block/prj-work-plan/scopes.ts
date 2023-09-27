import { ArrayField, createForm } from '@formily/core';
import { FormContext, useField, useFieldSchema } from '@formily/react';
import {
  findFilterTargets,
  mergeFilter,
  removeNullCondition,
  useACLRoleContext,
  useBlockRequestContext,
  useCollection,
  useCollectionManager,
  useFilterBlock,
  useGanttBlockContext,
  useGanttBlockProps,
  useTableBlockContext,
  useTableBlockProps,
} from '@nocobase/client';
import { getValuesByPath } from '@nocobase/utils/client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const compPlanTask = (plans, tasks = []) => {
  return plans.map((item) => {
    return {
      key: 'plan_' + item.id,
      title: item.stage.label,
      isGroup: true,
      prjStage: item,
      status: item.status,
      children: tasks
        .filter((temp) => {
          return temp.prjStageId == item.id;
        })
        .map((temp) => {
          temp.key = 'task_' + temp.id;
          return temp;
        }),
    };
  });
};
const flattenTree = (treeData = [], callback?) => {
  return treeData.reduce((acc, node) => {
    if (node.children) {
      return acc.concat([node, ...flattenTree(node.children, callback)]);
    } else {
      if (typeof callback == 'function') {
        callback(node);
      }
      return acc.concat(node);
    }
  }, []);
};
const preProcessData = (data) => {
  const group = 'prjStage';
  const titleMap = {
    prjStage: 'stage.label',
    user: 'nickname',
  };
  /**
   * 树重新组成
   */
  const list = flattenTree(data, (node) => {

    node.rowKey = 'task_' + node.id;
  });
  /* 打平 树 */
  const sGroups = {};
  const groups = list.group((record) => {
    const groupRecord = record[group];
    if (groupRecord) {
      const title = getValuesByPath(groupRecord, titleMap[group]);      
      let key = [group,groupRecord.id].join('.')
      sGroups[key] = {
        ...groupRecord,
        title: title,
        rowKey: group + '_' + groupRecord.id,
        isGroup: true,
        groupType: group,
      };
    }
    const groupKey = groupRecord ? [group,groupRecord.id].join('.') : 'others';
    return groupKey;
  });
  const nList = [];
  Object.keys(groups).forEach((key) => {
    const group = sGroups[key];
    nList.push({
      ...(group
        ? group
        : {
            id: 'others',
            isGroup: true,
            rowKey: 'others',
            groupType:null,
            title: '其他'
          }),
      children: groups[key].map((task)=>{
        const {children,...others} = task;
         return {
          ...others
         }
      }),
    });
  });
  debugger;

  return nList;
};
export const usePrjWorkPlanProcessData = preProcessData;
export const usePrjWorkPlanTableBlockProps = () => {
  const field = useField<ArrayField>();
  const fieldSchema = useFieldSchema();
  const ctx = useTableBlockContext();
  const globalSort = fieldSchema.parent?.['x-decorator-props']?.['params']?.['sort'];
  const { getDataBlocks } = useFilterBlock();

  useEffect(() => {
    if (!ctx?.service?.loading) {
      field.value = [];
      field.value = preProcessData(ctx?.service?.data?.data);
      field.data = field.data || {};
      field.data.selectedRowKeys = ctx?.field?.data?.selectedRowKeys;
      field.componentProps.pagination = field.componentProps.pagination || {};
      field.componentProps.pagination.pageSize = ctx?.service?.data?.meta?.pageSize;
      field.componentProps.pagination.total = ctx?.service?.data?.meta?.count;
      field.componentProps.pagination.current = ctx?.service?.data?.meta?.page;
    }
  }, [ctx?.service?.loading]);
  return {
    childrenColumnName: ctx.childrenColumnName,
    loading: ctx?.service?.loading,
    showIndex: ctx.showIndex,
    dragSort: ctx.dragSort,
    rowKey: ctx.rowKey || 'rowKey',
    pagination:
      ctx?.params?.paginate !== false
        ? {
            defaultCurrent: ctx?.params?.page || 1,
            defaultPageSize: ctx?.params?.pageSize,
          }
        : false,
    onRowSelectionChange(selectedRowKeys) {
      ctx.field.data = ctx?.field?.data || {};
      ctx.field.data.selectedRowKeys = selectedRowKeys;
      ctx?.field?.onRowSelect?.(selectedRowKeys);
    },
    async onRowDragEnd({ from, to }) {
      await ctx.resource.move({
        sourceId: from[ctx.rowKey || 'id'],
        targetId: to[ctx.rowKey || 'id'],
      });
      ctx.service.refresh();
    },
    onChange({ current, pageSize }, filters, sorter) {
      let sorterKey = sorter.field;
      if (sorter?.column?.isDicField) {
        sorterKey = sorter?.column?.sorterKey;
      }
      const sort = sorter.order
        ? sorter.order === `ascend`
          ? [sorterKey]
          : [`-${sorterKey}`]
        : globalSort || ctx.service.params?.[0]?.sort;
      ctx.service.run({ ...ctx.service.params?.[0], page: current, pageSize, sort });
    },
    onClickRow(record, setSelectedRow, selectedRow) {
      const { targets, uid } = findFilterTargets(fieldSchema);
      const dataBlocks = getDataBlocks();

      // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
      if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
        // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
        // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
        setSelectedRow((prev) => (prev.length ? [] : prev));
        return;
      }

      const value = [record[ctx.rowKey]];

      dataBlocks.forEach((block) => {
        const target = targets.find((target) => target.uid === block.uid);
        if (!target) return;

        const param = block.service.params?.[0] || {};
        // 保留原有的 filter
        const storedFilter = block.service.params?.[1]?.filters || {};

        if (selectedRow.includes(record[ctx.rowKey])) {
          delete storedFilter[uid];
        } else {
          storedFilter[uid] = {
            $and: [
              {
                [target.field || ctx.rowKey]: {
                  [target.field ? '$in' : '$eq']: value,
                },
              },
            ],
          };
        }

        const mergedFilter = mergeFilter([
          ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
          block.defaultFilter,
        ]);

        return block.doFilter(
          {
            ...param,
            page: 1,
            filter: mergedFilter,
          },
          { filters: storedFilter },
        );
      });

      // 更新表格的选中状态
      setSelectedRow((prev) => (prev?.includes(record[ctx.rowKey]) ? [] : [...value]));
    },
    onExpand(expanded, record) {
      ctx?.field.onExpandClick?.(expanded, record);
    },
  };
};

const getItemColor = (item, token) => {
  const colorName = item.color || item.status?.color;
  if (colorName) {
    if (colorName.indexOf('#') !== -1) {
      return colorName;
    } else {
      return token['color' + [(colorName[0] as string).toLocaleUpperCase() + colorName.slice(1, colorName.length)]];
    }
  }
  return null;
};
const findMinStart = (item, cStart) => {
  item.children.forEach((child) => {
    cStart = findItemMinStart(child, cStart);
    if (child.children && child.children.length) {
      cStart = findMinStart(child, cStart);
    }
  });
  return cStart;
};
const findMaxEnd = (item, cEnd) => {
  item.children.forEach((child) => {
    cEnd = findItemMaxEnd(child, cEnd);
    if (child.children && child.children.length) {
      cEnd = findMaxEnd(child, cEnd);
    }
  });
  return cEnd;
};
const findItemMinStart = (item, cStart) => {
  const start = item.start ? new Date(item.start) : null;
  if (cStart && start) {
    if (start.getTime() <= cStart.getTime()) {
      cStart = start;
    }
  } else if (start) {
    cStart = start;
  }
  return cStart;
};
const findItemMaxEnd = (item, cEnd) => {
  const end = item.end ? new Date(item.end) : null;
  if (cEnd && end) {
    if (end.getTime() >= cEnd.getTime()) {
      cEnd = end;
    }
  } else if (end) {
    cEnd = end;
  }
  return cEnd;
};
const formatData = (
  data = [],
  fieldNames,
  tasks: any[] = [],
  projectId: any = undefined,
  hideChildren = false,
  checkPermassion?: (any) => boolean,
  treeData = data,
  token = {},
) => {
  data.forEach((item: any) => {
    const disable = checkPermassion(item);
    const percent = item[fieldNames.progress] * 100;
    if (item.children && item.children.length) {
      const start = getValuesByPath(item, fieldNames.start);
      const end = getValuesByPath(item, fieldNames.end);
      const startIdx = tasks.length;
      tasks.push({
        index: startIdx,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        progress: percent > 100 ? 100 : percent || 0,
        // 获取子任务 及自己 start的最小值
        // start: new Date(start ?? undefined),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: item.ganttBarType ? item.ganttBarType : 'project',
        // progress: percent > 100 ? 100 : percent || 0,
        hideChildren: hideChildren,
        project: projectId,
        color: getItemColor(item, token),
        isDisabled: disable,
        dependencies: (item.dependencies || []).map(({ id }) => {
          return id + '';
        }),
        projectItem: {
          // type:'project',
          start: findMinStart(item, start ? new Date(start) : undefined),
          // 获取子任务 及自己 end的最大值
          // end: new Date(end ?? undefined),
          end: findMaxEnd(item, end ? new Date(end) : undefined),
        },
        isGroup: item.isGroup,
        groupType: item.groupType,
        rowKey: item.rowKey
      });
      formatData(item.children, fieldNames, tasks, item.id + '', hideChildren, checkPermassion, treeData, token);
    } else {
      const start = getValuesByPath(item, fieldNames.start);
      const end = getValuesByPath(item, fieldNames.end);
      const startIdx = tasks.length;
      tasks.push({
        index: startIdx,
        start: start ? new Date(start) : undefined,
        end: new Date(end || start),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: item.ganttBarType ? item.ganttBarType : fieldNames.end ? 'task' : 'milestone',
        progress: percent > 100 ? 100 : percent || 0,
        project: projectId,
        color: getItemColor(item, token),
        isDisabled: disable,
        dependencies: (item.dependencies || []).map(({ id }) => {
          return id + '';
        }),
        isGroup: item.isGroup,
        groupType: item.groupType,
        rowKey: item.rowKey
      });
    }
  });
  return tasks;
};
export const usePrjWorkPlanGanttBlockProps = () => {
  const ctx = useGanttBlockContext();
  const [tasks, setTasks] = useState<any>([]);
  const [rightSize, setRightSize] = useState<any>(ctx.rightSize);
  const { getPrimaryKey, name, template, writableView } = useCollection();
  const { parseAction } = useACLRoleContext();
  const primaryKey = getPrimaryKey();
  const checkPermassion = (record) => {
    const actionPath = `${name}:update`;
    const schema = {};
    const recordPkValue = record?.[primaryKey];
    const params = parseAction(actionPath, { schema, recordPkValue });
    return (template === 'view' && !writableView) || !params;
  };
  const headerHeight = document.querySelector('.ant-table-thead')?.clientHeight || 0;
  const [ganttHeight, setGanttHeight] = useState<any>(`calc(100% - ${headerHeight}px)`);
  const [hasScroll, setHasScroll] = useState<any>(false);

  const onExpanderClick = (task: any) => {
    const data = ctx.field.data;
    const tasksData = data.map((t: any) => (t.id === task.id ? task : t));
    setTasks(tasksData);
    ctx.field.data = tasksData;
  };
  const expandAndCollapseAll = (flag) => {
    const data = formatData(
      preProcessData(ctx.service.data?.data),
      ctx.fieldNames,
      [],
      undefined,
      flag,
      checkPermassion,
      preProcessData(ctx.service.data?.data),
      ctx.token,
    );
    setTasks(data);
    ctx.field.data = data;
  };
  const onResize = (size, hasScroll, dom, comp) => {
    setGanttHeight(size);
    setHasScroll(hasScroll);
    setRightSize(comp.props.flex);
  };
  useEffect(() => {
    setRightSize(ctx.rightSize);
  }, [ctx.rightSize]);
  useEffect(() => {
    if (!ctx?.service?.loading) {
      let data;
      data = formatData(
        preProcessData(ctx.service.data?.data),
        ctx.fieldNames,
        [],
        undefined,
        false,
        checkPermassion,
        preProcessData(ctx.service.data?.data),
        ctx.token,
      );
      if (data) {
        setTasks(data);
        ctx.field.data = data;
      }
    }
  }, [ctx?.service?.loading]);
  return {
    fieldNames: ctx.fieldNames,
    timeRange: ctx.timeRange,
    onExpanderClick,
    expandAndCollapseAll,
    tasks,
    ganttHeight,
    onResize,
    hasScroll,
    rightSize,
    preProcessData,
    height:'calc(100vh - 52px - 40px - 24px * 2 - 10px - 24px * 2 - 52px - 44px - 46px - 16px)',
  };
};

export const useTaskTableBlockProps = () => {
  const field = useField<ArrayField>();
  const fieldSchema = useFieldSchema();
  const ctx = useTableBlockContext();
  const globalSort = fieldSchema.parent?.['x-decorator-props']?.['params']?.['sort'];
  const { getDataBlocks } = useFilterBlock();

  useEffect(() => {
    if (!ctx?.service?.loading) {
      field.value = [];
      field.value = ctx?.service?.data?.data;
      field.data = field.data || {};
      field.data.selectedRowKeys = ctx?.field?.data?.selectedRowKeys;
      field.componentProps.pagination = field.componentProps.pagination || {};
      field.componentProps.pagination.pageSize = ctx?.service?.data?.meta?.pageSize;
      field.componentProps.pagination.total = ctx?.service?.data?.meta?.count;
      field.componentProps.pagination.current = ctx?.service?.data?.meta?.page;
    }
  }, [ctx?.service?.loading]);
  return {
    childrenColumnName: ctx.childrenColumnName,
    loading: ctx?.service?.loading,
    showIndex: ctx.showIndex,
    dragSort: ctx.dragSort,
    rowKey: ctx.rowKey || 'id',
    pagination:
      ctx?.params?.paginate !== false
        ? {
            defaultCurrent: ctx?.params?.page || 1,
            defaultPageSize: ctx?.params?.pageSize,
          }
        : false,
    onRowSelectionChange(selectedRowKeys) {
      console.log(selectedRowKeys);
      ctx.field.data = ctx?.field?.data || {};
      ctx.field.data.selectedRowKeys = selectedRowKeys;
      ctx?.field?.onRowSelect?.(selectedRowKeys);
    },
    async onRowDragEnd({ from, to }) {
      await ctx.resource.move({
        sourceId: from[ctx.rowKey || 'id'],
        targetId: to[ctx.rowKey || 'id'],
      });
      ctx.service.refresh();
    },
    onChange({ current, pageSize }, filters, sorter) {
      const sort = sorter.order
        ? sorter.order === `ascend`
          ? [sorter.field]
          : [`-${sorter.field}`]
        : globalSort || ctx.service.params?.[0]?.sort;
      ctx.service.run({ ...ctx.service.params?.[0], page: current, pageSize, sort });
    },
    onClickRow(record, setSelectedRow, selectedRow) {
      const { targets, uid } = findFilterTargets(fieldSchema);
      const dataBlocks = getDataBlocks();

      // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
      if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
        // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
        // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
        setSelectedRow((prev) => (prev.length ? [] : prev));
        return;
      }

      const value = [record[ctx.rowKey]];

      dataBlocks.forEach((block) => {
        const target = targets.find((target) => target.uid === block.uid);
        if (!target) return;

        const param = block.service.params?.[0] || {};
        // 保留原有的 filter
        const storedFilter = block.service.params?.[1]?.filters || {};

        if (selectedRow.includes(record[ctx.rowKey])) {
          delete storedFilter[uid];
        } else {
          storedFilter[uid] = {
            $and: [
              {
                [target.field || ctx.rowKey]: {
                  [target.field ? '$in' : '$eq']: value,
                },
              },
            ],
          };
        }

        const mergedFilter = mergeFilter([
          ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
          block.defaultFilter,
        ]);

        return block.doFilter(
          {
            ...param,
            page: 1,
            filter: mergedFilter,
          },
          { filters: storedFilter },
        );
      });

      // 更新表格的选中状态
      setSelectedRow((prev) => (prev?.includes(record[ctx.rowKey]) ? [] : [...value]));
    },
    onExpand(expanded, record) {
      ctx?.field.onExpandClick?.(expanded, record);
    },
  };
};
