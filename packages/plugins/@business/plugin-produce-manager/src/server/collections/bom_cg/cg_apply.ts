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

      collectionName: 'cg_apply',

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
      name: 'channel_dicId',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: '{{t("Parent ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'channel_plstform_dicId',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'channel_plstform_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'provider_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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
      name: 'level',
      type: 'level',
      interface: 'level',

      collectionName: 'cg_apply',

      uiSchema: {
        type: 'number',
        title: '层级',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

      uiSchema: {
        'x-component': 'Checkbox',
        type: 'boolean',
        title: '是否分组',
      },
    },
    {
      name: 'remark',
      type: 'text',
      interface: 'textarea',

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

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
      defaultId: 94,
      targetKey: 'id',
    },
    {
      name: 'apply_date',
      type: 'date',
      interface: 'datetime',

      collectionName: 'cg_apply',

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
      name: 'code',
      type: 'sequence',
      interface: 'sequence',

      collectionName: 'cg_apply',

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
            key: 4118,
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

      collectionName: 'cg_apply',

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

      collectionName: 'cg_apply',

      foreignKey: 'currentApproval_id',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'status',
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

      collectionName: 'cg_apply',

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
      name: 'prj_wl_cb_list',
      type: 'hasMany',
      interface: 'o2m',

      collectionName: 'cg_apply',

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
      name: 'cg_wl_list',
      type: 'hasMany',
      interface: 'o2m',

      collectionName: 'cg_apply',
      uiSchema: {
        title: '采购物料明细',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
      target: 'cg_wl_list',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      foreignKey: 'cg_apply_id',
      targetKey: 'id',
    },
    {
      name: 'total_amount',
      type: 'double',
      interface: 'number',

      collectionName: 'cg_apply',

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '含税金额',
      },
    },
    {
      name: 'total_ws_amount',
      type: 'double',
      interface: 'number',

      collectionName: 'cg_apply',

      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '未税金额',
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
  template: 'tree',
  view: false,
  tree: 'adjacencyList',
  schema: 'public',
};
