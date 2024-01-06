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
      name: 'userId',
      type: 'bigInt',
      interface: 'integer',
      
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'userId',
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
      name: 'sort',
      type: 'sort',
      hidden: true,
    },
    {
      name: 'createdById',
      type: 'context',
      
      dataType: 'bigInt',
      dataIndex: 'state.currentUser.id',
      createOnly: true,
      visible: true,
      index: true,
    },
    {
      name: 'createdBy',
      type: 'belongsTo',
      target: 'users',
      foreignKey: 'createdById',
      targetKey: 'id',
    },
    {
      name: 'updatedById',
      type: 'context',
      dataType: 'bigInt',
      dataIndex: 'state.currentUser.id',
      visible: true,
      index: true,
    },
    {
      name: 'updatedBy',
      type: 'belongsTo',
      target: 'users',
      foreignKey: 'updatedById',
      targetKey: 'id',
    },
    {
      name: 'files',
      type: 'belongsToMany',
      interface: 'attachment',
      uiSchema: {
        'x-component-props': {
          accept: 'image/*',
          multiple: true,
        },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '附件',
      },
      target: 'attachments',
      storage: 'approval',
      through: 'appl',
      foreignKey: 'approval_result_id',
      otherKey: 'attachment_id',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'userType',
      type: 'string',
      interface: 'select',      
      uiSchema: {
        enum: [
          {
            value: '1',
            label: '申请人',
          },
          {
            value: '2',
            label: '审批人',
          }
        ],
        type: 'string',
        'x-component': 'Select',
        title: '用户类型',
      },
    },
    {
      name: 'userAction',
      type: 'string',
      interface: 'select',      
      uiSchema: {
        enum: [
          {
            value: '0',
            label: '申请',
          },
          {
            value: '-4',
            label: '撤销',
          },
          {
            value: '1',
            label: '同意',
          },
          {
            value: '-5',
            label: '拒绝',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '操作类型',
      },
    },
    {
      name: 'remark',
      type: 'text',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '备注',
      },
    },
    {
      name: 'workflowKey',
      type: 'string',
      isForeignKey: true,
      interface: 'input'
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
          }
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
      }
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
      }
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
      }
    }, 
    {
      name: 'user',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'userId',
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
        title: '用户',
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      name: 'actionTime',
      type: 'date',
      interface: 'datetime',
      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: true,
          timeFormat: 'HH:mm:ss',
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '操作时间',
      },
    },
  ],
  category: [],
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
