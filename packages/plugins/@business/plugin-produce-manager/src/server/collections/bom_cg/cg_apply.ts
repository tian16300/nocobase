export default {
  name: 'cg_apply',
  title: '采购申请',
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
      name: 'channel_plstform_dicId',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'channel_plstform_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'channel_dicId',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'channel_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'currentApproval_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'currentApproval_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'parentId',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: '{{t("Parent ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
      target: 'cg_apply',
    },
    {
      name: 'provider_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'provider_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'parent',
      type: 'belongsTo',
      interface: 'm2o',

      foreignKey: 'parentId',
      treeParent: true,
      onDelete: 'CASCADE',
      uiSchema: {
        title: '{{t("Parent")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
      target: 'cg_apply',
      targetKey: 'id',
    },
    {
      name: 'children',
      type: 'hasMany',
      interface: 'o2m',

      foreignKey: 'parentId',
      treeChildren: true,
      onDelete: 'CASCADE',
      uiSchema: {
        title: '{{t("Children")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
      target: 'cg_apply',
      targetKey: 'id',
      sourceKey: 'id',
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
      name: 'is_group',
      type: 'boolean',
      interface: 'checkbox',

      uiSchema: {
        type: 'boolean',
        'x-component': 'Checkbox',
        title: '是否分组',
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
      name: 'channel_plstform',
      type: 'belongsTo',
      interface: 'dic',

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
      foreignKey: 'channel_plstform_dicId',
      target: 'dicItem',
      dicCode: 'source_channel_platform',
      targetKey: 'id',
    },
    {
      name: 'channel',
      type: 'belongsTo',
      interface: 'dic',

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
      defaultId: 94,
    },
    {
      name: 'apply_date',
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
        title: '申请日期',
      },
    },
    {
      name: 'tax',
      type: 'double',
      interface: 'number',

      uiSchema: {
        'x-component-props': {
          step: '0.01',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '税额',
      },
    },
    {
      name: 'total_price',
      type: 'double',
      interface: 'number',

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '金额',
      },
    },
    {
      name: 'rate',
      type: 'float',
      interface: 'percent',

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
          addonAfter: '%',
        },
        type: 'string',
        'x-component': 'Percent',
        title: '税率',
      },
      defaultValue: 0.13,
    },
    {
      name: 'code',
      type: 'sequence',
      interface: 'sequence',

      patterns: [
        {
          type: 'string',
          options: {
            value: 'CG',
          },
        },
        {
          type: 'date',
          options: {
            format: 'YYYYMMDD',
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
            key: 65246,
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
      name: 'cg_wl_list',
      type: 'hasMany',
      interface: 'o2m',

      foreignKey: 'cg_apply_id',
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
        title: '物料明细',
      },
      target: 'cg_apply_list',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'approvalStatus',
      type: 'belongsTo',
      interface: 'obo',

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
  ],
  logging: true,
  autoGenId: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: true,
  template: 'tree',
  view: false,
  tree: 'adjacencyList',
  schema: 'public',
};
