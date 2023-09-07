import { Migration } from '@nocobase/server';

export default class extends Migration {
  async up() {
    await this.syncCollectionsOptions(['prj', 'prjsUsers', 'task', 'prj_plan']);
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.prj-manager`,
      actions: ['prj:*', 'prjsUsers:*', 'task:*', 'prj_plan:*'],
    });
    this.app.acl.allow('prj', 'list', 'loggedIn');
    this.app.acl.allow('task', 'list', 'loggedIn');
    this.app.acl.allow('prj_plan', 'list', 'loggedIn');
  }
  async sysncTableFieldsToCollection(collectionName) {
    const repo = this.db.getRepository<any>('collections');
    const record = await repo.findOne({
      filter: {
        name: collectionName
      }
    });
    if (record) {
      const fRepo = this.db.getRepository<any>('fields');
      //更新fields
      await fRepo.destroy({
        filter: {
          collectionName: collectionName
        }
      });
      await repo.destroy({
        filterByTk: record.id
      });
      
      await repo.db2cm(collectionName);


    } else {
      //创建
      await repo.db2cm(collectionName);

    }


  }
  async syncCollectionsOptions(collectionNames) {
    collectionNames.forEach(async (collectionName) => {
      await this.sysncTableFieldsToCollection(collectionName);
    });
  }
  async down() { }
}
