export default {
    name: 'cgApply_prjs',
    title: '采购申请-项目-中间表',
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
        name: 'cgApply_id',
        type: 'bigInt',
        interface: 'integer',
        isForeignKey: true,
        uiSchema: {
          type: 'number',
          title: 'cgApply_id',
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
      }
    ],
    logging: true,
    autoGenId: true,
    createdBy: false,
    updatedBy: false,
    createdAt: false,
    updatedAt: false,
    sortable: true,
    template: 'general',
    view: false,
    schema: 'public',
  };
  