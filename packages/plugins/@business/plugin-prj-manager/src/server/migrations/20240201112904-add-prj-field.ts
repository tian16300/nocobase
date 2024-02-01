import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.6';

  async up() {
    // coding
    const { db } = this.context;
    const fieldRepo = db.getRepository('fields');
    const exist = await fieldRepo.findOne({
      filter: {
        name: 'bom_modules',
        collectionName: 'prj',
      },
    });
    if (!exist) {
     await fieldRepo.create({
        values: {
          name: 'bom_modules',
          type: 'hasMany',
          interface: 'o2m',
          collectionName: 'prj',
          foreignKey: 'prjId',
          onDelete: 'CASCADE',
          uiSchema: {
            'x-component': 'AssociationField',
            'x-component-props': {
              multiple: true,
              fieldNames: {
                label: 'id',
                value: 'id',
              },
            },
            title: '项目模块',
          },
          target: 'prj_bom_module',
          targetKey: 'id',
          sourceKey: 'id',
        },
      });
    }
  }
}
