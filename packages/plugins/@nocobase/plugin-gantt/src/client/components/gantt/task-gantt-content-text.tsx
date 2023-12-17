import React, { useEffect, useState } from 'react';
import { EventOption } from '../../types/public-types';
import { BarTask } from '../../types/bar-task';
import { Arrow } from '../other/arrow';
import { handleTaskBySVGMouseEvent } from '../../helpers/bar-helper';
import { isKeyboardEvent } from '../../helpers/other-helper';
import { TaskItem } from '../task-item/task-item';
import { BarMoveAction, GanttContentMoveAction, GanttEvent } from '../../types/gantt-task-actions';
import { TaskItemText } from '../task-item/task-item-text';

let lastAction = null;
let lastStart = null;
export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
  rowKey: string;
} & EventOption;

export const TaskGanttContentText: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  columnWidth,
  timeStep,
  taskHeight,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  rowKey,
}) => {
  
  const [xStep, setXStep] = useState(0);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1]?.getTime() -
      dates[0]?.getTime() -
      dates[1]?.getTimezoneOffset() * 60 * 1000 +
      dates[0]?.getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  return (
    <g className="content">
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map((task) => {
          return (
            <TaskItemText
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              key={task[rowKey]?.toString()}
              rtl={rtl}
            />
          );
        })}
      </g>
    </g>
  );
};
