import { useField } from '@formily/react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useACLRoleContext } from '../acl/ACLProvider';
import { useCollection } from '../collection-manager/hooks';
import { BlockProvider, useBlockRequestContext } from './BlockProvider';
import { TableBlockProvider } from './TableBlockProvider';
import { useAssociationNames, useToken } from '..';
import { getValuesByPath } from '@nocobase/utils/client';

export const GanttBlockContext = createContext<any>({});
const findParentsId = (treeData, id) => {
  if (treeData.length == 0) return;
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].id == id) {
      return [];
    } else {
      if (treeData[i].children) {
        let res = findParentsId(treeData[i].children, id);
        if (res !== undefined) {
          return res.concat(treeData[i].id + '').reverse();
        }
      }
    }
  }
};
function setParentsId(childId, orgList) {
  const result = findParentsId(orgList, childId).concat(childId + '');
  return result || [];
}

function getParentsId(childId, orgList) {
  const result = findParentsId(orgList, childId);
  return result || [];
}
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
const getMinStart = (item) => {
  const start = item.start ? new Date(item.start) : undefined;
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
      const {isGroup,groupType,rowKey} = item;
      tasks.push({
        index: startIdx,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        progress: percent > 100 ? 100 : percent || 0,
        // 获取子任务 及自己 start的最小值
        // start: new Date(start ?? undefined),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: 'project',
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
        isGroup,
        groupType,
        rowKey
      });
      formatData(item.children, fieldNames, tasks, item.id + '', hideChildren, checkPermassion, treeData, token);
    } else {
      const start = getValuesByPath(item, fieldNames.start);
      const end = getValuesByPath(item, fieldNames.end);
      const startIdx = tasks.length;
      const {isGroup,groupType,rowKey} = item;
      tasks.push({
        index: startIdx,
        start: start ? new Date(start) : undefined,
        end: new Date(end || start),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: fieldNames.end ? 'task' : 'milestone',
        progress: percent > 100 ? 100 : percent || 0,
        project: projectId,
        color: getItemColor(item, token),
        isDisabled: disable,
        dependencies: (item.dependencies || []).map(({ id }) => {
          return id + '';
        }),
        isGroup,
        groupType,
        rowKey
      });
    }
  });
  return tasks;
};

const formatGroupData = (
  groups = [],
  data = [],
  fieldNames,
  tasks: any[] = [],
  projectId: any = undefined,
  hideChildren = false,
  checkPermassion?: (any) => boolean,
  treeData = data,
  token = {},
) => {
   
  // data.forEach((item: any) => {
  //   const disable = checkPermassion(item);
  //   const percent = item[fieldNames.progress] * 100;
  //   if (item.children && item.children.length) {
  //     const start = getValuesByPath(item, fieldNames.start);
  //     const end = getValuesByPath(item, fieldNames.end);
  //     const startIdx = tasks.length;
  //     tasks.push({
  //       index: startIdx,
  //       start: start ? new Date(start) : undefined,
  //       end: end ? new Date(end) : undefined,
  //       progress: percent > 100 ? 100 : percent || 0,
  //       // 获取子任务 及自己 start的最小值
  //       // start: new Date(start ?? undefined),
  //       name: getValuesByPath(item, fieldNames.title) || '',
  //       id: item.id + '',
  //       type: 'project',
  //       // progress: percent > 100 ? 100 : percent || 0,
  //       hideChildren: hideChildren,
  //       project: projectId,
  //       color: getItemColor(item, token),
  //       isDisabled: disable,
  //       dependencies: (item.dependencies || []).map(({ id }) => {
  //         return id + '';
  //       }),
  //       projectItem: {
  //         // type:'project',
  //         start: findMinStart(item, start ? new Date(start) : undefined),
  //         // 获取子任务 及自己 end的最大值
  //         // end: new Date(end ?? undefined),
  //         end: findMaxEnd(item, end ? new Date(end) : undefined),
  //       },
  //     });
  //     formatData(item.children, fieldNames, tasks, item.id + '', hideChildren, checkPermassion, treeData, token);
  //   } else {
  //     const start = getValuesByPath(item, fieldNames.start);
  //     const end = getValuesByPath(item, fieldNames.end);
  //     const startIdx = tasks.length;
  //     tasks.push({
  //       index: startIdx,
  //       start: start ? new Date(start) : undefined,
  //       end: new Date(end || start),
  //       name: getValuesByPath(item, fieldNames.title) || '',
  //       id: item.id + '',
  //       type: fieldNames.end ? 'task' : 'milestone',
  //       progress: percent > 100 ? 100 : percent || 0,
  //       project: projectId,
  //       color: getItemColor(item, token),
  //       isDisabled: disable,
  //       dependencies: (item.dependencies || []).map(({ id }) => {
  //         return id + '';
  //       }),
  //     });
  //   }
  // });
  // return tasks;
};
const InternalGanttBlockProvider = (props) => {
  const { fieldNames, timeRange, resource, rightSize, preProcessData } = props;
  const field = useField();
  const { service } = useBlockRequestContext();
  // if (service.loading) {
  //   return <Spin />;
  // }
  const { token } = useToken();
  return (
    <GanttBlockContext.Provider
      value={{
        field,
        service,
        resource,
        fieldNames,
        timeRange,
        rightSize,
        token,
        preProcessData
      }}
    >
      {props.children}
    </GanttBlockContext.Provider>
  );
};

export const GanttBlockProvider = (props) => {
  const { appends } = useAssociationNames();
  const params = {
    filter: props.params.filter,
    // tree: true,
    tree: true,
    paginate: false,
    // sort: props.fieldNames.start,
    appends: Array.from(new Set([...(props.params.appends || []), ...appends])),
  };
  return (
    <TableBlockProvider {...props} params={params}>
      <InternalGanttBlockProvider {...props} />
    </TableBlockProvider>
  );
};

export const useGanttBlockContext = () => {
  return useContext(GanttBlockContext);
};

export const useGanttBlockProps = () => {
  const ctx = useGanttBlockContext();
  const preProcessData = ctx.preProcessData || ((data: any) => data||[]);
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
    const tasksData = data.map((t: any) => (t.rowkey === task.rowkey ? task : t));
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
  };
};
