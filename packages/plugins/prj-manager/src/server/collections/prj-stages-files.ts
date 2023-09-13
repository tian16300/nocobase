import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prj_stages_files',
  "title": "项目阶段成果物中间表",
  timestamps: true,
  autoGenId: false,
  autoCreate: true,
  isThrough: true,
  sortable: false,
  fields: [
    {
      name: 'prj_stage_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prj_stage_id',
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
