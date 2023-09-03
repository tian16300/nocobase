import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class ReportManagerPlugin extends Plugin {
  afterAdd() { }

  beforeLoad() { }

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
    }
  }
  async setACL() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.report-manager`,
      actions: ['reportSetting:*', 'report:*', 'reportDetail:*', 'reportPlan:*'],
    });
    this.app.acl.allow('reportSetting', 'list', 'loggedIn');
    this.app.acl.allow('report', 'list', 'loggedIn');
    this.app.acl.allow('reportDetail', 'list', 'loggedIn');
    this.app.acl.allow('reportPlan', 'list', 'loggedIn');
  }

  async afterEnable() { }

  async afterDisable() { }

  async remove() { }
}

export default ReportManagerPlugin;
