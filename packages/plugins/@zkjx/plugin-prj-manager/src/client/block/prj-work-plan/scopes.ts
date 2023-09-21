import { ArrayField, createForm } from '@formily/core';
import { FormContext, useField, useFieldSchema } from '@formily/react';
import {
  findFilterTargets,
  mergeFilter,
  removeNullCondition,
  useBlockRequestContext,
  useCollectionManager,
  useFilterBlock,
  useTableBlockContext,
  useTableBlockProps,
} from '@nocobase/client';
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

export const useStageTableBlockProps = () => {
  const field = useField<ArrayField>();
  const fieldSchema = useFieldSchema();
  const ctx = useTableBlockContext();
  const globalSort = fieldSchema.parent?.['x-decorator-props']?.['params']?.['sort'];
  const { getDataBlocks } = useFilterBlock();
  const { getCollectionField } = useCollectionManager();
  const planCtx = ctx.__parent;
  const props = useTableBlockProps();

  useEffect(() => {
    if (!ctx?.service?.loading && !planCtx?.service?.loading) {
      const planList = planCtx?.service?.data?.data;
      const taskList = ctx?.service?.data?.data;
      field.value = [];
      field.value = compPlanTask(planList, taskList);
      field.data = field.data || {};
      field.data.selectedRowKeys = ctx?.field?.data?.selectedRowKeys;
      field.componentProps.pagination = field.componentProps.pagination || {};
      field.componentProps.pagination.pageSize = ctx?.service?.data?.meta?.pageSize;
      field.componentProps.pagination.total = ctx?.service?.data?.meta?.count;
      field.componentProps.pagination.current = ctx?.service?.data?.meta?.page;
    }
  }, [ctx?.service?.loading, planCtx?.service?.loading]);
  return {
    ...props,
    childrenColumnName: ctx.childrenColumnName,
    loading: ctx?.service?.loading,
    showIndex: ctx.showIndex,
    dragSort: ctx.dragSort,
    //   rowKey: ctx.rowKey || 'id',
    rowKey: 'key',
    // pagination:
    //   ctx?.params?.paginate !== false
    //     ? {
    //         defaultCurrent: ctx?.params?.page || 1,
    //         defaultPageSize: ctx?.params?.pageSize,
    //       }
    //     : false,
    // onRowSelectionChange(selectedRowKeys) {
    //   console.log(selectedRowKeys);
    //   ctx.field.data = ctx?.field?.data || {};
    //   ctx.field.data.selectedRowKeys = selectedRowKeys;
    //   ctx?.field?.onRowSelect?.(selectedRowKeys);
    // },
    // async onRowDragEnd({ from, to }) {
    //   await ctx.resource.move({
    //     sourceId: from[ctx.rowKey || 'id'],
    //     targetId: to[ctx.rowKey || 'id'],
    //   });
    //   ctx.service.refresh();
    // },
    // onChange({ current, pageSize }, filters, sorter) {
    //   let sorterKey = sorter.field;
    // //   const field = getCollectionField(ctx.resource+'.'+sorterKey);
    // //   console.log(field);
    //   // sorter field 如果是字典 sorterKey 则是它的外键
    //   if(sorter?.column?.isDicField){
    //     sorterKey = sorter?.column?.sorterKey;
    //   }
    //   const sort = sorter.order
    //     ? sorter.order === `ascend`
    //       ? [sorterKey]
    //       : [`-${sorterKey}`]
    //     : globalSort || ctx.service.params?.[0]?.sort;
    //   ctx.service.run({ ...ctx.service.params?.[0], page: current, pageSize, sort });
    // },
    // onClickRow(record, setSelectedRow, selectedRow) {
    //   const { targets, uid } = findFilterTargets(fieldSchema);
    //   const dataBlocks = getDataBlocks();

    //   // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
    //   if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
    //     // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
    //     // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
    //     setSelectedRow((prev) => (prev.length ? [] : prev));
    //     return;
    //   }

    //   const value = [record[ctx.rowKey]];

    //   dataBlocks.forEach((block) => {
    //     const target = targets.find((target) => target.uid === block.uid);
    //     if (!target) return;

    //     const param = block.service.params?.[0] || {};
    //     // 保留原有的 filter
    //     const storedFilter = block.service.params?.[1]?.filters || {};

    //     if (selectedRow.includes(record[ctx.rowKey])) {
    //       delete storedFilter[uid];
    //     } else {
    //       storedFilter[uid] = {
    //         $and: [
    //           {
    //             [target.field || ctx.rowKey]: {
    //               [target.field ? '$in' : '$eq']: value,
    //             },
    //           },
    //         ],
    //       };
    //     }

    //     const mergedFilter = mergeFilter([
    //       ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
    //       block.defaultFilter,
    //     ]);

    //     return block.doFilter(
    //       {
    //         ...param,
    //         page: 1,
    //         filter: mergedFilter,
    //       },
    //       { filters: storedFilter },
    //     );
    //   });

    //   // 更新表格的选中状态
    //   setSelectedRow((prev) => (prev?.includes(record[ctx.rowKey]) ? [] : [...value]));
    // },
    // onExpand(expanded, record) {
    //   ctx?.field.onExpandClick?.(expanded, record);
    // },
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
