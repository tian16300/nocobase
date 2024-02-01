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
        name: 'modules',
        collectionName: 'bom_wl_list',
      },
    });
    if (!exist) {
     await fieldRepo.create({
        values: {
    "foreignKey": "bom_wl_id",
    "otherKey": "bom_module_id",
    "name": "modules",
    "type": "belongsToMany",
    "uiSchema": {
        "x-component": "AssociationField",
        "x-component-props": {
            "multiple": true,
            "fieldNames": {
                "label": "id",
                "value": "id"
            }
        },
        "title": "所属模块"
    },
    "interface": "m2m",
    "through": "bom_module_mid",
    "target": "prj_bom_module",
    "collectionName": "bom_wl_list"
}
      });
    }
  }
}
