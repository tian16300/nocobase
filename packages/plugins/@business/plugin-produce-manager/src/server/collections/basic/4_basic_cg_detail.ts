export default {
  name: 'basic_cg_detail',
  title: '采购明细基础表',
  inherit: false,
  hidden: false,
  description: null,
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
      name: 'cg_wl_code',
      type: 'sequence',
      interface: 'sequence',
      description: '采购物料编码',
      patterns: [
        {
          type: 'string',
          options: {
            value: 'CGWL-',
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
            digits: 4,
            start: 1,
            cycle: '0 0 * * *',
            key: 60851,
          },
        },
      ],
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        title: '采购物料编码',
      },
      unique: false,
    },
    {
      name: 'cgUnit_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cgUnit_id',
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
      name: 'cgNum',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      parentKey: null,
      reverseKey: null,
      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '采购数量',
      },
    },
    {
      name: 'cgUnit',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'cgUnit_id',
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
        title: '采购单位',
      },
      target: 'base_units',
      targetKey: 'id',
    },
    {
      name: 'rate',
      type: 'float',
      interface: 'percent',
      description: '我国现行增值税属于比例税率，根据应税行为一共分为13%，9%，6%三档税率及5%，3%两档征收率',
      uiSchema: {
        'x-component-props': {
          step: '1',
          stringMode: true,
          addonAfter: '%',
        },
        type: 'string',
        'x-component': 'Percent',
        title: '税率（%）',
      },
      defaultValue: 0.13,
    },
    {
      name: 'price',
      type: 'double',
      interface: 'number',
      description: null,

      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '含税价格(CNY)',
      },
    },
    {
      name: 'ws_price',
      type: 'formula',
      interface: 'formula',
      dataType: 'double',
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'string',
        'x-component': 'Formula.Result',
        'x-read-pretty': true,
        title: '未税价格(CNY)',
      },
      engine: 'formula.js',
      expression: '{{price}}/(1+{{rate}})',
    },
    {
      name: 'amount',
      type: 'formula',
      interface: 'formula',
      description: null,

      dataType: 'double',
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'string',
        'x-component': 'Formula.Result',
        'x-read-pretty': true,
        title: '含税金额(CNY)',
      },
      engine: 'formula.js',
      expression: '{{price}}*{{cgNum}}',
    },
    {
      name: 'ws_amount',
      type: 'formula',
      interface: 'formula',
      description: null,

      dataType: 'double',
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'string',
        'x-component': 'Formula.Result',
        'x-read-pretty': true,
        title: '未税金额(CNY)',
      },
      engine: 'formula.js',
      expression: '{{price}}*{{cgNum}}/(1+{{rate}})',
    },
    {
      name: 'status',
      type: 'string',
      interface: 'select',
      uiSchema: {
        enum: [
          {
            value: '申请中',
            label: '申请中',
          },
          {
            value: '采购中',
            label: '采购中',
          },
          {
            value: '已下单',
            label: '已下单',
          },
          {
            value: '已到货',
            label: '已到货',
          },
          {
            value: '已入库',
            label: '已入库',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '状态',
      },
    },

    {
      name: 'link',
      type: 'text',
      interface: 'textarea',
      description: null,

      parentKey: null,
      reverseKey: null,
      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '平台链接',
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
