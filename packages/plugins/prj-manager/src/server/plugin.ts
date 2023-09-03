import path from 'path';
import { InstallOptions, Plugin } from '@nocobase/server';
import { resolve } from 'path';
export class PrjManagerPlugin extends Plugin {
  afterAdd() { }

  beforeLoad() {
    /**
     * 同步后更新
     */
    // this.db.on("afterDefineCollection", () => {
    //   this.db2cmAsync();
    // })
    // this.db.on("afterSync", (prj, options) => {
    //   this.saveCollections();
    // });
    // this.db.on("task.afterSync", (task, options) => {
    //   // this.updateFields();
    //   console.log("PrjManagerPlugin 同步了");

    // })
    this.db.addMigrations({
      namespace: 'prj-manager',
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this
      }
    });


  }

  async load() {
    //导入库
    await this.importCollections(resolve(__dirname, 'collections'));
    //表的定义
    await this.saveCollections();
    // await this.addMigrations();
    // this.setACL();
  }

  async install(options?: InstallOptions) {

  }
  async saveCollections() {
    await this.syncCollectionsOptions(['prj', 'prjsUsers', 'task']);
    
  }
  async syncCollectionOptions(collectionName) {
    const repo = await this.db.getRepository<any>('collections');
    if (repo) {
      const collection = await repo.database.getCollection(collectionName);
      const existCollection = await repo.findOne({ filter: { name: collectionName } });
      const options = collection.options;
      const fields = [];
      for (const [name, field] of collection.fields) {
        fields.push({
          name,
          ...field.options,
        });
      }
      if (existCollection) {
        const fieldRepo = await this.db.getRepository<any>('fields');
        const fieldList = await fieldRepo.find({ filter: { collectionName: collectionName } });
        fields.forEach(async (field)=>{
          const temp = fieldList.filter(({name})=>{return name == field.name});
          if(temp.length == 0){
           await fieldRepo.create({
              values:{
                collectionName:collectionName,
                ...field,
                options:{
                  ...field
                }
              }
            });
          }
        })
        return;
      }
      await repo.create({
        values: {
          ...options,
          fields
        }
      })
    }
  }
  syncCollectionsOptions(collectionNames) {
    collectionNames.forEach(async (collectionName) => {
      await this.syncCollectionOptions(collectionName);
    });
  }
  async setACL() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.prj-manager`,
      actions: ['prj:*', 'prjsUsers:*', 'task:*'],
    });
    this.app.acl.allow('prj', 'list', 'loggedIn');
    this.app.acl.allow('task', 'list', 'loggedIn');
  }
  async addMigrations() {
    await this.db.addMigrations({
      namespace: 'prj-manager',
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this
      }
    });
  }

  async afterEnable() {

  }


  async afterDisable() { }

  async remove() { }
}

export default PrjManagerPlugin;
