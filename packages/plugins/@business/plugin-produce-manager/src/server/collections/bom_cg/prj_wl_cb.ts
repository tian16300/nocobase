export default {
  name: 'prj_wl_cb',
  title: '项目物料成本',
  inherit: false,
  hidden: false,
  description: null,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
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
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
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
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
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
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
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
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
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
      interface: 'obo',
      collectionName: 'prj_wl_cb',
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
      name: 'add_wl_list',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      foreignKey: 'add_prj_wl_cb_id',
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
        title: '新增物料',
      },
      target: 'bom_wl',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bom_wl_list',
      type: 'belongsToMany',
      interface: 'm2m',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      foreignKey: 'total_prj_wl_cb_id',
      otherKey: 'total_bom_wl_id',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '总物料',
      },
      through: 'prjWlCb_bomWl_mid',
      target: 'bom_wl',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'history_wl_list',
      type: 'belongsToMany',
      interface: 'm2m',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      foreignKey: 'history_prj_wl_cb_id',
      otherKey: 'history_bom_wl_id',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '已投入物料',
      },
      through: 'prjWlCb_bomWl_mid',
      target: 'bom_wl',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'add_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '新增物料含税金额',
      },
    },
    {
      name: 'add_ws_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '新增物料未税金额',
      },
    },
    {
      name: 'total_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '总物料含税金额',
      },
    },
    {
      name: 'total_ws_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '总物料未税金额',
      },
    },
    {
      name: 'history_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '已投入物料含税金额',
      },
    },
    {
      name: 'history_ws_cb',
      type: 'double',
      interface: 'number',
      description: null,
      collectionName: 'prj_wl_cb',
      parentKey: null,
      reverseKey: null,
      uiSchema: {
        'x-component-props': {
          step: '0.00001',
          stringMode: true,
        },
        type: 'number',
        'x-component': 'InputNumber',
        title: '已投入物料未税金额',
      },
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
};
