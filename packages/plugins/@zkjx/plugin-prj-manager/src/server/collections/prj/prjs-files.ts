import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prjs_files',
  title: '项目材料中间表',
  timestamps: true,
  autoGenId: false,
  autoCreate: true,
  isThrough: true,
  sortable: false,
  fields: [
    {
      name: 'prj_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prj_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'file_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'file_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
  ],
} as CollectionOptions;
