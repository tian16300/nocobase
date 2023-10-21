import { useField } from '@formily/react';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useACLRoleContext } from '../acl/ACLProvider';
import { useCollection, useCollectionManager } from '../collection-manager/hooks';
import { useBlockRequestContext } from './BlockProvider';
import { TableBlockProvider } from './TableBlockProvider';
import { IField, useAssociationNames, useToken } from '..';
import { getValuesByPath } from '@nocobase/utils/client';
import { pick } from 'lodash';

export const GanttBlockContext = createContext<any>({});
const getItemColor = (item, token) => {
  const colorName = item.color || item.status?.color;
  if (colorName) {
    if (colorName.indexOf('#') !== -1 || colorName.indexOf('rgb') !== -1 || colorName.indexOf('rgba') !== -1) {
      return colorName;
    } if(colorName.indexOf('-')!==-1){
      return token[colorName];
    } 
    else {
      return token['color' + [(colorName[0] as string).toLocaleUpperCase() + colorName.slice(1, colorName.length)]];
    }
  }
  return null;
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
      cEnd = findMinStart(child, cEnd);
    }
  });
  return cEnd;
};
const getProgressValue = (item, fieldNames) => {
  let progress = null;
  if (fieldNames.progress) {
    const value = item[fieldNames.progress];
    const percent = value * 100;
    progress = percent > 100 ? 100 : percent || 0;
  }
  return progress;
};
const getTaskItem = (item, fieldNames, checkPermassion, ctx) => {
  const disable = checkPermassion(item);
  const itemValues = pick(item, ['seriesName','title','isHidden','isHiddenTitle','remark','isDiff','isDisabled','type','schemaName','isGroup', 'groupRowKey', 'rowKey', 'fieldCtx']);
  const start = getValuesByPath(item, fieldNames.start);
  const end = getValuesByPath(item, fieldNames.end);
  return {
    start: start ? new Date(start) : undefined,
    end: end ? new Date(end) : undefined,
    // 获取子任务 及自己 start的最小值
    // start: new Date(start ?? undefined),
    name: getValuesByPath(item, fieldNames.title) || '',
    id: item.id + '',
    color: getItemColor(item, ctx.token),
    isDisabled: disable,
    progress:getProgressValue(item, fieldNames),
    ...itemValues,
    dependencies: (item.dependencies || []).map((record) => {
      return record[ctx.rowKey];
    })
  };
};
const formatData = (
  data = [],
  fieldNames,
  tasks: any[] = [],
  projectId: any = undefined,
  hideChildren = false,
  checkPermassion?: (any) => boolean,
  treeData = data,
  ctx: any = {},
) => {
  data.forEach((item: any) => {
    if (item.children && item.children.length) {
      const startIdx = tasks.length;
      const data = item.data?item.data?.map((item)=>{
        return {
          project: projectId,
          ...getTaskItem(item,fieldNames,checkPermassion,ctx)
        }
      }):[
        {
           
          project: projectId,
          ...getTaskItem(item,fieldNames,checkPermassion,ctx)
        }
      ];
      tasks.push({
        index: startIdx,
        ...getTaskItem(item,fieldNames,checkPermassion,ctx),   
        type: 'project',     
        hideChildren: hideChildren,
        project: projectId,
        data: data,
      });
      formatData(item.children, fieldNames, tasks, item[ctx.rowKey] + '', hideChildren, checkPermassion, treeData, ctx);
    } else {
      const startIdx = tasks.length;
      const data = item.data?item.data?.map((item)=>{
        return {
          project: projectId,
          ...getTaskItem(item,fieldNames,checkPermassion,ctx)
        }
      }):[
        {
           
          project: projectId,
          ...getTaskItem(item,fieldNames,checkPermassion,ctx)
        }
      ];

      tasks.push({
        index: startIdx,
        ...getTaskItem(item,fieldNames,checkPermassion,ctx),         
        project: projectId,   
        data: data
      });
    }
  });
  return tasks;
};

const InternalGanttBlockProvider = (props) => {
  const {
    fieldNames,
    timeRange,
    resource,
    rightSize,
    rowKey = 'id',
    group,
    preProcessData = (data, props) => {
      return data;
    },
    ...others
  } = props;
  const field:IField = useField();
  const { service } = useBlockRequestContext();
  const { token } = useToken(); 

  return (
    <GanttBlockContext.Provider
      value={{
        ...others,
        group,
        rowKey,
        field,
        service,
        resource,
        fieldNames,
        timeRange,
        rightSize,
        token,
        preProcessData,
      }}
    >
      {props.children}
    </GanttBlockContext.Provider>
  );
};
const transformData = (list, ctx) => {
  const resourceName = ctx.collection || ctx.resource;
  return list.map((node) => {
    const { id, children = [], dependencies = [], ...others } = node;
    return {
      id,
      ...others,
      __collection: resourceName,
      rowKey: [resourceName, id].join('_'),
      dependencies: transformData(dependencies, ctx),
      children: transformData(children, ctx),
    };
  });
};
const addIndex = (children, parentIndex) => {
  if (children) {
    children.forEach((child, index) => {
      child.__index = [parentIndex, index].join('.');
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
export const groupData = (data, group, ctx) => {
  const fields = ctx.fields;
  if (data && data.length) {
    if (group) {
      let list: any[] = [];
      const treeData = transformData(data, ctx);
      list = list.concat(flattenTree(treeData));
      const groupName = group;
      // const titleFieldName = ctx?.fieldNames?.title;
      const groupField =
        ctx.groupField ||
        fields.filter((field) => {
          return field.name == groupName;
        })[0];
      const groupValuesMap = new Map();
      const groupListObj = (list as any).group((record) => {
        const groupFieldValue = record[groupName];
        if (groupFieldValue) {
          record.groupRowKey = [groupField.target, groupFieldValue[groupField.targetKey]].join('_');
          groupValuesMap.set(record.groupRowKey, groupFieldValue);
        }
        return record.groupRowKey;
      });
      const newData = Object.keys(groupListObj).map((key, index1) => {
        const value = key ? groupValuesMap.get(key) : {};
        const __index = index1 + '';
        const children = toTreeData(groupListObj[key], __index);
        return {
          ...value,
          rowKey: key,
          isGroup: true,
          __collection: groupField.target,
          fieldCtx: {
            ...groupField,
          },
          __index: __index,
          children: children,
        };
      });
      return newData;
    } else {
      return data;
    }
  }
  return data;
};
export const processDataToGroups = (data, ctx) => {
  const _group = ctx.group;
  return groupData(data, _group, ctx);
};

export const GanttBlockProvider = (props) => {
  const { collection, fields, ...others } = props;
  const { getCollectionFields } = useCollectionManager();
  const names = Array.from(
    new Set(
      [...(fields?.groups || []), ...(fields?.sort || [])].map(({ value }) => {
        return value;
      }),
    ),
  );
  const _fields = getCollectionFields(collection).filter((field) => {
    return names.includes(field.name);
  });
  const range = props.timeRange || props?.fieldNames?.range || 'day';
  const [timeRange, setTimeRange] = useState(range);
  const preProcessData = props.preProcessData || processDataToGroups;
  const [rowKey, setRowKey] = useState(props.rowKey || (props.group ? 'rowKey' : 'id'));
  const [group, setGroup] = useState(props.group);
  const [sort, setSort] = useState(props.sort);
  const filter = useMemo(() => {
    return props.params.filter;
  }, [props.params.filter]);
  const params = useMemo(() => {
    const sortField: any = _fields.filter((field) => {
      return field.name == sort;
    })[0];

    const sortName = sortField
      ? ['dic'].includes(sortField?.interface)
        ? sortField?.foreignKey
        : sortField?.name
      : sort;
    const { appends } = useAssociationNames();
    if (sortField && ['dic'].includes(sortField.interface)) {
      appends.push(sortField.name);
    }
    if (fields?.groups) {
      fields?.groups.forEach((field) => {
        appends.push(field.name);
      });
    }
    const _appends = Array.from(new Set([...(props.params.appends || []), ...appends]));
    return {
      filter: filter,
      sort: sortName,
      tree: true,
      paginate: false,
      appends: _appends,
    };
  }, [filter, sort]);
  return (
    <TableBlockProvider
      {...others}
      data-testid="gantt-block"
      group={props.group || group}
      setGroup={props.setGroup || setGroup}
      collection={collection}
      fields={_fields}
      params={params}
      preProcessData={preProcessData}
      rowKey={rowKey}
      setRowKey={setRowKey}
    >
      <InternalGanttBlockProvider
        {...others}
        sort={sort}
        setSort={setSort}
        group={props.group || group}
        setGroup={props.setGroup || setGroup}
        collection={collection}
        fields={_fields}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        preProcessData={preProcessData}
        rowKey={rowKey}
        setRowKey={setRowKey}
      />
    </TableBlockProvider>
  );
};

export const useGanttBlockContext = () => {
  return useContext(GanttBlockContext);
};

export const useGanttBlockProps = (_props) => {
  const ctx = useGanttBlockContext();
  const  props = {
    ..._props,
    ...ctx
  };
  const preProcessData = ctx.preProcessData || ((data: any) => data || []);
  const [tasks, setTasks] = useState<any>([]);
  const [rightSize, setRightSize] = useState<any>(ctx.rightSize);
  const { getPrimaryKey, name, template, writableView } = useCollection();
  const { parseAction } = useACLRoleContext();
  const primaryKey = getPrimaryKey();
  const checkPermission = (record) => {
    const actionPath = `${name}:update`;
    const schema = {};
    const recordPkValue = record?.[primaryKey];
    const params = parseAction(actionPath, { schema, recordPkValue });
    return (template === 'view' && !writableView) || !params;
  };
  const headerHeight = document.querySelector('.ant-table-thead')?.clientHeight || 0;
  const [ganttHeight, setGanttHeight] = useState<any>(`calc(100% - ${headerHeight}px)`);
  const [hasScroll, setHasScroll] = useState<any>(false);
  const { rowkey = 'id' } = ctx;

  const onExpanderClick = (task: any) => {
    const data = ctx.field.data;
    const tasksData = data.map((t: any) => (task[rowkey] === t[rowkey] ? task : t));
    setTasks(tasksData);
    ctx.field.data = tasksData;
  };
  const expandAndCollapseAll = (flag) => {
    const data = formatData(
      preProcessData(ctx.service.data?.data, ctx),
      ctx.fieldNames,
      [],
      undefined,
      flag,
      checkPermission,
      preProcessData(ctx.service.data?.data, ctx),
      ctx,
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
        preProcessData(ctx.service.data?.data, ctx),
        ctx.fieldNames,
        [],
        undefined,
        false,
        checkPermission,
        preProcessData(ctx.service.data?.data, ctx),
        ctx,
      );
      if (data) {
        setTasks(data);
        ctx.field.data = data;
      }
    }
  }, [ctx?.service?.loading]);
  return {
    ...props,
    fieldNames: ctx.fieldNames,
    timeRange: ctx.timeRange,
    onExpanderClick,
    expandAndCollapseAll,
    tasks,
    ganttHeight,
    onResize,
    hasScroll,
    rightSize,
  };
};

export const useGanttBlockFormItemProps = () => {
  const field = useField();
  return {
    options: [],
  };
};
