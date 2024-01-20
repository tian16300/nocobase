import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<=0.19.0-alpha.4';

  async up() {
    // coding
    const { db } = this.context;
    const repo = db.getRepository('fields');
    const existed = await repo.findOne({
      filter: {
        name: 'cg_apply_list',
        collectionName: 'bom_wl_list',
      },
    });
    if (!existed) {
      await repo.create({
        values: {
          name: 'cg_apply_list',
          type: 'belongsToMany',
          collectionName: 'bom_wl_list',
          interface: 'm2m',
          foreignKey: 'bom_wl_id',
          otherKey: 'cg_apply_id',
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
          target: 'cg_apply',
          through: 'cg_apply_bom_throught',
          targetKey: 'id',
          sourceKey: 'id',
        }
      });
    }
  }
}
