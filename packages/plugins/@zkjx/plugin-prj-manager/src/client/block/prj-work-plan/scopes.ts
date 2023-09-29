import { useTableBlockProps } from '@nocobase/client';
import { getValuesByPath } from '@nocobase/utils/client';

const flattenTree = (treeData = [], callback?) => {
  return treeData.reduce((acc, node) => {
    if (node.children) {
      const { children, ...others } = node;
      return acc.concat([{ ...others }, ...flattenTree(children, callback)]);
    } else {
      if (typeof callback == 'function') {
        callback(node);
      }
      return acc.concat(node);
    }
  }, []);
};
const transformTaskData = (list, ctx) => {
  const resourceName = ctx.collection || ctx.resource;
  const groupField = ctx.groupField;
  return list.map((node) => {
    const { id, children = [], dependencies = [], ...others } = node;
    return {
      id,
      ...others,
      __collection: resourceName,
      __fieldName: null,
      rowKey: [resourceName, id].join('_'),
      groupRowKey: node[groupField.name]
        ? [[groupField.target], node[groupField.name][groupField.targetKey]].join('_')
        : 'others',
      dependencies: transformTaskData(dependencies, ctx),
      children: transformTaskData(children, ctx),
    };
  });
};
const preProcessData = (data, ctx) => {
  const _groups = ctx.groups;
  const groupField = ctx.groupField;
  if (
    !_groups.filter(({ rowKey }) => {
      return rowKey == 'others';
    }).length
  ) {
    _groups.push({
      rowKey: 'others',
      title: '其他',
    });
  }
  const groups = _groups.map((record, index) => {
    const { id, ...others } = record;
    const groupItem = {
      ...others,
      id,
      isGroup: true,
      __collection: id ? groupField.target : null,
      __fieldName: id ? groupField.name : null,
      rowKey: id ? [groupField.target, id].join('_') : record.rowKey,
      title: id ? getValuesByPath(record, groupField.title) : record.title,
      __index: index + '',
    }
    if(id){
      groupItem['fieldCtx'] = groupField;
    }
    return groupItem;
  });
  let list: any[] = [];
  if (data && data.length) {
    const treeData = transformTaskData(data, ctx);
    list = list.concat(flattenTree(treeData));
  }
  const groupList = (list as any).group((data) => {
    return data.groupRowKey;
  });

  groups.forEach((item, index1) => {
    const children = groupList[item.rowKey]?.map((node, index2) => {
      return {
        ...node,
        __index: [index1, index2].join('.'),
      };
    });
    item.children = children;
  });
  // groups.push({
  //   id:'others',
  //   isGroup:true,
  //   rowKey:'others',
  //   __resource:null,
  //   title:'其他',
  //   children:groupList['others']
  // });
  /** 重新更新 record __index */
  // let __index = -1;
  // flattenTree(groups,(node)=>{
  //   ++__index;
  //    node.__index = __index;
  // })
  return groups;
};
export const usePrjWorkPlanProcessData = preProcessData;
export const usePrjWorkPlanTableBlockProps = () => {
  const props = useTableBlockProps();
  return {
    ...props,
  };
};
