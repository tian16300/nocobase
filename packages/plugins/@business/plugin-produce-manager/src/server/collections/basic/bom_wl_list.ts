export default {
  name: 'bom_wl_list',
  title: 'BOM物料明细',
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
      name: 'prjId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prjId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'cg_apply_wl_id',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cg_apply_wl_id',
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
      name: 'prj',
      type: 'belongsTo',
      interface: 'm2o',
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
      name: 'cg_wl_list',
      type: 'belongsToMany',
      interface: 'm2m',
      foreignKey: 'bom_wl_id',
      otherKey: 'cg_wl_id',
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
      through: 'cg_apply_bom_throught',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bom_apply',
      type: 'belongsTo',
      interface: 'm2o',
      collectionName: 'bom_wl_list',
      foreignKey: 'bom_apply_id',
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
        title: 'BOM申请',
      },
      target: 'bom_apply',
      targetKey: 'id',
    },
    {
      name: 'cg_apply',
      type: 'belongsTo',
      interface: 'obo',
      collectionName: 'bom_wl',
      description: null,
      parentKey: null,
      reverseKey: null,
      foreignKey: 'cg_apply_id',
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
        title: '采购申请',
      },
      target: 'cg_apply',
      targetKey: 'id',
    },
    {
      name: 'cg_apply_list',
      type: 'belongsToMany',
      interface: 'm2m',
      foreignKey: 'bom_wl_id',
      otherKey: 'cg_apply_id',
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
      target: 'cg_apply',
      through: 'cg_apply_bom_throught',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'label_gz',
      interface: 'input',
      type: 'string',
      collectionName: 'bom_wl_list',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '工站',
      },
    },
    {
      name: 'label_unit',
      interface: 'input',
      type: 'string',
      collectionName: 'bom_wl_list',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '单元',
      },
    },
    {
     
      "name": "base_unit",
      "type": "belongsTo",
      "interface": "obo",
      "collectionName": "bom_wl_list",
      "foreignKey": "base_unit_id",
      "onDelete": "SET NULL",
      "uiSchema": {
          "x-component": "AssociationField",
          "x-component-props": {
              "multiple": false,
              "fieldNames": {
                  "label": "id",
                  "value": "id"
              }
          },
          "title": "计量单位"
      },
      "target": "base_units",
      "overriding": true,
      "targetKey": "id"
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
  inherits: ['basic_bom_wl', 'basic_wl_info'],
  schema: 'public',
};
