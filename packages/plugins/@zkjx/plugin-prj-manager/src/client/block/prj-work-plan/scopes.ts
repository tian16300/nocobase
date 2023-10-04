import { groupData, useTableBlockProps } from '@nocobase/client';
import { getValuesByPath } from '@nocobase/utils/client';

const addIndex = (children, parentIndex) => {
  if (children) {
    children.forEach((child, index) => {
      child.__index = [parentIndex, index]
        .filter((value) => {
          return value != null;
        })
        .join('.');
      if (child.children) {
        addIndex(child.children, child.__index);
      }
    });
  }
};
const toTreeData = (children, parentIndex) => {
  if (children) {
    const list = [];
    children.forEach((child, index) => {
      if (child.parentId) {
        const parent = children.filter(({ id }) => {
          return id == child.parentId;
        })[0];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      } else {
        list.push(child);
      }
    });
    addIndex(list, parentIndex);
    return list;
  }
  return children;
};

const preProcessData = (data, ctx) => {
  const group = ctx.group;
  const _groups = ctx.groupData;
  const groupField = ctx.groupField;
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
      __collection: groupField.target,
      ...others,
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
    obj.children = toTreeData(obj.children, obj.__index);
    return obj;
  });
  newGroups.sort(groupField.sort);
  addIndex(newGroups, null);
  return newGroups;
};
export const usePrjWorkPlanProcessData = preProcessData;
export const usePrjWorkPlanTableBlockProps = () => {
  const props = useTableBlockProps();
  return {
    ...props,
  };
};
