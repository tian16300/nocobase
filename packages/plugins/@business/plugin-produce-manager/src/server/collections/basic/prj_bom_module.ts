export default {
  logging: true,
  autoGenId: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: true,
  name: 'prj_bom_module',
  template: 'tree',
  view: false,
  tree: 'adjacencyList',
  titleField: "name",
  fields: [
    {
      interface: 'integer',
      name: 'parentId',
      type: 'bigInt',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: '{{t("Parent ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      interface: 'm2o',
      type: 'belongsTo',
      name: 'parent',
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
      target: 'prj_bom_module',
    },
    {
      interface: 'o2m',
      type: 'hasMany',
      name: 'children',
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
      target: 'prj_bom_module',
    },
    {
      interface: 'level',
      name: 'level',
      type: 'level',
      uiSchema: {
        type: 'number',
        title: '层级',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
      interface: 'id',
    },
    {
      name: 'createdAt',
      interface: 'createdAt',
      type: 'date',
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
      interface: 'createdBy',
      type: 'belongsTo',
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
    },
    {
      type: 'date',
      field: 'updatedAt',
      name: 'updatedAt',
      interface: 'updatedAt',
      uiSchema: {
        type: 'string',
        title: '{{t("Last updated at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      },
    },
    {
      type: 'belongsTo',
      target: 'users',
      foreignKey: 'updatedById',
      name: 'updatedBy',
      interface: 'updatedBy',
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
    },
    {
      
        "name": "prj",
        "type": "belongsTo",
        "interface": "obo",
        "collectionName": "prj_bom_module",
        "foreignKey": "prjId",
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
            "title": "项目"
        },
        "target": "prj",
        "targetKey": "id"
    },
    {
      name: 'name',
      interface: 'input',
      type: 'string',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '名称',
      },
    },
    {
      uiSchema: {
        enum: [
          {
            value: 'label_gz',
            label: '工站',
          },
          {
            value: 'label_unit',
            label: '单元',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '类型',
      },
      name: 'type',
      type: 'string',
      interface: 'select',
    },
    {
        "name": "count",
        "type": "bigInt",
        "interface": "integer",
        "uiSchema": {
            "type": "number",
            "x-component": "InputNumber",
            "x-component-props": {
                "stringMode": true,
                "step": "1"
            },
            "x-validator": "integer",
            "title": "条数"
        }
    }
  ],
  title: '项目模块',
};
