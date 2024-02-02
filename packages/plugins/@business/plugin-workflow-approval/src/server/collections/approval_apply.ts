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
      foreignKey: 'approval_apply_id',
      otherKey: 'approval_user_id',
      name: 'currentApprovalUsers',
      type: 'belongsToMany',
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
      interface: 'm2m',
      through: 'approval_users_mid',
      target: 'users'
    },
    {
      foreignKey: 'approval_apply_id',
      otherKey: 'copy_user_id',
      name: 'copyToUsers',
      type: 'belongsToMany',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '抄送人',
      },
      interface: 'm2m',
      through: 'approval_copy_users_mid',
      target: 'users'
    },
    {
      name: 'status',
      type: 'string',
      interface: 'select',
      uiSchema: {
        enum: [
          {
            value: '-1',
            label: '已提交',
          },
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
      }
    },
    {
      name: 'workflowKey',
      type: 'string',
      isForeignKey: true,
      interface: 'input',
    },
    {
      name: 'workflow',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'workflowKey',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'title',
            value: 'key',
          },
        },
        title: '关联流程',
      },
      target: 'workflows',
      targetKey: 'key',
    },
    {
      name: 'jobId',
      type: 'bigInt',
      interface: 'integer',
      isForiegnKey: true,
      uiSchema: {
        type: 'number',
        title: 'jobId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      type: 'belongsTo',
      name: 'job',
      target: 'jobs',
      foreignKey: 'jobId',
      interface: 'obo',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '任务',
      },
    },
    {
      name: 'nodeId',
      type: 'bigInt',
      interface: 'integer',
      isForiegnKey: true,
      uiSchema: {
        type: 'number',
        title: 'nodeId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      type: 'belongsTo',
      name: 'node',
      target: 'flow_nodes',
      foreignKey: 'nodeId',
      interface: 'obo',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '节点',
      },
    },
    {
      name: 'executionId',
      type: 'bigInt',
      interface: 'integer',
      isForiegnKey: true,
      uiSchema: {
        type: 'number',
        title: 'executionId',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'belongsTo',
      name: 'execution',
      target: 'executions',
      foreignKey: 'executionId',
      interface: 'obo',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '执行记录',
      },
    },
    {
      name: 'applyResults',
      type: 'hasMany',
      interface: 'o2m',
      foreignKey: 'apply_id',
      onDelete: 'CASCADE',
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
