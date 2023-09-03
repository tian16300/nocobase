import path from 'path';

import { InstallOptions, Plugin } from '@nocobase/server';
import { records } from './db';

// import DicField from './fields/DicField';

export class DicManagerPlugin extends Plugin {
  afterAdd() {
    // this.db.registerFieldTypes({
    //   dic: DicField,
    // });
  }
  beforeLoad() {
    // TODO
  }
  async load() {
    /* 创建表 */
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
   

    
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async install(options: InstallOptions) {
    // TODO
    // const repo = this.db.getRepository<any>('collections');
    // if (repo) {
    //   await repo.db2cm('dic');
    //   await repo.db2cm('dicItem');
    // }
    await this.db2cmAsync();
    await this.setACL();
    await this.initRecords();
   
  }
  async db2cmAsync(){
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('dic');
      await repo.db2cm('dicItem');
    }
  }
  async setACL(){
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.dic-manager`,
      actions: ['dic:*','dicItem:*'],
    });
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
