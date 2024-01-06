export default {
  name: 'bom_count_wl',
  title: 'BOM物料统计明细',
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
      overriding: true,
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
      type: 'hasMany',
      interface: 'o2m',

      foreignKey: 'bom_wl_count',
      onDelete: 'SET NULL',
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
  inherits: ['bom_wl'],
  schema: 'public',
};
