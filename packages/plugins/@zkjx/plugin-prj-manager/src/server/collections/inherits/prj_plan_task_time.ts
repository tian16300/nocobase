/**
 * 计划时间表
 */
export default {
  name: 'prj_plan_task_time',
  title: '计划时间表',
  inherits: false,
  hidden: true,
  fields: [
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      
      field: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: '{{t("Created at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdBy',
      type: 'belongsTo',
      interface: 'createdBy',
      
      target: 'users',
      foreignKey: 'createdById',
      uiSchema: {
        type: 'object',
        title: '{{t("Created by")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'id',
            label: 'nickname',
          },
        },
        'x-read-pretty': true,
      },
      targetKey: 'id',
    },
    {
      name: 'updatedAt',
      type: 'date',
      interface: 'updatedAt',
      
      field: 'updatedAt',
      uiSchema: {
        type: 'string',
        title: '{{t("Last updated at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      },
    },
    {
      name: 'updatedBy',
      type: 'belongsTo',
      interface: 'updatedBy',
      
      target: 'users',
      foreignKey: 'updatedById',
      uiSchema: {
        type: 'object',
        title: '{{t("Last updated by")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'id',
            label: 'nickname',
          },
        },
        'x-read-pretty': true,
      },
      targetKey: 'id',
    },
    {
      name: 'start',
      type: 'date',
      interface: 'datetime',
      
      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '计划开始',
      },
    },
    {
      name: 'end',
      type: 'date',
      interface: 'datetime',
      
      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '计划结束',
      },
    },
    {
      name: 'real_start',
      type: 'date',
      interface: 'datetime',
      
      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '实际开始',
      },
    },
    {
      name: 'real_end',
      type: 'date',
      interface: 'datetime',
      
      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '实际结束',
      },
    },
    {
      name: 'plan_days',
      type: 'bigInt',
      interface: 'integer',
      
      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '计划工期',
      },
    },
    {
      name: 'real_days',
      type: 'bigInt',
      interface: 'integer',      
      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '实际工期',
      }
    }
  ],
  logging: true,
  autoGenId: false,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: false,
  template: 'general',
  view: false,
  schema: 'public',
};
