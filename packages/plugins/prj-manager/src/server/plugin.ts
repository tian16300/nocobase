import { InstallOptions, Plugin } from '@nocobase/server';
import { resolve } from 'path';

export class PrjManagerPlugin extends Plugin {
  afterAdd() {}

  bindSync(names) {
    names.forEach((name) => {
      this.db.on(`${name}.afterSync`, async (model, options) => {
        const collectionName = name;
        const collection = this.db.getCollection(collectionName);
        const repo = this.db.getRepository<any>('collections');
        const result = await repo.findOne({
          filter: {
            name: collectionName,
          },
        });
        if (!result) {
          await repo.db2cm(collectionName);
        } else {
          const fields = [];
          for (const [name, field] of collection.fields) {
            fields.push({
              name,
              ...field.options,
            });
          }
          const upRes = await repo.update({
            filter: {
              name: collectionName,
            },
            values: {
              fields,
              from: 'db2cm',
            },
          });
        }
      });
    });
  }

  beforeLoad() {
    this.db.addMigrations({
      namespace: this.name,
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    this.bindSync(['prj', 'prj_plan', 'prj_stages_files', 'prjs_files', 'prjs_users', 'task', 'task_hour']);
  }
  async load() {
    //导入库
    await this.importCollections(resolve(__dirname, 'collections'));
    //中间表
  }
  async install(options?: InstallOptions) {
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('prj_plan');
      await repo.db2cm('prj_stages_files');
      await repo.db2cm('prj');
      await repo.db2cm('prjs_files');
      await repo.db2cm('prjs_users');
      await repo.db2cm('task');
      await repo.db2cm('task_hour');
      this.app.acl.allow('prj_plan', 'list', 'loggedIn');
      this.app.acl.allow('prj_stages_files', 'list', 'public');
      this.app.acl.allow('prj', 'list', 'loggedIn');
      this.app.acl.allow('prjs_files', 'list', 'public');
      this.app.acl.allow('prjs_users', 'list', 'public');
      this.app.acl.allow('task', 'list', 'loggedIn');
      this.app.acl.allow('task_hour', 'list', 'loggedIn');
    }
  }
  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PrjManagerPlugin;
