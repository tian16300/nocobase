export default {
  name: 'basic_bom_wl',
  title: 'BOM明细基础表',
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
        name: 'bom_wl_code',
        type: 'sequence',
        interface: 'sequence',
        description: null,
  
        patterns: [
          {
            type: 'string',
            options: {
              value: 'BOMWL-',
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
              key: 31817,
            },
          },
        ],
        uiSchema: {
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {},
          title: '编码',
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
      name: 'price',
      type: 'double',
      interface: 'number',
      description: null,

      uiSchema: {
        'x-component-props': {
          step: '1',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '含税价格(CNY)',
      },
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
      name: 'ws_price',
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
        title: '未税价格(CNY)',
      },
      engine: 'formula.js',
      expression: '{{price}}/(1+{{rate}})',
    },
    {
      name: 'num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '需求数量',
      },
    },
    {
      name: 'tc_num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '调出数量',
      },
      defaultValue: 0,
    },
    {
      name: 'tk_num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '退库数量',
      },
      defaultValue: 0,
    },
    {
      name: 'rk_num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '入库数量',
      },
    },
    {
      name: 'll_num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '领料数量',
      },
    },
    {
      name: 'tl_num',
      type: 'bigInt',
      interface: 'integer',
      description: null,

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '退料数量',
      },
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
      expression: '{{price}}*({{num}}-{{tc_num}}-{{tk_num}})',
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
      expression: '{{price}}*({{num}}-{{tc_num}}-{{tk_num}})/(1+{{rate}})',
    },
    {
      name: 'td_date',
      type: 'date',
      interface: 'datetime',
      description: null,

      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '提单日期',
      },
    },
    {
        "name": "jh_priority",
        "type": "string",
        "interface": "select",
        "uiSchema": {
            "enum": [
                {
                    "value": "A",
                    "label": "A"
                },
                {
                    "value": "B",
                    "label": "B"
                },
                {
                    "value": "C",
                    "label": "C"
                }
            ],
            "type": "string",
            "x-component": "Select",
            "title": "交货优先级"
        }
    },
    {
       
        "name": "status",
        "type": "string",
        "interface": "select",
        "uiSchema": {
            "enum": [
                {
                    "value": "申请中",
                    "label": "申请中"
                },
                {
                    "value": "采购中",
                    "label": "采购中"
                },
                {
                    "value": "已下单",
                    "label": "已下单"
                },
                {
                    "value": "已到货",
                    "label": "已到货"
                },
                {
                    "value": "已入库",
                    "label": "已入库"
                }
            ],
            "type": "string",
            "x-component": "Select",
            "title": "状态"
        }
    }
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
