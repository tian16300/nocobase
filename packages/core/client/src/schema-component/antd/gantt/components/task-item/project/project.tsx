import { cx } from '@emotion/css';
import React from 'react';
import { TaskItemProps } from '../task-item';
import { projectBackground, projectWrapper } from './style';

export const Project: React.FC<TaskItemProps> = ({ task, isSelected, rowKey = 'id' }) => {
  const barColor = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  const processColor = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
  const projectWith = task.x2 - task.x1;
  return (
    <>
      <defs>
        <pattern
          id={"prj-"+task[rowKey]?.toString()}
          width="4"
          height="4"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            style={{
              stroke: task.color || barColor,
              strokeWidth: 1,
              strokeOpacity:1
            }}
          />
        </pattern>
      </defs>

      <g tabIndex={0} className={cx(projectWrapper)}>
        <rect
          // fill={task.color || barColor}
          fill={`url(#${'prj-'+task[rowKey]?.toString()})`}
          x={task.x1}
          width={projectWith}
          y={task.y}
          height={task.height}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          className={cx(projectBackground)}
          stroke={task.color || barColor}
          strokeWidth={0.4}
        />
        <rect
          x={task.progressX}
          width={task.progressWidth}
          y={task.y}
          height={task.height}
          ry={task.barCornerRadius}
          rx={task.barCornerRadius}
          fill={task.color || processColor}
          // fill={`url(#${'prj-'+task[rowKey]?.toString()})`}
        />
      </g>
    </>
  );
};
