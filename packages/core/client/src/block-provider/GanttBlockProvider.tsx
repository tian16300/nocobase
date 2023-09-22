import { useField } from '@formily/react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useACLRoleContext } from '../acl/ACLProvider';
import { useCollection } from '../collection-manager/hooks';
import { BlockProvider, useBlockRequestContext } from './BlockProvider';
import { TableBlockProvider } from './TableBlockProvider';
import { useAssociationNames, useProps } from '..';
import { getValuesByPath } from '@nocobase/utils/client';

export const GanttBlockContext = createContext<any>({});

const formatData = (
  data = [],
  fieldNames,
  tasks: any[] = [],
  projectId: any = undefined,
  hideChildren = false,
  checkPermassion?: (any) => boolean,
) => {
  data.forEach((item: any) => {
    const disable = checkPermassion(item);
    const percent = item[fieldNames.progress] * 100;
    if (item.children && item.children.length) {
      const start = getValuesByPath(item, fieldNames.start);
      const end = getValuesByPath(item, fieldNames.end);
      tasks.push({
        start: new Date(start ?? undefined),
        end: new Date(end ?? undefined),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: 'project',
        progress: percent > 100 ? 100 : percent || 0,
        hideChildren: hideChildren,
        project: projectId,
        color: item.color,
        isDisabled: disable,
      });
      formatData(item.children, fieldNames, tasks, item.id + '', hideChildren, checkPermassion);
    } else {
      const start = getValuesByPath(item, fieldNames.start);
      const end = getValuesByPath(item, fieldNames.end);
      tasks.push({
        start: start ? new Date(start) : undefined,
        end: new Date(end || start),
        name: getValuesByPath(item, fieldNames.title) || '',
        id: item.id + '',
        type: fieldNames.end ? 'task' : 'milestone',
        progress: percent > 100 ? 100 : percent || 0,
        project: projectId,
        color: item.color,
        isDisabled: disable,
      });
    }
  });
  return tasks;
};
const InternalGanttBlockProvider = (props) => {
  const { fieldNames, timeRange, resource, leftSize } = props;
  const field = useField();
  const { service } = useBlockRequestContext();
  // if (service.loading) {
  //   return <Spin />;
  // }
  return (
    <GanttBlockContext.Provider
      value={{
        field,
        service,
        resource,
        fieldNames,
        timeRange,
        leftSize,
      }}
    >
      {props.children}
    </GanttBlockContext.Provider>
  );
};

export const GanttBlockProvider = (props) => {
  const { appends } =  useAssociationNames();
  const params = {
    filter: props.params.filter,
    tree: true,
    paginate: false,
    sort: props.fieldNames.start,
    appends: Array.from(new Set([...(props.params.appends||[]), ...appends])),
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
  const [leftSize, setLeftSize] = useState<any>(ctx.leftSize);
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
    const data = formatData(ctx.service.data?.data, ctx.fieldNames, [], undefined, flag, checkPermassion);
    setTasks(data);
    ctx.field.data = data;
  };
  const onResize = (size, hasScroll, dom, comp) => {
    setGanttHeight(size);
    setHasScroll(hasScroll);
    setLeftSize(comp.props.flex);
  };
  useEffect(() => {
    setLeftSize(ctx.leftSize);
  }, [ctx.leftSize]);
  useEffect(() => {
    if (!ctx?.service?.loading) {
      const data = formatData(ctx.service.data?.data, ctx.fieldNames, [], undefined, false, checkPermassion);
      setTasks(data);
      ctx.field.data = data;
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
    leftSize,
  };
};
