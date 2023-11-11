import { css, cx } from '@emotion/css';
import { ISchema, RecursionField, Schema, connect, mapProps, useFieldSchema } from '@formily/react';
import { Button, Col, Row, Select, Space, message } from 'antd';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPIClient } from '../../../../../api-client';
import { useCurrentAppInfo } from '../../../../../appInfo';
import {
  WithoutTableFieldResource,
  useBlockRequestContext,
  useGanttBlockContext,
  useTableBlockContext,
} from '../../../../../block-provider';
import { RecordProvider } from '../../../../../record-provider';
import { FormProvider, useDesignable } from '../../../../../schema-component';
import { useToken } from '../../../__builtins__';
import { ActionContextProvider } from '../../../action';
import { convertToBarTasks } from '../../helpers/bar-helper';
import { ganttDateRange, seedDates } from '../../helpers/date-helper';
import { removeHiddenTasks, sortTasks } from '../../helpers/other-helper';
import { BarTask } from '../../types/bar-task';
import { DateSetup } from '../../types/date-setup';
import { GanttEvent } from '../../types/gantt-task-actions';
import { Task } from '../../types/public-types';
import { CalendarProps } from '../calendar/calendar';
import { GridProps } from '../grid/grid';
import { HorizontalScroll } from '../other/horizontal-scroll';
import { StandardTooltipContent, Tooltip } from '../other/tooltip';
import { VerticalScroll } from '../other/vertical-scroll';
import useStyles from './style';
import { TaskGantt } from './task-gantt';
import { TaskGanttContentProps } from './task-gantt-content';
import { useProps } from '../../../../hooks';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { CollectionProvider, useCollection, useCollectionManager } from '@nocobase/client';
import { useEventListener, useScroll, useSize } from 'ahooks';
import { createForm, onFieldValueChange } from '@formily/core';
import { dayjs, uid } from '@nocobase/utils';
import { FullscreenAction } from './FullScreenAction';

const getColumnWidth = (dataSetLength: any, clientWidth: any) => {
  const columnWidth = clientWidth / dataSetLength > 35 ? Math.floor(clientWidth / dataSetLength) + 20 : 35;
  return columnWidth;
};
export const DeleteEventContext = React.createContext({
  close: () => {},
});

interface GanttFormCompProps {
  value: { group: 'string'; sort: 'string'; timeRange: 'string' };
  setValue: { [key: string]: (value: string) => {} };
  getPopupContainer: () => any;
}
export const GanttFormComp: React.FC<GanttFormCompProps> = (props: GanttFormCompProps) => {
  const { value, setValue, getPopupContainer } = props;
  const fieldSchema = useFieldSchema();
  const form = createForm({});
  fieldSchema.properties.form.reduceProperties((pre, schema) => {
    schema.reduceProperties((pre, s) => {
      if (s.name == 'range') {
        s.default = value?.timeRange || s.default;
      }
      if (s.name == 'sort') {
        s.default = value?.sort || s.default;
      }
      if (s.name == 'group') {
        s.default = value?.group || s.default;
      }
      if (['Select', 'RemoteSelect'].includes(s['x-component'])) {
        s['x-component-props'] = s['x-component-props'] || {};
        s['x-component-props'].getPopupContainer = getPopupContainer;
      }
    });
  });
  useEffect(() => {
    const id = uid();
    form.addEffects(id, (form) => {
      onFieldValueChange('group', (field) => {
        const value = field.value;
        if (value) {
          setValue['group'](value);
        }
      });
      onFieldValueChange('sort', (field) => {
        const value = field.value;
        if (value) {
          setValue['sort'](value);
        }
      });
      onFieldValueChange('range', (field) => {
        const value = field.value;
        if (value && value !== value.timeRange) {
          setValue['timeRange'](value);
        }
      });
    });

    return () => {
      form.removeEffects(id);
    };
  }, [form, fieldSchema, value, setValue]);
  return (
    <FormProvider form={form}>
      <RecursionField schema={fieldSchema.properties.form} onlyRenderProperties />
    </FormProvider>
  );
};
export const GanttForm = connect(
  GanttFormComp,
  mapProps(
    {
      value: 'value',
      setValue: 'setValue',
    },
    (props: any, field: any) => {
      return {
        ...props,
        help: field.selfErrors?.length ? field.selfErrors : undefined,
      };
    },
  ),
);

const GanttRecordViewer = (props) => {
  const { visible, setVisible, record = {}, isCreate = false, getContainer, isFullScreen } = props;
  const { isGroup, schemaName = 'detail' } = record;
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const close = useCallback(() => {
    setVisible(false);
  }, []);
  const eventSchema = {
    ...fieldSchema?.properties[schemaName],
  };
  // if (!isGroup && isCreate) {
  //   eventSchema['x-component-props'] = {
  //     inheritsKeys: Object.keys(record).filter((key) => {
  //       return !/^__+/.test(key);
  //     }),
  //   };
  // }
  const drawerProps = {
    getContainer: isFullScreen ? getContainer : null,
  };
  const isCollectionField = record.__collection;
  const collectionName = record.__collection || name;
  return (
    eventSchema && (
      <DeleteEventContext.Provider value={{ close }}>
        <ActionContextProvider value={{ visible, setVisible, drawerProps }} fieldSchema={eventSchema as Schema}>
          <CollectionProvider name={collectionName}>
            <RecordProvider record={record}>
              {isCollectionField ? (
                <WithoutTableFieldResource.Provider value={true}>
                  <RecursionField onlyRenderProperties schema={eventSchema} name={eventSchema.name} />
                </WithoutTableFieldResource.Provider>
              ) : (
                <RecursionField onlyRenderProperties schema={eventSchema as Schema} name={eventSchema.name} />
              )}
            </RecordProvider>
          </CollectionProvider>
        </ActionContextProvider>
      </DeleteEventContext.Provider>
    )
  );
};
export const Gantt: any = (props: any) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const { token } = useToken();
  const { designable } = useDesignable();
  const api = useAPIClient();
  const currentTheme = api.auth.getOption('theme');
  const tableRowHeight = currentTheme === 'compact' ? 45 : 55;
  const {
    headerHeight = document.querySelector('.ant-table-thead')?.clientHeight || 0, // 与 antd 表格头部高度一致
    // tableScrollBarXHeight = (document.querySelector('.ant-table-body')?.scrollWidth || 0 - document.querySelector('.ant-table-body')?.clientWidth || 0)?10:0,
    listCellWidth = '155px',
    rowHeight = tableRowHeight,
    // ganttHeight = `calc(100% - ${headerHeight}px)`,
    preStepsCount = 1,
    barFill = 45,
    barCornerRadius = token.borderRadiusXS,
    barProgressColor = token.colorPrimary,
    barProgressSelectedColor = token.colorPrimary,
    barBackgroundColor = token.colorPrimary,
    barBackgroundSelectedColor = token.colorPrimary,
    projectProgressColor = token.colorPrimary,
    projectProgressSelectedColor = token.colorPrimary,
    projectBackgroundColor = token.colorInfo,
    projectBackgroundSelectedColor = token.colorInfoActive,
    milestoneBackgroundColor = '#f1c453',
    milestoneBackgroundSelectedColor = '#f29e4c',
    rtl = false,
    handleWidth = 8,
    timeStep = 300000,
    arrowColor = 'grey',
    fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    fontSize = token.fontSize,
    arrowIndent = 20,
    todayColor = token.colorWarning,
    viewDate,
    setViewDate,
    TooltipContent = StandardTooltipContent,
    onDoubleClick,
    onClick,
    onDelete,
    onSelect,
    fieldNames = {},
    onExpanderClick,
    onResize,
    tasks,
    expandAndCollapseAll,
    height,
    ganttHeight: _ganttHeight = `calc(100% - ${headerHeight}px)`,
    rightSize,
    setRightSize,
    timeRange,
    hasMultiBar = false,
    updateLocalTask,
  } = {
    ...props,
    ...useProps(props),
  } as any;

  const ctx = useGanttBlockContext();
  const appInfo = useCurrentAppInfo();
  const { t } = useTranslation();
  const locale = appInfo.data?.lang;
  const tableCtx = useTableBlockContext();
  const { resource, service } = useBlockRequestContext();
  const fieldSchema = useFieldSchema();
  // const [viewMode, setViewMode] = useState(fieldNames.range || 'day');
  const viewMode = timeRange;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [isCreate, setIsCreate] = useState<any>(false);
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(undefined);
  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [ganttHeight, setGanttHeight] = useState(_ganttHeight);
  const [svgContainerHeight, setSvgContainerHeight] = useState(_ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: '',
  });
  const taskHeight = useMemo(() => (rowHeight * barFill) / 100, [rowHeight, barFill]);
  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const columnWidth: number = getColumnWidth(dateSetup.dates.length, verticalGanttContainerRef.current?.clientWidth);
  const svgWidth = dateSetup.dates.length * columnWidth;
  const { expandFlag, rowKey = 'id' } = tableCtx;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const ganttFullHeight = barTasks.length * rowHeight;
  const tbodyRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();

  const formValue = {
    group: ctx.group,
    sort: ctx.sort,
    timeRange: ctx.timeRange,
  };
  const setFormValue = {
    group: ctx.setGroup,
    sort: ctx.setSort,
    timeRange: ctx.setTimeRange,
  };

  useEffect(() => {
    /* table ctx expandClick */
    tableCtx.field.onExpandClick = handleTableExpanderClick;
    tableCtx.field.onRowSelect = handleRowSelect;
    tableCtx.field.onRecordClick = handleBarClick;
    tableCtx.field.getPopupContainer = getPopupContainer;
  }, []);
  useEffect(() => {
    /* table ctx expandClick */
    tableCtx.field.updateLocalTask = updateLocalTask;
  }, [updateLocalTask]);
  useEffect(() => {
    expandAndCollapseAll?.(!expandFlag);
  }, [expandFlag]);
  useEffect(() => {
    tbodyRef.current = tableWrapperRef?.current?.querySelector('.ant-table-body');
    return () => {
      tbodyRef.current = null;
    };
  }, [tableWrapperRef, tbodyRef]);

  const getPopupContainer = useMemo(() => {
    return () => {
      return containerRef.current;
    };
  }, [containerRef]);

  // task change events
  useEffect(() => {
    let filteredTasks: Task[];
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks, ctx);
    } else {
      filteredTasks = tasks;
    }
    filteredTasks = filteredTasks.sort(sortTasks);
    const [startDate, endDate] = ganttDateRange(filteredTasks, viewMode, preStepsCount);
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        ctx,
      ),
    );
  }, [
    tasks,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) || (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() && i + 1 !== dates.length && viewDate.valueOf() < dates[i + 1].valueOf(),
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [viewDate, columnWidth, dateSetup.dates, dateSetup.viewMode, viewMode, currentViewDate, setCurrentViewDate]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' });
        setBarTasks(barTasks.filter((t) => t[rowKey]?.toString() !== changedTask[rowKey]?.toString()));
      } else if (action === 'move' || action === 'end' || action === 'start' || action === 'progress') {
        const prevStateTask = barTasks.find((t) => t[rowKey]?.toString() === changedTask[rowKey]?.toString());
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map((t) =>
            t[rowKey]?.toString() === changedTask[rowKey]?.toString() ? changedTask : t,
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map((t) => (t[rowKey]?.toString() !== failedTask[rowKey]?.toString() ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!listCellWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.offsetWidth - taskListWidth;
      setSvgContainerWidth(width);
    } else {
      const container = document.querySelector('.gantt-view-container') as HTMLDivElement;
      if (container) {
        const width = (container.offsetWidth - 2 - 2) * rightSize - taskListWidth;
        setSvgContainerWidth(width);
      }
    }
  }, [wrapperRef, rightSize, taskListWidth]);

  // const { height: containerHeight } = useSize(wrapperRef);

  const tBodySize = useSize(() => {
    return tableWrapperRef?.current?.querySelector('.ant-table-body');
  });
  /* 表格使用 ahooks table */
  useScroll(() => {
    return tableWrapperRef?.current?.querySelector('.ant-table-body');
  });
  useScroll(verticalGanttContainerRef?.current);

  useEffect(() => {
    const height = tBodySize?.height;
    if (height) {
      const hasScrollX =
        tableWrapperRef?.current?.querySelector('.ant-table-body')?.scrollWidth -
          tableWrapperRef?.current?.querySelector('.ant-table-body')?.clientWidth >
        0;
      setGanttHeight(height);
      setSvgContainerHeight(height + headerHeight + (hasScrollX ? 11 : 0));
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [tBodySize?.height, headerHeight, tasks, rowHeight]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          setTBodyScrollY(newScrollY);
          event.preventDefault();
        }
      }
      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    wrapperRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    return () => {
      wrapperRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [wrapperRef, scrollY, scrollX, ganttHeight, svgWidth, rtl, ganttFullHeight]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    //设置table的 滚动
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      const scrollTop = event.currentTarget.scrollTop;
      setScrollY(scrollTop);
      const isTablebody = event.currentTarget.classList.contains('.ant-table-body');
      if (!isTablebody) {
        setTBodyScrollY(scrollTop);
      }
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  const setTBodyScrollY = (scrollTop: number) => {
    const tbody = tableWrapperRef?.current?.querySelector('.ant-table-body');
    if (tbody) tbody.scrollTop = scrollTop;
  };

  useEventListener('scroll', handleScrollY, {
    target: tableWrapperRef?.current?.querySelector('.ant-table-body'),
    passive: false,
  });
  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        newScrollY += rowHeight;
        isX = false;
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        newScrollY -= rowHeight;
        isX = false;
        break;
      case 'Left':
      case 'ArrowLeft':
        newScrollX -= columnWidth;
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
      setTBodyScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find((t) => t[rowKey]?.toString() === taskId);
    const oldSelectedTask = barTasks.find(
      (t) => !!selectedTask && t[rowKey]?.toString() === selectedTask[rowKey]?.toString(),
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);
  };
  const handleTableExpanderClick = (expanded: boolean, record: any) => {
    const task = ctx?.field?.data.find((v: any) => v[rowKey]?.toString() === record[rowKey]?.toString());
    if (onExpanderClick && record.children.length) {
      onExpanderClick({ ...task, hideChildren: !expanded });
    }
  };

  const handleRowSelect = (keys) => {
    setSelectedRowKeys(
      keys.map((key) => {
        return key + '';
      }),
    );
  };
  const saveTaskResource = async (task, params) => {
    if (!task.isGroup) {
      await resource.update(params);
      message.success(t('Saved successfully'));
      await service?.refresh();
    } else if (task.id && task.fieldCtx && task.fieldCtx.blockCtx) {
      const blockCtx = task.fieldCtx.blockCtx;
      const _resource = blockCtx.resource;
      const _service = blockCtx.service;
      await _resource.update(params);
      message.success(t('Saved successfully'));
      await _service?.refresh();
    }
  };
  const handleProgressChange = async (task: Task) => {
    const param = {
      filterByTk: task.id,
      values: {
        [fieldNames.progress]: task.progress / 100,
      },
    };
    await saveTaskResource(task, param);
  };
  const flattenTree = (treeData) => {
    return treeData.reduce((acc, node) => {
      if (node.children) {
        return acc.concat([node, ...flattenTree(node.children)]);
      } else {
        return acc.concat(node);
      }
    }, []);
  };

  const handleTaskChange = async (task: Task) => {
    const param = {
      filterByTk: task.id,
      values: {
        [fieldNames.start]: task.start,
        [fieldNames.end]: task.end,
      },
    };
    await saveTaskResource(task, param);
  };
  const handleBarClick = (data, _ctx?, isCreate?) => {
    const _isCreate = isCreate;
    setIsCreate(_isCreate);
    if (!_isCreate) {
      const ctxProps = _ctx || ctx;
      const rowKey = ctxProps.rowKey || 'id';
      const flattenedData = flattenTree(ctxProps.preProcessData(ctxProps?.service?.data?.data, ctxProps));
      let recordData = null;
      if (hasMultiBar) {
        let allRecords = [];
        flattenedData.forEach((item) => {
          allRecords = allRecords.concat(item.data);
        });
        recordData = allRecords?.find((item) => item[rowKey] + '' === data[rowKey] + '');
      } else {
        recordData = flattenedData?.find((item) => item[rowKey] + '' === data[rowKey] + '');
      }
      if (!recordData) {
        return;
      }
      setRecord(recordData);
      setVisible(true);
    } else {
      setRecord(data);
      setVisible(true);
    }
  };
  const rightPaneRef = useRef<ReflexElement>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { getCollectionField } = useCollectionManager();
  const flatTreeSchema = (schema, isFullScreen) => {
    schema.reduceProperties((b, s) => {
      const comp = s['x-component'];
      if (['DatePicker', 'Select', 'RemoteSelect'].includes(comp)) {
        s['x-component-props'] = s['x-component-props'];
        s['x-component-props'].getPopupContainer = isFullScreen ? getPopupContainer : null;
      }
      if (['CollectionField'].includes(comp)) {
        const cFieldName = s['x-collection-field'];
        const cField = getCollectionField(cFieldName);
        const isSelect = cField?.uiSchema?.['x-component'] == 'AssociationField';
        const isDate = cField?.type == 'date';
        if (isSelect || isDate) {
          s['x-component-props'] = s['x-component-props'];
          s['x-component-props'].getPopupContainer = isFullScreen ? getPopupContainer : null;
        }
      }
      if (['Action.Drawer', 'Action.Modal', 'Action.Container', 'Action.Link'].includes(comp)) {
        s['x-component-props'] = s['x-component-props'];
        s['x-component-props'].getContainer = isFullScreen ? getPopupContainer : null;
      }
      flatTreeSchema(s, isFullScreen);
    });
  };
  useEffect(() => {
    flatTreeSchema(fieldSchema, isFullScreen);
  }, [isFullScreen]);
  flatTreeSchema(fieldSchema, isFullScreen);
  const size = useSize(wrapperRef);
  // useEffect(() => {
  //   if (rightPaneRef.current) {
  //     handerResize({});
  //   }
  // }, [size?.width, size?.height]);

  // const handerResize = ({ domElement, component }: { domElement?; component? }) => {
  //   component = component || rightPaneRef.current;
  //   domElement = domElement || (component as any)?.ref?.current;
  //   if (!domElement) return;
  //   const hasScrollX =
  //     tableWrapperRef.current.querySelector('.ant-table-body')?.scrollWidth -
  //     tableWrapperRef.current.querySelector('.ant-table-body')?.clientWidth;
  //   const header = tableWrapperRef.current.querySelector('.ant-table-thead')?.clientHeight;
  //   const scrollBar = hasScrollX > 0 ? 10 : 0;
  //   onResize.call(this, `calc(100% - ${header}px - ${scrollBar}px)`, hasScrollX, domElement, component);
  // };
  /**
   * 跳转到今天
   */
  const goToToday = () => {
    setViewDate(dayjs().subtract(1, 'week').startOf('week'));
  };

  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
    selectedRowKeys,
    rowKey,
    viewMode,
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
  };
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange: handleTaskChange,
    onProgressChange: fieldNames.progress && handleProgressChange,
    onDoubleClick,
    onClick: handleBarClick,
    onDelete,
    rowKey,
  };

  const fixedBlock = fieldSchema?.parent['x-decorator-props']?.fixedBlock;
  const hasAction =
    Object.keys(fieldSchema?.properties?.form?.properties?.layout?.properties || {}).length > 0 ||
    Object.keys(fieldSchema?.properties?.toolBar?.properties || {}).length > 0 ||
    designable;
  // const containerId = 'gantt_'+uid();
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return wrapSSR(
    <div
      ref={containerRef}
      className={cx(
        componentCls,
        hashId,
        css`
          background: ${token.colorBgContainer};
          &:fullscreen {
            padding: 16px;
          }
          height: ${height ? height : fixedBlock ? '100%' : '800px'};
          .ant-table-container::after {
            box-shadow: none !important;
          }
          .ant-table-row {
            height: ${tableRowHeight}px;
          }
          .left-pane {
            overflow: hidden;
          }
          .wrapper,
          .ganttVerticalContainer {
            height: 100%;
            border-left-width: 1px;
            border-left-color: ${token.colorBorder};
          }
          .scrollWrapper {
            bottom: 0;
          }
          .gantt-view-container {
            height: ${hasAction ? 'calc(100% - 32px - 24px)' : '100%'};
            border: 1px solid ${token.colorBorder};
          }
          .reflex-container.vertical > .reflex-splitter {
            border: 0px none;
            background-color: transparent;
            // width: 1px;
          }
          .wrapper div[block] {
            height: 100%;
          }
          .ant-table-wrapper {
            height: 100%;
            .ant-table,
            .ant-table-container {
              height: 100%;
            }
          }
          .ant-table-body {
            // overflow-y: hidden !important;
            min-height: calc(100% - ${headerHeight}px);
          }
          .gantt-horizontal-scoll {
            display: block !important;
          }
          .gantt-view-form {
            .ant-formily-item,
            .nb-action-bar {
              margin-bottom: 0 !important;
            }
            .ant-formily-item {
              display: flex;
              position: relative;
              font-size: 14px;
              .ant-formily-item-label {
                line-height: 32px;
                min-height: 30px;
                position: relative;
                display: flex;
                color: rgba(0, 0, 0, 0.88);
              }
             .ant-formily-item-label-content {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
             .ant-formily-item-control {
                flex: 1;
                max-width: 100%;
            }
             .ant-formily-item-control .ant-formily-item-control-content {
                display: flex;
            }
            .ant-formily-item-control .ant-formily-item-control-content .ant-formily-item-control-content-component {
              width: 100%;
              min-height: 30px;
              line-height: 30px;
              max-width:160px;
          }

            }
            .ant-formily-item {
            }
            // .ant-formily-item-label {
            //   width: 120px;
            //   display: flex;
            //   align-items: center;
            //   .ant-formily-item-label-content {
            //   }
            // }
            + .gantt-view-container {
              margin-top: 24px;
            }
            .ant-formily-item-control-content-component {
              min-width: 120px;
            }
          }
        `,
      )}
    >
      <GanttRecordViewer
        visible={visible}
        setVisible={setVisible}
        record={record}
        isCreate={isCreate}
        getContainer={getPopupContainer}
        isFullScreen={isFullScreen}
      />
      <div className="gantt-view-form">
        <Row>
          <Col flex="140px">
            <div className="ant-formily-layout ant-form-inline ant-form-default">
              <div data-testid="name-item" className="nb-sortable-designer nb-block-item nb-form-item">
                <div className=" ant-formily-item ant-formily-item-layout-horizontal ant-formily-item-feedback-layout-loose ant-formily-item-label-align-right ant-formily-item-control-align-left css-dev-only-do-not-override-iy8rx">
                  <div className="ant-formily-item-label">
                    <div className="ant-formily-item-label-content">
                      <span>
                        <label>选择</label>
                      </span>
                    </div>
                    <span className="ant-formily-item-colon">:</span>
                  </div>
                  <div className="ant-formily-item-control">
                    <div className="ant-formily-item-control-content">
                      <div className="ant-formily-item-control-content-component">
                        <Select
                          showSearch
                          filterOption={filterOption}
                          options={tasks.map(({ name }, index) => {
                            return {
                              label: name,
                              value: index,
                            };
                          })}
                          allowClear
                          onChange={(value) => {
                            // const index =
                            if (typeof value == 'number') {
                              const tHeight = wrapperRef.current.querySelector('.horizontalContainer').clientHeight;
                              const scrollHeight =
                                wrapperRef.current.querySelector('.horizontalContainer').scrollHeight;
                              const pageLen = tHeight / rowHeight;
                              const taskId = tasks[value][rowKey];
                              /**
                               * ToDo 查找
                               */

                              if (value > pageLen && scrollHeight > 0) {
                                const y = (value + 1 - 3) * ((scrollHeight - tHeight) / (tasks.length - pageLen));
                                setScrollY(y);
                                setTBodyScrollY(y);
                              } else if (scrollHeight > 0) {
                                setScrollY(0);
                                setTBodyScrollY(0);
                              }
                              tableCtx.field.data.selectedRowKeys = [
                                rowKey == 'id' ? Number(taskId).valueOf() : taskId,
                              ];
                              handleRowSelect([taskId]);
                            } else {
                              setScrollY(0);
                              setTBodyScrollY(0);
                            }
                          }}
                          className={css`
                            width: 100%;
                          `}
                          getPopupContainer={getPopupContainer}
                        ></Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col
            flex="680px"
            className={css`
              .ant-formily-layout {
                .nb-form-item {
                  display: inline-flex;
                  margin-right: 8px;
                  &:last-child {
                    margin-right: 0;
                  }
                }
                .ant-formily-item-control {
                  width: 140px;
                }
              }
            `}
          >
            <GanttForm value={formValue} setValue={setFormValue} getPopupContainer={getPopupContainer} />
          </Col>
          <Col
            flex="auto"
            className={css`
              text-align: right;
            `}
          >
            <Space>
              <FullscreenAction
                containerRef={containerRef}
                onClick={() => {
                  setIsFullScreen(!isFullScreen);
                }}
              />
              <Button onClick={goToToday}>今天</Button>

              <RecursionField name={'anctionBar'} schema={fieldSchema.properties.toolBar} />
            </Space>
          </Col>
        </Row>
      </div>
      <div className="gantt-view-container">
        <ReflexContainer orientation="vertical">
          <ReflexElement className="left-pane" resizeWidth>
            <div className="wrapper" onKeyDown={handleKeyDown} tabIndex={0} ref={tableWrapperRef}>
              <RecursionField name={'table'} schema={fieldSchema.properties.table} />
            </div>
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement
            ref={rightPaneRef}
            className="right-pane"
            resizeWidth
            flex={rightSize}
            // onStopResize={handerResize}
          >
            <div className="wrapper" onKeyDown={handleKeyDown} tabIndex={0} ref={wrapperRef}>
              <TaskGantt
                gridProps={gridProps}
                calendarProps={calendarProps}
                barProps={barProps}
                ganttHeight={ganttHeight}
                scrollY={scrollY}
                scrollX={scrollX}
                ref={verticalGanttContainerRef}
                rowKey={ctx.rowKey}
                hasMultiBar={hasMultiBar}
              />
              {ganttEvent.changedTask && (
                <Tooltip
                  arrowIndent={arrowIndent}
                  rowHeight={rowHeight}
                  svgContainerHeight={svgContainerHeight}
                  svgContainerWidth={svgContainerWidth}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  scrollX={scrollX}
                  scrollY={scrollY}
                  task={ganttEvent.changedTask}
                  headerHeight={headerHeight}
                  taskListWidth={taskListWidth}
                  TooltipContent={TooltipContent}
                  rtl={rtl}
                  svgWidth={svgWidth}
                />
              )}
              <VerticalScroll
                ganttFullHeight={ganttFullHeight}
                ganttHeight={ganttHeight}
                headerHeight={headerHeight}
                scroll={scrollY}
                onScroll={handleScrollY}
                rtl={rtl}
              />
              <HorizontalScroll
                svgWidth={svgWidth}
                taskListWidth={taskListWidth}
                scroll={scrollX}
                rtl={rtl}
                onScroll={handleScrollX}
              />
            </div>
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>,
  );
};
