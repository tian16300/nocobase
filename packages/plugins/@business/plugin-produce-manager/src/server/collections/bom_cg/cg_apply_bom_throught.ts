export default {
  name: 'cg_apply_bom_throught',
  title: '采购申请_BOM',
  inherit: false,
  hidden: false,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',

      collectionName: 'cg_apply_bom_throught',

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
      name: 'cg_apply_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply_bom_throught',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cg_apply_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bom_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply_bom_throught',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'cg_wl_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply_bom_throught',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cg_wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bom_wl_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'cg_apply_bom_throught',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',

      collectionName: 'cg_apply_bom_throught',

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

      collectionName: 'cg_apply_bom_throught',

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

      collectionName: 'cg_apply_bom_throught',

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

      collectionName: 'cg_apply_bom_throught',

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
      name: 'bom_version',
      type: 'string',
      interface: 'input',

      collectionName: 'cg_apply_bom_throught',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: 'BOM版本',
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
