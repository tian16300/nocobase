import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import dicRecords from './dicRecords';
import { generatePlan } from './actions/plan';
import { namespace } from '../preset';
import { hoursCount } from './actions/hours';
export class PluginPrjManagerServer extends Plugin {
  afterAdd() {

  }
  beforeLoad() {
    this.app.db.on(`dicItem.afterSync`, async (model, options) => {
      const dic = this.app.db.getCollection('dic')?.existsInDb();
      const dicItem = this.app.db.getCollection('dicItem')?.existsInDb();
      if (dic && dicItem) await this.addRecords();
    });
    this.bindSync([
      'prj',
      'prj_plan',
      'prj_plan_history',
      'prj_plan_version',
      'prj_stages_files',
      'prjs_files',
      'prjs_users',
      'reportSetting',
      'report',
      'reportDetail',
      'reportPlan',
      'report_target',
      'task',
      'tasks_dependencies',
      'task_hour',
    ]);
    /* 更新 周报保存数据后 更新项目活跃 */
    this.app.db.on('report.afterSaveWithAssociations',async ()=>{
      /* 保存周报后 更新数据 */
       await this.updatePrjActiveCount();

    });
  }
  bindSync(names) {
    names.forEach((name) => {
      this.app.db.on(`${name}.afterSync`, async (model, options) => {
        const collectionName = name;
        // const collection = this.db.getCollection(collectionName);
        const repo = this.db.getRepository<any>('collections');
        const result = await repo.findOne({
          filter: {
            name: collectionName,
          },
        });
        if (!result) {
          await repo.db2cm(collectionName);
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
    //增加字典数据
    // await this.addRecords();

    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/prj'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/report'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/task'),
    });
    this.db.addMigrations({
      namespace: namespace,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    //注册actions
    this.app.resourcer.registerActionHandlers({
      'prj:generatePlan': generatePlan,
      'prj:hoursCount':hoursCount
    });
    this.aclAllowList(
      [
        'prj',
        'prj_plan',
        'prj_plan_history',
        'prj_plan_version',
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
    this.aclAllowList(['prj_stages_files', 'prjs_files', 'prjs_users', 'tasks_dependencies'], 'public');
    this.app.acl.allow('prj', 'hoursCount', 'loggedIn');
  }
  async addRecords() {
    dicRecords.forEach(async (record) => {
      const { code } = record;
      const rep = this.app.db.getRepository('dic');
      const result = await rep.findOne({
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

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
  async updatePrjActiveCount(){
    console.log('更新项目活跃 数据');
  }
}

export default PluginPrjManagerServer;
