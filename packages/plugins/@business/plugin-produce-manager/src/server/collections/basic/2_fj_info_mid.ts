export default {
  name: 'fj_info_mid',
  title: '附件中间表',
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
      name: 'basic_wl_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'basic_wl_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'fj_info_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'fj_info_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
  ],
};
