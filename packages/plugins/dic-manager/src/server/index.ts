import path from 'path';

import { InstallOptions, Plugin } from '@nocobase/server';
import { records } from './db';
export class DicManagerPlugin extends Plugin {
  afterAdd() {
  }
  beforeLoad() {
    this.db.addMigrations({
      namespace: this.name,
      directory: path.resolve(__dirname, './migrations'),
      context: {
        plugin: this,
      },
    });
  }
  async load() {
    /* 创建表 */
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async install(options: InstallOptions) {
    await this.db2cmAsync();
    await this.setACL();
    await this.initRecords();   
  }
  async db2cmAsync(){
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.destroy({
        filter:{
          name: {
            $in:['dic','dicItem']
          }
        }
      })
      await repo.db2cm('dic');
      await repo.db2cm('dicItem');
    }
  }
  async setACL(){
    this.app.acl.allow('dic', 'get', 'public');
    this.app.acl.allow('dicItem', 'get', 'public');
  }
  async initRecords() {
    const dept = this.db.getRepository('dic');
    await dept.createMany({
      records: [
        ...records
      ]
    })
  }
}

export default DicManagerPlugin;
