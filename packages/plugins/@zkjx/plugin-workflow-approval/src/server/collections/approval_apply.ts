export default {
  name: 'approval_apply',
  title: '审批申请',
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
      name: 'applyUser_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'applyUser_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'applyUser_deptId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'applyUser_deptId',
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
      name: 'code',
      type: 'sequence',
      interface: 'sequence',
      patterns: [
        {
          type: 'date',
          options: {
            format: 'YYYYMMDDhhmmss',
          },
        },
        {
          type: 'integer',
          options: {
            digits: 4,
            start: 1,
            cycle: '0 0 * * *',
            key: 44831,
          },
        },
      ],
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        title: '审批编号',
      },
    },
    {
      name: 'applyUserDept',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'applyUser_deptId',
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
        title: '申请人所在部门',
      },
      target: 'dept',
      targetKey: 'id',
    },
    {
      name: 'applyTitle',
      type: 'string',
      interface: 'input',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '申请标题',
      },
    },
    {
      name: 'applyReason',
      type: 'text',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '申请理由',
      },
    },
    {
      name: 'currentStageIndex',
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
        title: '流程阶段',
      },
    },
    {
      name: 'relatedCollection',
      type: 'string',
      interface: 'collection',
      uiSchema: {
        type: 'string',
        'x-component': 'CollectionSelect',
        title: '关联数据表',
      },
    },
    {
      name: 'related_data_id',
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
        title: '关联数据ID',
      },
    },
    {
      name: 'applyUser',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'applyUser_id',
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
        title: '申请人',
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      name: 'currentApprovalUsers',
      type: 'hasMany',
      interface: 'o2m',
      foreignKey: 'currentApprovalUsers_id',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '当前审批人',
      },
      target: 'users',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'status',
      type: 'string',
      interface: 'select',
      uiSchema: {
        enum: [
          {
            value: '0',
            label: '审批中',
          },
          {
            value: '1',
            label: '已通过',
          },
          {
            value: '2',
            label: '已拒绝',
          },
          {
            value: '3',
            label: '已撤销',
          },
          {
            value: '4',
            label: '审批完成',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '审批状态',
      },
      defaultValue: '0',
    },
    {
      name: 'workflow',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'workflowId',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'title',
            value: 'id',
          }
        },
        title: '关联流程',
      },
      target: 'workflows',
      targetKey: 'id',
    },
    {
      name: 'job',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'jobId',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          }
        },
        title: '任务',
      },
      target: 'jobs',
      targetKey: 'id',
    },   
    {
      name: 'node',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'nodeId',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'title',
            value: 'id',
          }
        },
        title: '节点',
      },
      target: 'flow_nodes',
      targetKey: 'id',
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
          }
        },
        title: '日志',
      },
      target: 'executions',
      targetKey: 'id',
    },
    {
      name: 'applyResults',
      type: 'hasMany',
      interface: 'o2m',
      foreignKey: 'apply_id',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '审批记录',
      },
      target: 'approval_results',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      uiSchema: {
        'x-component-props': {
          accept: 'image/*',
          multiple: true,
        },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '图片',
      },
      name: 'images',
      type: 'belongsToMany',
      target: 'attachments',
      interface: 'attachment',
      storage: 'approval',
    },
    {
      uiSchema: {
        'x-component-props': {
          accept: '*',
          multiple: true,
        },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '附件',
      },
      name: 'files',
      type: 'belongsToMany',
      target: 'attachments',
      interface: 'attachment',
      storage: 'approval',
    },
    {
      name: 'jobIsEnd',
      type: 'boolean',
      interface: 'checkbox',
      collectionName: 'approval_apply',
      uiSchema: {
        'x-component': 'Checkbox',
        type: 'boolean',
        title: '审批完成',
      },
    },
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
