import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import dicRecords from './dicRecords';
export class PluginPrjManagerServer extends Plugin {
  afterAdd() {}

  beforeLoad() {
    
  }
  bindSync(names) {
    names.forEach((name) => {
      this.app.db.on(`${name}.afterSync`, async (model, options) => {
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
          // const fields = [];
          // for (const [name, field] of collection.fields) {
          //   fields.push({
          //     name,
          //     ...field.options,
          //   });
          // }
          // const upRes = await repo.update({
          //   filter: {
          //     name: collectionName,
          //   },
          //   values: {
          //     fields,
          //     from: 'db2cm',
          //   },
          // });
        }
      });
    });
  }
  aclAllowList(names, condition) {
    names.forEach((name) => {
      this.app.acl.allow(name, 'list', condition);
    });
  }
  async load() {
    this.bindSync([
      'prj',
      'prj_plan',
      'prj_stages_files',
      'prjs_files',
      'prjs_users',
      'reportSetting',
      'report',
      'reportDetail',
      'reportPlan',
      'report_target',
      'task',
      'task_hour',
    ]);
    //增加字典数据
    await this.addRecords();

    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/prj'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/report'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/task'),
    });
    this.aclAllowList(
      [
        'prj',
        'prj_plan',
        'reportSetting',
        'report',
        'reportDetail',
        'reportPlan',
        'report_target',
        'task',
        'task_hour',
      ],
      'loggedIn',
    );
    this.aclAllowList(['prj_stages_files', 'prjs_files', 'prjs_users'], 'public');
    //依赖 dic 及 dicItem 表
    
    

  }
  async addRecords(){
    dicRecords.forEach(async (record) => {
      const { code } = record;
      const rep = this.app.db.getRepository('dic');
      let result = await rep.findOne({
        filter: {
          code: code,
        },
      });
      if (!result) {
        await rep.create({
          values: record,
        });
      }
    });

  }

  async install(options?: InstallOptions) {
    
 

  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginPrjManagerServer;
