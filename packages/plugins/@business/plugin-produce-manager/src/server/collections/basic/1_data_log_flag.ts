export default {
  name: 'data_log_flag',
  title: '数据标记',
  inherit: false,
  hidden: false,
  description: null,
  fields: [
    {
      name: 'dataFlag',
      type: 'string',
      interface: 'select',
      description: null,
      collectionName: 'data_log_flag',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        enum: [
          {
            value: 'none',
            label: '无',
          },
          {
            value: 'isNew',
            label: '新增',
          },
          {
            value: 'isDelete',
            label: '已作废',
          },
          {
            value: 'isRecover',
            label: '已恢复',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '数据标记',
      },
      defaultValue: 'none',
    },
  ],
  logging: true,
  autoGenId: false,
  createdBy: false,
  updatedBy: false,
  createdAt: false,
  updatedAt: false,
  sortable: false,
  template: 'general',
  view: false,
  schema: 'public',
};
