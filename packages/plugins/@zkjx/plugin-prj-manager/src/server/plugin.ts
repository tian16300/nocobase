import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import dicRecords from './dicRecords';
import { generatePlan } from './actions/plan';
import { namespace } from '../preset';
import { hoursCount } from './actions/hours';
import { groupBy } from 'lodash';
export class PluginPrjManagerServer extends Plugin {
  timer = null;
  activeReceiveExpires = 86400 * 7;
  afterAdd() {}
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
    this.app.db.on('report.afterSaveWithAssociations', async (report, options) => {
      /* 保存周报后 更新数据 */
      await this.checkPrjActive(report, options);
    });
    /* 删除项目历史版本时 移除项目计划历史版本 */
    this.app.db.on('prj_plan_version.afterDestroy', async (model) => {
      const prjId = model.get('prjId');
      const version = model.get('version');
      const reb = this.app.db.getRepository<any>('prj_plan_history');
      await reb.destroy({
        filter: {
          prjId: prjId,
          version: version,
        },
      });
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
      'prj:hoursCount': hoursCount,
    });
    this.aclAllowList(
      [
        'prj',
        'prj_plan',
        'prj_plan_latest',
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

    // this.app.on('beforeStart', () => {
    //   // 每10分钟执行一次
    //   this.timer = setInterval(this.checkPrjActive, 1000 * 60 * 10);
    // });

    // this.app.on('beforeStop', () => {
    //   clearInterval(this.timer);
    //   this.timer = null;
    // });
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

  checkPrjActive = async (report, options) => {
    const weekReport = this.db.getRepository('reportDetail');
    const result: Array<{ belongsPrjKey: number }> = await weekReport.find({
      filter: {
        belongsPrjKey: {
          $notEmpty: true,
        },
      },
    });
    const groups = groupBy<{ belongsPrjKey: number }>(result, (model) => {
      return model.belongsPrjKey;
    });
    Object.keys(groups).map(async (belongsPrjKey: string) => {
      const prj = this.db.getRepository('prj');
       await prj.update({
        filter: {
          id: belongsPrjKey
        },
        values: {
          activeIndex: groups[belongsPrjKey].length,
        },
      });
      this.log.debug(`更新项目活跃 数据, ${belongsPrjKey}, ${groups[belongsPrjKey].length}`);
    });
  };
}

export default PluginPrjManagerServer;
