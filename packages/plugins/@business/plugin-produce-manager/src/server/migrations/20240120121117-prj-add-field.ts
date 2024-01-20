import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.1';

  async up() {
    // coding
    const { db } = this.context;
    const repo = db.getRepository('fields');
    const existed = await repo.findOne({
      filter: {
        name: 'bom_applys',
        collectionName: 'prj',
      },
    });
    if (!existed) {
      await repo.create({
        values: {
          name: 'bom_applys',
          type: 'hasMany',
          interface: 'o2m',
          collectionName: 'prj',
          foreignKey: 'prjId',
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
            title: 'BOM申请',
          },
          target: 'bom_apply',
          targetKey: 'id',
          sourceKey: 'id',
        },
      });
    }
  }
}
