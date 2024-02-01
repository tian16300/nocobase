export default {
  name: 'bom_module_mid',
  title: '模块物料中间表',
  inherit: false,
  hidden: false,
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
      name: 'bom_wl_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'bom_module_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'bom_module_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
  ],
};
