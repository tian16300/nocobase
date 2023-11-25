import { operators } from './properties';
import { IField } from './types';

export const level: IField = {
  name: 'level',
  type: 'object',
  group: 'systemInfo',
  order: 0,
  title: '层级',
  sortable: true,
  default: {
    name:'level',
    type: 'level',
    uiSchema: {
      type: 'number',
      title: '层级',
      'x-component': 'InputNumber',
      'x-read-pretty': true,
    },
  },
  availableTypes: ['bigInt','integer', 'string'],
  properties: {
    'uiSchema.title': {
      type: 'string',
      title: '层级',
      required: true,
      default: 'level',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    name:{
      type:'string',
      title: '字段名',
      required: true,
      default: 'level',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-disabled': true
    }
  },
  filterable: {
    operators: operators.number,
  },
  titleUsable: true,
};
