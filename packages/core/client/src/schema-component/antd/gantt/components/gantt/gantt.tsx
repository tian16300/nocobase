import { css, cx } from '@emotion/css';
import { createForm } from '@formily/core';
import { RecursionField, Schema, useFieldSchema } from '@formily/react';
import { message } from 'antd';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPIClient } from '../../../../../api-client';
import { useCurrentAppInfo } from '../../../../../appInfo';
import {
  BlockAssociationContext,
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

import 'react-reflex/styles.css';
import { CollectionProvider, useCollectionManager } from '@nocobase/client';
import { useEventListener } from 'ahooks';

const getColumnWidth = (dataSetLength: any, clientWidth: any) => {
  const columnWidth = clientWidth / dataSetLength > 35 ? Math.floor(clientWidth / dataSetLength) + 20 : 35;
  return columnWidth;
};
export const DeleteEventContext = React.createContext({
  close: () => {},
});
const GanttRecordViewer = (props) => {
  const { groupField, rowKey } = useGanttBlockContext();
  const { visible, setVisible, record = {} } = props;
  const { isGroup } = record;

  const fieldSchema = useFieldSchema();
  const close = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const eventSchema = useMemo(() => {
    let schema = null;
    const { isGroup } = record;

    if (isGroup && 'others' !== record[rowKey]?.toString()) {
      const groupType = groupField.name as string;
      schema = fieldSchema?.properties[groupType].mapProperties((temp) => {
        return temp['x-component'] == 'Gantt.Event' ? temp : false;
      })[0];
    } else if (!isGroup) {
      schema = fieldSchema?.properties['detail'];
    }
    return schema;
  }, [fieldSchema, record, groupField, rowKey]);

  const isTask = !isGroup;
  const isCollectionField = isGroup && 'others' !== record[rowKey]?.toString();
  return (
    eventSchema && (
      <DeleteEventContext.Provider value={{ close }}>
        <ActionContextProvider value={{ visible, setVisible }}>
          {isTask ? (
            <RecordProvider record={record}>
              <RecursionField schema={eventSchema as Schema} name={eventSchema.name} />
            </RecordProvider>
          ) : (
            <></>
          )}
          {isCollectionField ? (
            <CollectionProvider name={record.__collection}>
              <RecordProvider record={record}>
                <RecordProvider record={{}}>
                  <WithoutTableFieldResource.Provider value={true}>
                    <FormProvider>
                      <RecursionField onlyRenderProperties schema={eventSchema} name={eventSchema.name} />
                    </FormProvider>
                  </WithoutTableFieldResource.Provider>
                </RecordProvider>
              </RecordProvider>
            </CollectionProvider>
          ) : (
            <></>
          )}
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
    todayColor = 'rgba(252, 248, 227, 0.5)',
    viewDate,
    TooltipContent = StandardTooltipContent,
    onDoubleClick,
    onClick,
    onDelete,
    onSelect,
    // hasScroll = false,
    // useProps,
  } = props;
  // const { onExpanderClick, tasks, expandAndCollapseAll } = useProps();
  const {
    fieldNames = {},
    onExpanderClick,
    onResize,
    tasks,
    expandAndCollapseAll,
    height,
    ganttHeight = `calc(100% - ${headerHeight}px)`,
    rightSize,
  } = useProps(props);
  const ctx = useGanttBlockContext();
  const appInfo = useCurrentAppInfo();
  const { t } = useTranslation();
  const locale = appInfo.data?.lang;
  const tableCtx = useTableBlockContext();
  const { rowKey = 'id' } = ctx;
  const { resource, service } = useBlockRequestContext();
  const fieldSchema = useFieldSchema();
  const viewMode = fieldNames.range || 'day';
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
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(undefined);
  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
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
  const { expandFlag } = tableCtx;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const ganttFullHeight = barTasks.length * rowHeight;
  const tbodyRef = useRef<HTMLDivElement>();

  useEffect(() => {
    expandAndCollapseAll?.(!expandFlag);
  }, [expandFlag, expandAndCollapseAll]);
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
    onExpanderClick,
    ctx,
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
  }, [failedTask, barTasks, rowKey]);

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

  useEffect(() => {
    const tbody = tableWrapperRef?.current?.querySelector('.ant-table-body');
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
      // if(tbody){
      //   (tbody as any).style = `min-height:${ganttHeight}px;max-height:${ganttHeight}px;`;
      // }
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    //设置table的 滚动
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      const scrollTop = event.currentTarget.scrollTop;
      setScrollY(scrollTop);
      setIgnoreScrollEvent(true);
      const isTablebody = event.currentTarget.classList.contains('.ant-table-body');
      if (!isTablebody) {
        setTBodyScrollY(scrollTop);
      }
    } else {
      setIgnoreScrollEvent(false);
    }
  };
  const setTBodyScrollY = (scrollTop: number) => {
    const tbody = tbodyRef.current || tableWrapperRef?.current?.querySelector('.ant-table-body');
    tbody.scrollTop = scrollTop;
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  useEffect(() => {
    tbodyRef.current = tableWrapperRef?.current?.querySelector('.ant-table-body');
    return () => {
      tbodyRef.current = null;
    };
  }, [tableWrapperRef, tbodyRef]);
  /**
   * table 滚动控制右侧
   */
  useEventListener('scroll', handleScrollY, {
    target: tableWrapperRef?.current?.querySelector('.ant-table-body'),
    passive: false,
  });

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
  }, [wrapperRef, tbodyRef, scrollY, scrollX, ganttHeight, svgWidth, rtl, ganttFullHeight]);

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
    setSelectedRowKeys(keys);
  };
  const handleProgressChange = async (task: Task) => {
    await resource.update({
      filterByTk: task.id,
      values: {
        [fieldNames.progress]: task.progress / 100,
      },
    });
    message.success(t('Saved successfully'));
    await service?.refresh();
  };
  const handleTaskChange = async (task: Task) => {
    await resource.update({
      filterByTk: task.id,
      values: {
        [fieldNames.start]: task.start,
        [fieldNames.end]: task.end,
      },
    });
    message.success(t('Saved successfully'));
    await service?.refresh();
  };
  const handleBarClick = (data, _ctx?) => {
    // const { type = 'task', isGroup, groupType } = data;
    const flattenTree = (treeData) => {
      return treeData.reduce((acc, node) => {
        if (node.children) {
          return acc.concat([node, ...flattenTree(node.children)]);
        } else {
          return acc.concat(node);
        }
      }, []);
    };
    const context = _ctx || ctx;
    const flattenedData = flattenTree(context.preProcessData(context.service?.data?.data, context));
    const recordData = flattenedData?.find((item) => item.rowKey === data.rowKey);
    if (!recordData) {
      return;
    }
    // setIsGroup(isGroup?true:false);
    // setRecordType(isGroup?groupType:'detail');
    setRecord(recordData);
    setVisible(true);
  };

  useEffect(() => {
    /* table ctx expandClick */
    tableCtx.field.onExpandClick = handleTableExpanderClick;
    tableCtx.field.onRowSelect = handleRowSelect;
    tableCtx.field.onRecordClick = handleBarClick;
  }, [tableCtx?.field, handleTableExpanderClick, handleRowSelect, handleBarClick]);
  const handerResize = ({ domElement, component }) => {
    // console.log();
    const hasScrollX =
      tableWrapperRef.current.querySelector('.ant-table-body')?.scrollWidth -
      document.querySelector('.ant-table-body')?.clientWidth;
    const header = tableWrapperRef.current.querySelector('.ant-table-thead')?.clientHeight;
    const scrollBar = hasScrollX > 0 ? 10 : 0;
    onResize.call(this, `calc(100% - ${header}px - ${scrollBar}px)`, hasScrollX, domElement, component);
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
  const hasAction = Object.keys(fieldSchema?.properties?.toolBar?.properties || {}).length > 0 || designable;
  return wrapSSR(
    <div
      className={cx(
        componentCls,
        hashId,
        css`
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
        `,
      )}
    >
      <GanttRecordViewer visible={visible} setVisible={setVisible} record={record} />
      <RecursionField name={'anctionBar'} schema={fieldSchema.properties.toolBar} />
      <div className="gantt-view-container">
        <ReflexContainer orientation="vertical">
          <ReflexElement className="left-pane">
            <div className="wrapper" ref={tableWrapperRef} tabIndex={0} onKeyDown={handleKeyDown}>
              <RecursionField name={'table'} schema={fieldSchema.properties.table} />
            </div>
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement className="right-pane" resizeWidth flex={rightSize} onStopResize={handerResize}>
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
