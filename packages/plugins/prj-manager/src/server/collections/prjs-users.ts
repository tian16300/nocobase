import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prjs_users',
  "title": "项目成员中间表",
  timestamps: true,
  autoGenId: false,
  autoCreate: true,
  isThrough: true,
  sortable: false,
  fields: [
    {
      name: 'prjId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prjId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      }
    },
    {
      name: 'userId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'userId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      }
    }
  ]
} as CollectionOptions;
