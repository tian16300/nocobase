import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import { deptRecords } from './data';
import { ACL } from '@nocobase/acl';

export class CompanyInfoPlugin extends Plugin {
  afterAdd() { }
  beforeLoad() {

  }
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
  }
  async install(options?: InstallOptions) {
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.destroy({
        filter:{
          name: {
            $in:['dept']
          }
        }
      });
      await repo.db2cm('dept');
      await this.initRecords();
    }
    this.app.acl.allow('dept', 'list', 'public');
  }
  async initRecords() {
    const dept = this.db.getRepository('dept');
    await dept.createMany({
      records: [
        ...deptRecords
      ]
    })
  }
  async afterEnable() { 
    /* 增加角色定义 */
    // const acl = new ACL();


  }

  async afterDisable() { }

  async remove() {

  }
}

export default CompanyInfoPlugin;
