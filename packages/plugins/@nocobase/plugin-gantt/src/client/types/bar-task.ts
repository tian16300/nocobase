import { Task, TaskType } from './public-types';

export interface BarTask extends Task {
  index: number | number[];
  typeInternal: TaskTypeInternal;
  x1: number;
  x2: number;
  y: number;
  height: number;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarTask[];
  color?: string;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  projectBar?:any;
  isHiddenTitle?: boolean;

}

export type TaskTypeInternal = TaskType | 'smalltask';
