export default {
  name: 'approval_results',
  title: '审批结果',
  inherit: false,
  hidden: false,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'approvalUser_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'approvalUser_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'apply_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'apply_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
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
      name: 'approvalUser',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'approvalUser_id',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '审批人',
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      name: 'approvalDate',
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
        title: '审批日期',
      },
    },
    {
      name: 'approvalStatus',
      type: 'string',
      interface: 'select',
      uiSchema: {
        enum: [
          {
            value: '1',
            label: '已同意',
            color: 'success',
          },
          {
            value: '2',
            label: '已拒绝',
            color: 'error',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '审批状态',
      },
    },
    {
      name: 'approvalComments',
      type: 'text',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '审批备注',
      },
    },
    {
      type: 'belongsTo',
      name: 'execution',
      interface: 'obo',
      foreignKey: 'executionId',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '日志',
      },
      target: 'executions',
      targetKey: 'id',
    },
    {
      uiSchema: {
        'x-component': 'Input.JSON',
        type: 'object',
        'x-component-props': {
          autoSize: {
            minRows: 5,
          },
        },
        default: null,
        title: '实例结果',
      },
      name: 'result',
      type: 'json',
      interface: 'json',
    }
  ],
  logging: true,
  autoGenId: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: true,
  template: 'general',
  view: false,
  schema: 'public',
};
