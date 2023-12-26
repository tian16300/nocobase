import { Migration } from '@nocobase/server';
export default class extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<0.9.0-alpha.3');
    if (!match) {
      return;
    }
    const Storage = this.db.getCollection('storages');
   
    const exist = await Storage.repository.findOne({
      filter: {
        name: 'approval',
      },
    })
    if (!exist) {
      await Storage.repository.create({
        values:{
          "title": "审批材料",
          "name": "approval",
          "type": "local",
          "options": {
              "documentRoot": "storage/uploads"
          },
          "path": "approval",
          "baseUrl": "/storage/uploads",
          "default": false,
          "paranoid": true
      }
      });
    }
  }
}
