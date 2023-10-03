import { groupData, useTableBlockProps } from '@nocobase/client';
import { getValuesByPath } from '@nocobase/utils/client';

const preProcessData = (data, ctx) => {
  const group = ctx.group;

  const _groups = ctx.groupData;
  const groupField = ctx.groupField;
  // if (
  //   !_groups.filter(({ rowKey }) => {
  //     return rowKey == 'others';
  //   }).length
  // ) {
  //   // _groups.push({
  //   //   rowKey: 'others',
  //   //   title: '其他',
  //   // });
  // }
  const groups = _groups.map((record, index) => {
    const { id, start, end, ...others } = record;
    const groupItem = {
      id,
      rowKey: id ? [groupField.target, id].join('_') : record.rowKey,
      title: id ? getValuesByPath(record, groupField.title) : record.title,
      __index: index + '',
      start,
      end,
      isGroup: true,
      __collection:groupField.target,
      ...others
    };
    if (id) {
      groupItem['fieldCtx'] = groupField;
    }
    return groupItem;
  });
  const groupList = groupData(data, group, ctx) || [];
  const newGroups = groups.map((item, index1) => {
    const _nItem =
      groupList.filter(({ rowKey }) => {
        return rowKey == item.rowKey;
      })[0] || {};
    const obj = {
      ..._nItem,
      ...item,
      __index: index1 + '',
    };
    obj.children = obj.children?.map((child, index2) => {
      child.__index = [index1, index2].join('.');
      return child;
    });

    return obj;
  });
  newGroups.sort(groupField.sort);
  return newGroups;
};
export const usePrjWorkPlanProcessData = preProcessData;
export const usePrjWorkPlanTableBlockProps = () => {
  const props = useTableBlockProps();
  return {
    ...props,
  };
};
