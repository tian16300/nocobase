import path from 'path';
import { InstallOptions, Plugin } from '@nocobase/server';
import { resolve } from 'path';
// import prj from './collections/prj';
// import prjPlan from './collections/prj-plan';
// import prjsUsers from './collections/prjs-users';
// import task from './collections/task';
// import taskHour from './collections/taskHour';
export class PrjManagerPlugin extends Plugin {
  afterAdd() { }

  beforeLoad() {
    this.db.addMigrations({
      namespace: this.name,
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this
      }
    });
  }

  async load() {
    //导入库
    await this.importCollections(resolve(__dirname, 'collections'));
    // await this.db.collection(prjsUsers).sync();
    // await this.db.collection(prj).sync();
    // await this.db.collection(prjPlan).sync();
    // await this.db.collection(task).sync();
    // await this.db.collection(taskHour).sync();


    

  }
  async install(options?: InstallOptions) {
    await this.syncCollectionsOptions(['prj', 'prjs_users', 'task', 'prj_plan']);
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
    if (repo) {
      await repo.db2cm(collectionName);
    }
  }
  async syncCollectionsOptions(collectionNames) {
    collectionNames.forEach(async (collectionName) => {
      await this.sysncTableFieldsToCollection(collectionName);
    });
  }


  async afterEnable() {

  }


  async afterDisable() { }

  async remove() { }
}

export default PrjManagerPlugin;
