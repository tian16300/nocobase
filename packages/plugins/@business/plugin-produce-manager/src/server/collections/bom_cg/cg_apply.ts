export default {
  name: 'cg_apply',
  title: '采购申请',
  inherit: false,
  hidden: false,
  description: null,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',
      description: null,

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
      name: 'currentApproval_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'currentApproval_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'channel_dicId',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'channel_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'channel_platform_dicId',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'channel_platform_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'provider_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'provider_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      description: null,

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
      description: null,

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
      description: null,

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
      description: null,

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
      description: null,

      patterns: [
        {
          type: 'string',
          options: {
            value: 'CG-',
          },
        },
        {
          type: 'date',
          options: {
            format: 'YYMMDD',
          },
        },
        {
          type: 'string',
          options: {
            value: '-',
          },
        },
        {
          type: 'integer',
          options: {
            digits: 3,
            start: 1,
            cycle: '0 0 * * *',
            key: 34095,
          },
        },
      ],
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        title: '采购编号',
      },
    },
    {
      name: 'provider',
      type: 'belongsTo',
      interface: 'obo',
      description: null,

      foreignKey: 'provider_id',
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
        title: '供应商',
      },
      target: 'provider',
      targetKey: 'id',
    },
    {
      name: 'approvalStatus',
      type: 'belongsTo',
      interface: 'obo',
      description: null,

      foreignKey: 'currentApproval_id',
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
        title: '审批状态',
      },
      target: 'approval_apply',
      targetKey: 'id',
    },
    {
      name: 'prjs',
      type: 'belongsToMany',
      interface: 'm2m',
      description: null,

      foreignKey: 'cgApply_id',
      otherKey: 'prjId',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '项目',
      },
      target: 'prj',
      through: 'cgApply_prjs',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'cg_wl_list',
      type: 'hasMany',
      interface: 'o2m',
      description: null,

      foreignKey: 'cg_apply_id',
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
        title: '采购物料明细',
      },
      target: 'cg_wl_list',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'prj_wl_cb_list',
      type: 'hasMany',
      interface: 'o2m',
      description: null,

      foreignKey: 'cg_apply_id',
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
        title: '项目物料成本',
      },
      target: 'prj_wl_cb',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'total_amount',
      type: 'double',
      interface: 'number',
      description: null,

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '含税金额(CNY)',
      },
    },
    {
      name: 'total_ws_amount',
      type: 'double',
      interface: 'number',
      description: null,

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '未税金额(CNY)',
      },
    },
    {
      name: 'channel',
      type: 'belongsTo',
      interface: 'dic',
      description: null,

      uiSchema: {
        'x-component-props': {
          service: {
            params: {
              filter: {
                $and: [
                  {
                    dicCode: {
                      $eq: 'source_channel',
                    },
                  },
                ],
              },
            },
          },
          multiple: false,
          fieldNames: {
            label: 'label',
            value: 'id',
            icon: 'icon',
            color: 'color',
          },
        },
        type: 'object',
        'x-component': 'AssociationField',
        'x-read-pretty': true,
        title: '渠道',
      },
      foreignKey: 'channel_dicId',
      target: 'dicItem',
      dicCode: 'source_channel',
      targetKey: 'id',
    },
    {
      name: 'channel_platform',
      type: 'belongsTo',
      interface: 'dic',
      description: null,

      uiSchema: {
        'x-component-props': {
          service: {
            params: {
              filter: {
                $and: [
                  {
                    dicCode: {
                      $eq: 'source_channel_platform',
                    },
                  },
                ],
              },
            },
          },
          multiple: false,
          fieldNames: {
            label: 'label',
            value: 'id',
            icon: 'icon',
            color: 'color',
          },
        },
        type: 'object',
        'x-component': 'AssociationField',
        'x-read-pretty': true,
        title: '电商平台',
      },
      foreignKey: 'channel_platform_dicId',
      target: 'dicItem',
      dicCode: 'source_channel_platform',
      targetKey: 'id',
    },
    {
      name: 'remark',
      type: 'text',
      interface: 'textarea',
      description: null,

      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '备注',
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
