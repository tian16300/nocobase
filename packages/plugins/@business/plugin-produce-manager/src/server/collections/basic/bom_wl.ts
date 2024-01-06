export default {
  name: 'bom_wl',
  title: 'BOM物料明细',
  inherit: false,
  hidden: false,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',

      collectionName: 'bom_wl',

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

      collectionName: 'bom_wl',

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

      collectionName: 'bom_wl',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'cg_apply_wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bom_id',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'bom_wl',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bom_wl_count',
      type: 'bigInt',
      interface: 'integer',

      collectionName: 'bom_wl',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_wl_count',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',

      collectionName: 'bom_wl',

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

      collectionName: 'bom_wl',

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

      collectionName: 'bom_wl',

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

      collectionName: 'bom_wl',

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
      name: 'expect_arrival_time',
      type: 'date',
      interface: 'datetime',

      collectionName: 'bom_wl',

      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '期望到货日期',
      },
    },
    {
      name: 'prj',
      type: 'belongsTo',
      interface: 'm2o',

      collectionName: 'bom_wl',

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
      name: 'progress',
      type: 'string',
      interface: 'select',

      collectionName: 'bom_wl',

      uiSchema: {
        enum: [
          {
            value: '1',
            label: '申请中',
          },
          {
            value: '2',
            label: '下单中',
          },
          {
            value: '3',
            label: '已入库',
          },
          {
            value: '4',
            label: '已领料',
          },
          {
            value: '5',
            label: '已退料',
          },
        ],
        type: 'string',
        'x-component': 'Select',
        title: '进度',
      },
    },
    {
      name: 'cg_wl_list',
      type: 'belongsToMany',
      interface: 'm2m',

      collectionName: 'bom_wl',

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
      target: 'basic_cg_detail',
      through: 'cg_apply_bom_throught',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'num',
      type: 'bigInt',
      interface: 'integer',
      description: '需求数量',
      collectionName: 'bom_wl',

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '数量',
      },
      overriding: true,
    },
    {
      name: 'bom',
      type: 'belongsTo',
      interface: 'm2o',

      collectionName: 'bom_wl',

      foreignKey: 'bom_id',
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
        title: 'BOM',
      },
      target: 'bom',
      targetKey: 'id',
    },
    {
      name: 'boms',
      type: 'belongsToMany',
      interface: 'm2m',

      collectionName: 'bom_wl',

      foreignKey: 'bom_wl_id',
      otherKey: 'bom_id',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '所属节点',
      },
      target: 'bom',
      through: 't_nbbl36l3m3o',
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
  inherits: ['basic_wl_info', 'data_log_flag'],
  schema: 'public',
};
