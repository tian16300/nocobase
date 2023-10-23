export default {
  name: 'risk_basic',
  title: '状态检测表',
  inherit: false,
  hidden: false,
  description: null,
  fields: [
    {
      name: 'engine',
      type: 'string',
      interface: 'radioGroup',
      uiSchema: {
        type: 'string',
        title: '{{t("Calculation engine")}}',
        'x-component': 'Radio.Group',
        enum: [
          {
            value: 'math.js',
            label: 'Math.js',
            tooltip:
              "{{t('Math.js comes with a large set of built-in functions and constants, and offers an integrated solution to work with different data types')}}",
            link: 'https://mathjs.org/',
          },
          {
            value: 'formula.js',
            label: 'Formula.js',
            tooltip: '{{t("Formula.js supports most Microsoft Excel formula functions.")}}',
            link: 'https://formulajs.info/functions/',
          },
        ],
        default: 'formula.js',
      },
    },
    {
      name: 'sourceCollection',
      type: 'string',
      interface: 'select',

      uiSchema: {
        type: 'string',
        title: '{{t("Collection")}}',
        'x-component': 'CollectionSelect',
        'x-component-props': {},
      },
    },
    {
      name: 'expression',
      type: 'text',
      interface: 'expression',

      uiSchema: {
        type: 'string',
        title: '{{t("Expression")}}',
        'x-component': 'DynamicExpression',
      },
    },
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
      name: 'title',
      type: 'string',
      interface: 'input',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '规则名称',
      },
    },
    {
      name: 'name',
      type: 'string',
      interface: 'input',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '名称',
      },
    },
    {
      name: 'icon',
      type: 'string',
      interface: 'icon',

      uiSchema: {
        type: 'string',
        'x-component': 'IconPicker',
        title: '图标',
      },
    },
    {
      name: 'color',
      type: 'string',
      interface: 'color',

      defaultValue: '#1677FF',
      uiSchema: {
        type: 'string',
        'x-component': 'ColorSelect',
        default: '#1677FF',
        title: '颜色',
      },
    },
    {
      name: 'time',
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
        title: '频率',
      },
    }
  ],
  category: [],
  logging: true,
  template: 'expression',
  view: false,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: true,
  schema: 'public',
};
