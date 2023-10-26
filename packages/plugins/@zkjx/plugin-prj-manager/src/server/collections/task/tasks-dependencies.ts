import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'tasks_dependencies',
  "title": "任务依赖中间表",
  timestamps: true,
  autoGenId: false,
  autoCreate: false,
  isThrough: true,
  sortable: false,
  hidden:true,
  fields: [
    {
      name: 'taskId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'taskId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'taskDepId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'taskDepId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
  ],
} as CollectionOptions;
