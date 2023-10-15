import React, { forwardRef, useEffect, useRef } from 'react';
import { Calendar, CalendarProps } from '../calendar/calendar';
import { Grid, GridProps } from '../grid/grid';
import { TaskGanttContent, TaskGanttContentProps } from './task-gantt-content';
import { TaskGanttContentText } from './task-gantt-content-text';

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  ref: any;
  rowKey: string;
  hasMultiBar: boolean;
};
export const TaskGantt: React.FC<TaskGanttProps> = forwardRef(
  ({ gridProps, calendarProps, barProps, ganttHeight, scrollY, scrollX, rowKey, hasMultiBar }, ref: any) => {
    const ganttSVGRef = useRef<SVGSVGElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    const newBarProps = { ...barProps, svg: ganttSVGRef };
    let newBars = null;
    if (hasMultiBar) {
      const tasks = barProps.tasks;
      if (tasks && tasks.length) {
        const newTasks: any = [];
        tasks.forEach((bar) => {
          bar.items.forEach((bar, index) => {
            newTasks[index] = newTasks[index] || [];
            newTasks[index].push(bar);
          });
        });
        newBars = newTasks.map((tasks) => {
          const { tasks: _tasks, ...others } = barProps;
          return {
            ...others,
            tasks,
            svg: ganttSVGRef,
          };
        });
      }
    }

    useEffect(() => {
      if (horizontalContainerRef.current) {
        horizontalContainerRef.current.scrollTop = scrollY;
      }
    }, [scrollY]);

    useEffect(() => {
      if (ref.current) {
        ref.current.scrollLeft = scrollX;
      }
    }, [scrollX]);

    return (
      <div className="ganttVerticalContainer" ref={ref} dir="ltr">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={calendarProps.headerHeight}
          fontFamily={barProps.fontFamily}
          className="ganttHeader"
        >
          <Calendar {...calendarProps} />
        </svg>
        <div
          ref={horizontalContainerRef}
          className="horizontalContainer"
          style={ganttHeight ? { maxHeight: ganttHeight, width: gridProps.svgWidth } : { width: gridProps.svgWidth }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={gridProps.svgWidth}
            height={barProps.rowHeight * (barProps.tasks.length || 3)}
            fontFamily={barProps.fontFamily}
            ref={ganttSVGRef}
            className="ganttBody"
          >
            <Grid {...gridProps} rowKey={rowKey} viewMode={calendarProps.viewMode} />
            {hasMultiBar && newBars ? (
              <>
              {newBars.map((newBarProps, index) => {
                return <TaskGanttContent key={index} {...newBarProps} rowKey={rowKey} />;
              })}
              {/* <TaskGanttContentText key='text' {...newBarProps} rowKey={rowKey} /> */}
              </>
            ) : (
              <TaskGanttContent {...newBarProps} rowKey={rowKey} />
            )}
          </svg>
        </div>
      </div>
    );
  },
);
