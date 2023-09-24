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
        type: fieldNames.end ? 'task' : 'milestone',
        progress: percent > 100 ? 100 : percent || 0,
        project: projectId,
        color: getItemColor(item, token),
        isDisabled: disable,
        dependencies: (item.dependencies || []).map(({ id }) => {
          return id + '';
        }),
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
const groupData = [
  {
    createdAt: '2023-09-22T05:03:56.927Z',
    updatedAt: '2023-09-22T05:03:56.946Z',
    prjId: 95,
    stage_dicId: 37,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 99,
    stage: {
      id: 37,
      createdAt: '2023-09-13T14:35:19.135Z',
      updatedAt: '2023-09-13T14:35:19.135Z',
      label: '厂内调试',
      value: '7',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.955Z',
    updatedAt: '2023-09-22T05:03:56.975Z',
    prjId: 95,
    stage_dicId: 38,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 100,
    stage: {
      id: 38,
      createdAt: '2023-09-13T14:35:19.173Z',
      updatedAt: '2023-09-13T14:35:19.173Z',
      label: '出厂验收',
      value: '8',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.982Z',
    updatedAt: '2023-09-22T05:03:57.001Z',
    prjId: 95,
    stage_dicId: 39,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 101,
    stage: {
      id: 39,
      createdAt: '2023-09-13T14:35:19.214Z',
      updatedAt: '2023-09-13T14:35:19.214Z',
      label: '物流',
      value: '9',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:57.040Z',
    updatedAt: '2023-09-22T05:03:57.062Z',
    prjId: 95,
    stage_dicId: 41,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 103,
    stage: {
      id: 41,
      createdAt: '2023-09-13T14:35:19.325Z',
      updatedAt: '2023-09-13T14:35:19.325Z',
      label: '客方调试',
      value: '11',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:57.071Z',
    updatedAt: '2023-09-22T05:03:57.091Z',
    prjId: 95,
    stage_dicId: 42,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 104,
    stage: {
      id: 42,
      createdAt: '2023-09-13T14:35:19.363Z',
      updatedAt: '2023-09-13T14:35:19.363Z',
      label: '试运行',
      value: '12',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:57.100Z',
    updatedAt: '2023-09-22T05:03:57.123Z',
    prjId: 95,
    stage_dicId: 43,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 105,
    stage: {
      id: 43,
      createdAt: '2023-09-13T14:35:19.388Z',
      updatedAt: '2023-09-13T14:35:19.388Z',
      label: '终验收',
      value: '13',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.848Z',
    updatedAt: '2023-09-24T02:21:54.294Z',
    prjId: 95,
    stage_dicId: 34,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-12-30T16:00:00.000Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-08-31T16:00:00.000Z',
    id: 96,
    stage: {
      id: 34,
      createdAt: '2023-09-13T14:35:18.990Z',
      updatedAt: '2023-09-13T14:35:18.990Z',
      label: '细化设计',
      value: '4',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.797Z',
    updatedAt: '2023-09-24T02:22:30.118Z',
    prjId: 95,
    stage_dicId: 32,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-10-22T14:38:56.797Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-09-23T16:00:00.000Z',
    id: 94,
    stage: {
      id: 32,
      createdAt: '2023-09-13T14:35:18.889Z',
      updatedAt: '2023-09-13T14:35:18.889Z',
      label: '方案设计',
      value: '2',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.823Z',
    updatedAt: '2023-09-24T02:22:47.562Z',
    prjId: 95,
    stage_dicId: 33,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-10-23T02:18:56.823Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-09-20T16:00:00.000Z',
    id: 95,
    stage: {
      id: 33,
      createdAt: '2023-09-13T14:35:18.935Z',
      updatedAt: '2023-09-13T14:35:18.935Z',
      label: '商务流程',
      value: '3',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:57.009Z',
    updatedAt: '2023-09-24T02:23:41.910Z',
    prjId: 95,
    stage_dicId: 40,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-09-21T16:00:00.000Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-09-19T16:00:00.000Z',
    id: 102,
    stage: {
      id: 40,
      createdAt: '2023-09-13T14:35:19.288Z',
      updatedAt: '2023-09-13T14:35:19.288Z',
      label: '客方组装',
      value: '10',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.872Z',
    updatedAt: '2023-09-24T02:24:18.644Z',
    prjId: 95,
    stage_dicId: 35,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-10-20T09:25:00.000Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-09-24T16:00:00.000Z',
    id: 97,
    stage: {
      id: 35,
      createdAt: '2023-09-13T14:35:19.031Z',
      updatedAt: '2023-09-13T14:35:19.031Z',
      label: '采购下单',
      value: '5',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.771Z',
    updatedAt: '2023-09-24T02:25:24.463Z',
    prjId: 95,
    stage_dicId: 31,
    updatedById: 1,
    status_dicId: 44,
    end: '2023-10-28T16:00:00.000Z',
    real_start: null,
    real_end: null,
    createdById: null,
    start: '2023-10-08T16:00:00.000Z',
    id: 93,
    stage: {
      id: 31,
      createdAt: '2023-09-13T14:35:18.835Z',
      updatedAt: '2023-09-13T14:35:18.835Z',
      label: '需求设计',
      value: '1',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
  {
    createdAt: '2023-09-22T05:03:56.898Z',
    updatedAt: '2023-09-24T06:35:25.343Z',
    prjId: 95,
    stage_dicId: 36,
    updatedById: null,
    status_dicId: 44,
    end: null,
    real_start: null,
    real_end: null,
    createdById: null,
    start: null,
    id: 98,
    stage: {
      id: 36,
      createdAt: '2023-09-13T14:35:19.092Z',
      updatedAt: '2023-09-13T14:35:19.092Z',
      label: '厂内组装',
      value: '6',
      color: 'processing',
      icon: null,
      remark: null,
      createdById: null,
      updatedById: null,
      dicCode: 'prj_cycle',
    },
  },
];
const InternalGanttBlockProvider = (props) => {
  const { fieldNames, timeRange, resource, rightSize, groups = groupData } = props;
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
        groups,
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
    // <BlockProvider {...props} params={params}>

    // </BlockProvider>
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
      ctx.service.data?.data,
      ctx.fieldNames,
      [],
      undefined,
      flag,
      checkPermassion,
      ctx.service.data?.data,
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
        ctx.service.data?.data,
        ctx.fieldNames,
        [],
        undefined,
        false,
        checkPermassion,
        ctx.service.data?.data,
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
