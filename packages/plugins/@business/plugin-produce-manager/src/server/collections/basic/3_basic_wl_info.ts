export default {
  name: 'basic_wl_info',
  title: '物料明细基础表',
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
      name: 'base_unit_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'base_unit_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'wl_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'prj_wl_stock_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prj_wl_stock_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'public_wl_stock_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'public_wl_stock_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
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
      name: 'wl',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'wl_id',
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
        title: '物料',
      },
      target: 'wl_info',
      targetKey: 'id',
    },
    {
      name: 'type',
      type: 'string',
      interface: 'select',
      uiSchema: {
        enum: [
          {
            value: '采购件',
            label: '采购件',
          },
          {
            value: '机加类',
            label: '机加类',
          },
          {
            value: '焊接类',
            label: '焊接类',
          },
          {
            value: '大板类',
            label: '大板类',
          },
          {
            value: '钣金类',
            label: '钣金类',
          },
          {
            value: '型材类',
            label: '型材类',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '类型',
      },
    },
    {
      name: 'name',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '物料名称',
      },
    },
    {
      name: 'code',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '物料编码',
      },
    },
    {
      name: 'brand',
      type: 'string',
      interface: 'input',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '品牌',
      },
    },
    {
      name: 'model',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '规格/型号/图号',
      },
    },
    {
      name: 'material',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '品牌/材质',
      },
    },
    {
      name: 'fj_info',
      type: 'belongsToMany',
      interface: 'attachment',
      uiSchema: {
        'x-component-props': {
          accept: 'image/*',
          multiple: true,
        },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '图片附件',
      },
      target: 'attachments',
      through: 'fj_info_mid',
      foreignKey: 'basic_wl_id',
      otherKey: 'fj_info_id',
      targetKey: 'id',
      sourceKey: 'id',
      storage: 'wl',
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
      name: 'base_unit',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'base_unit_id',
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
        title: '计量单位',
      },
      target: 'base_units',
      targetKey: 'id',
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
      name: 'prj_wl_stock',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'prj_wl_stock_id',
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
        title: '项目库存',
      },
      target: 'wl_stock',
      targetKey: 'id',
    },
    {
      name: 'public_wl_stock',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'public_wl_stock_id',
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
        title: '公共库存',
      },
      target: 'wl_stock',
      targetKey: 'id',
    },
    {
      "name": "num",
      "type": "bigInt",
      "uiSchema": {
          "type": "number",
          "x-component": "InputNumber",
          "x-component-props": {
              "stringMode": true,
              "step": "1"
          },
          "x-validator": "integer",
          "title": "需求数量"
      },
      "interface": "integer"
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
  titleField: 'name',
};
