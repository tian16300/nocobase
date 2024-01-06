export default {
  name: 'cg_apply_list',
  title: '采购物料明细',
  inherit: false,
  hidden: false,

  category: [
    {
      id: 5,
      createdAt: '2023-11-10T09:10:05.093Z',
      updatedAt: '2023-11-10T09:10:05.093Z',
      name: '采购',
      color: 'default',
      collectionCategory: {
        createdAt: '2024-01-02T08:36:47.479Z',
        updatedAt: '2024-01-02T08:36:47.479Z',

        categoryId: 5,
      },
    },
    {
      id: 6,
      createdAt: '2024-01-06T14:57:53.688Z',
      updatedAt: '2024-01-06T14:57:53.688Z',
      name: '20240106',
      color: 'default',
      collectionCategory: {
        createdAt: '2024-01-06T15:00:15.483Z',
        updatedAt: '2024-01-06T15:00:15.483Z',

        categoryId: 6,
      },
    },
  ],
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
      name: 'cg_apply_id',
      type: 'bigInt',
      interface: 'integer',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cg_apply_id',
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
      name: 'bom_wl_list',
      type: 'belongsToMany',
      interface: 'm2m',

      foreignKey: 'cg_wl_id',
      otherKey: 'bom_wl_id',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: 'BOM物料明细',
      },
      through: 'cg_apply_bom_throught',
      target: 'bom_wl',
      targetKey: 'id',
      sourceKey: 'id',
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
  inherits: ['basic_wl_info', 'basic_cg_detail'],
  schema: 'public',
};
