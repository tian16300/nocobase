import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class ReportManagerPlugin extends Plugin {
  afterAdd() { }

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
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    this.bindSync(['reportSetting', 'report', 'reportDetail', 'reportPlan', 'report_target']);
    
  }

  async load() {
    await this.importDb();
  }

  async install(options?: InstallOptions) {    
    await this.db2cmAsync();
    await this.setACL();
  }
  async importDb() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
  }
  async db2cmAsync() {
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('reportSetting');
      await repo.db2cm('report');
      await repo.db2cm('reportDetail');
      await repo.db2cm('reportPlan');
      await repo.db2cm('report_target');
    }
  }
  async setACL() {
    this.app.acl.allow('reportSetting', 'list', 'loggedIn');
    this.app.acl.allow('report', 'list', 'loggedIn');
    this.app.acl.allow('reportDetail', 'list', 'loggedIn');
    this.app.acl.allow('reportPlan', 'list', 'loggedIn'); 
    this.app.acl.allow('report_target', 'list', 'loggedIn');
  }

  async afterEnable() { }

  async afterDisable() { }

  async remove() { }
}

export default ReportManagerPlugin;
