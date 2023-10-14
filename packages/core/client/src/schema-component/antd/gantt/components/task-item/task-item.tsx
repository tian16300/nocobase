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

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  rowKey?: string;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
    taskBar = {},
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);
  const isProjectBar = task.typeInternal === 'project';
  const isShowText = !task.isHiddenTitle;
  // const hasMultBar = task.items.length > 1;
  // const taskHeight = hasMultBar? _taskHeight*0.6: _taskHeight;
  // task.height = taskHeight;
  // task.y =  task.y + _taskHeight*0.2
  useEffect(() => {
    // const Items = ()=>{
    //   return ({task?.items?.map((task)=>{
    //     return

    //   })})
    // }
    let Comp = Bar;

    switch (task.typeInternal) {
      case 'milestone':
        Comp = Milestone;
        break;
      case 'project':
        Comp = Project;
        // setTaskItem(
        //   <>
        //     <Project {...props}></Project>
        //     {/* <Bar {...props} task={{...task,type:'task',typeInternal:'task'}}  /> */}

        //     {/* <Bar {...props} task={task.taskBar} /> */}
        //   </>,
        // );
        break;
      case 'smalltask':
        Comp = BarSmall;
        // setTaskItem(<BarSmall {...props} />);
        break;
      default:
        // setTaskItem(
        //   <>
        //     {task.items?.map((item) => {

        //       return <Bar {...props} {...item} />;
        //     })}
        //   </>,
        // );
        break;
    }
    setTaskItem(
      <>
        {/* {task.items?.map((item) => {  
          if(hasMultBar){
            item.height = task.height; 
            // item.y = item.y + taskHeight*0.2;
          }
          return <Comp {...props} {...item}  />;
        })} */}
        <Comp {...props} />;
      </>,
    );

    // switch (task.typeInternal) {
    //   case 'milestone':
    //     setTaskItem(<Milestone {...props} />);
    //     break;
    //   case 'project':
    //     setTaskItem(
    //       <>
    //         <Project {...props}></Project>
    //         {/* <Bar {...props} task={{...task,type:'task',typeInternal:'task'}}  /> */}

    //         {/* <Bar {...props} task={task.taskBar} /> */}
    //       </>,
    //     );
    //     break;
    //   case 'smalltask':
    //     setTaskItem(<BarSmall {...props} />);
    //     break;
    //   default:
    //     setTaskItem(
    //       <>
    //         {task.items?.map((item) => {

    //           return <Bar {...props} {...item} />;
    //         })}
    //       </>,
    //     );
    //     break;
    // }
  }, [task, isSelected]);

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
    // if(hasMultBar && textRef.current){
    //   return (task.y - textRef.current.getBBox().height + 6);
    // }
    return false ? task.y - 8 : isTextInside ? task.y + taskHeight * 0.5 : task.y + taskHeight * 0.65;
  };
  return wrapSSR(
    <g
      className={cx(componentCls, hashId)}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'Delete': {
            if (isDelete) onEventStart('delete', task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={(e) => {
        onEventStart('mouseenter', task, e);
      }}
      onMouseLeave={(e) => {
        onEventStart('mouseleave', task, e);
      }}
      onDoubleClick={(e) => {
        onEventStart('dblclick', task, e);
      }}
      onClick={(e) => {
        onEventStart('click', task, e);
      }}
      onFocus={() => {
        onEventStart('select', task);
      }}
    >
      {taskItem}
      {/* <text
        x={isProjectBar ? task.x1 : getX()}
        y={isProjectBar ? task.y - 8 : isTextInside ? task.y + taskHeight * 0.5 : task.y + taskHeight * 0.65}
        className={isProjectBar ? cx('projectLabel') : isTextInside ? cx('barLabel') : cx('barLabelOutside')}
        ref={textRef}
      >
        {isProjectBar && getYmd(task.start) && getYmd(task.end)
          ? `${task.name}:  ${getYmd(task.start)} ~ ${getYmd(task.end)}`
          : task.name}
      </text> */}
      {isShowText && (
        <text
          x={getX()}
          y={getY()}
          className={isTextInside ? cx(isProjectBar ? 'projectLabel' : 'barLabel') : cx('barLabelOutside')}
          ref={textRef}
        >
          {/* {isProjectBar && getYmd(task.start) && getYmd(task.end)
          ? `${task.name}:  ${getYmd(task.start)} ~ ${getYmd(task.end)}`
          : task.name} */}
          {task.name}
        </text>
      )}
    </g>,
  );
};
