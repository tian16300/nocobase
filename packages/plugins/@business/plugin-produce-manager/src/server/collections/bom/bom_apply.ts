export default {
  name: 'bom_apply',
  title: 'BOM申请',
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
      name: 'approval_apply_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'approval_apply_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'prjId',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prjId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bomType_dicId',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bomType_dicId',
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
      name: 'bom_apply_code',
      type: 'sequence',
      interface: 'sequence',
      description: null,
      patterns: [
        {
          type: 'string',
          options: {
            value: 'BOMJH-',
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
            key: 65485,
          },
        },
      ],
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        title: 'BOM编码',
      },
    },
    {
      name: 'prj',
      type: 'belongsTo',
      interface: 'obo',
      description: null,

      parentKey: null,
      reverseKey: null,
      foreignKey: 'prjId',
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
        title: '项目',
      },
      target: 'prj',
      targetKey: 'id',
    },
    {
      name: 'bom_wl_list',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      foreignKey: 'bom_apply_id',
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
        title: 'BOM明细',
      },
      target: 'bom_wl_list',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bomType',
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
                      $eq: 'bom_apply_type',
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
        title: 'BOM类型',
      },
      foreignKey: 'bomType_dicId',
      target: 'dicItem',
      dicCode: 'bom_apply_type',
      targetKey: 'id',
    },
    {
      name: 'orderType',
      type: 'string',
      interface: 'select',
      description: null,

      parentKey: null,
      reverseKey: null,
      uiSchema: {
        enum: [
          {
            value: '1',
            label: '首单',
          },
          {
            value: '2',
            label: '补单',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '单据类型',
      },
    },
    {
      name: 'remark',
      type: 'text',
      interface: 'textarea',
      description: null,

      parentKey: null,
      reverseKey: null,
      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '备注',
      },
    },
    {
      name: 'approval_apply',
      type: 'belongsTo',
      interface: 'obo',
      description: null,
      foreignKey: 'approval_apply_id',
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
        title: '关联审批',
      },
      target: 'approval_apply',
      targetKey: 'id',
    },
    {
      name: 'bd_count',
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
        title: '补单次数',
      },
    },
    {
      name: 'link_bom_applys',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      foreignKey: 'main_bom_apply_id',
      onDelete: 'CASCADE',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '关联审批',
      },
      target: 'bom_apply',
      targetKey: 'id',
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
  titleField: 'bom_apply_code',
};
