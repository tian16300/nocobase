import { cx } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { getYmd } from '../../helpers/other-helper';
import { BarTask } from '../../types/bar-task';
import { GanttContentMoveAction } from '../../types/gantt-task-actions';
import { Bar } from './bar/bar';
import { BarSmall } from './bar/bar-small';
import { Milestone } from './milestone/milestone';
import { Project } from './project/project';
import useStyles from './style';

export type TaskItemTextProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  rtl: boolean;
  rowKey?: string;
};

export const TaskItemText: React.FC<TaskItemTextProps> = (props) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const {
    task,
    arrowIndent,
    taskHeight,
    rtl,
    taskBar = {},
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);
  const isProjectBar = task.typeInternal === 'project';
  const isShowText = !task.isHiddenTitle;

  useEffect(() => {
    if (textRef.current) {
      const isTextInner = textRef.current.getBBox().width < task.x2 - task.x1;
      setIsTextInside(isTextInner);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    /* 中间 */
    if (isTextInside) {
      return task.x1 + width * 0.5;
      // return task.x1 - textRef.current.getBBox().width - 6;
    }
    if (rtl && textRef.current) {
      return task.x1 - textRef.current.getBBox().width - arrowIndent * +hasChild - arrowIndent * 0.2;
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };
  const getY = () => {
    return false ? task.y - 8 : isTextInside ? task.y + taskHeight * 0.5 : task.y + taskHeight * 0.65;
  };
  return wrapSSR(
    <g
      className={cx(componentCls, hashId)}>
      {isShowText && (
        <text
          x={getX()}
          y={getY()}
          className={isTextInside ? cx(isProjectBar ? 'projectLabel' : 'barLabel') : cx('barLabelOutside')}
          ref={textRef}
        >
          {task.name}
        </text>
      )}
    </g>,
  );
};
