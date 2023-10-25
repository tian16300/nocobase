import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import dicRecords from './dicRecords';
import { generatePlan, saveLatest } from './actions/plan';
import { namespace } from '../preset';
import { hoursCount } from './actions/hours';
import { groupBy } from 'lodash';
import { dayjs, moment2str } from '@nocobase/utils';
// import { ReportDetailModel, ReportModel } from './model';
import { NETWORKDAYS } from '@formulajs/formulajs';
export class PluginPrjManagerServer extends Plugin {
  timer = null;
  activeReceiveExpires = 86400 * 7;
  afterAdd() {}
  beforeLoad() {
    this.db.addMigrations({
      namespace: namespace,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    // this.app.db.registerModels({
    //   ReportModel,
    //   ReportDetailModel,
    // });
    this.app.db.on(`dicItem.afterSync`, async (model, options) => {
      const dic = this.app.db.getCollection('dic')?.existsInDb();
      const dicItem = this.app.db.getCollection('dicItem')?.existsInDb();
      if (dic && dicItem) await this.addRecords();
    });

    /* 更新 周报保存数据后 更新项目活跃 */
    this.app.db.on('report.afterSaveWithAssociations', async (report, options) => {
      // debugger;
      // await report.updateReportDetail();
      // await this.updateReportDetail(report);
      /* 保存周报后 更新数据 */
      await this.checkPrjActive(report, options);
    });
    //保存之前 项目更新
    // this.app.db.on('reportDetail.beforeSave', async (model, options)=>{
    //    //更新任务
    //   //  if(model.)
    // });

    this.app.db.on('reportDetail.afterSave', async (model, options) => {
      const { dataValues } = model;
      if (!dataValues.reportId) {
        const rep = this.app.db.getRepository('reportDetail');
        await rep.destroy({
          filter: {
            id: dataValues.id,
          },
        });
        this.app.db.logger.info(`删除本周完成 ${model.id}`);
      }
    });
    this.app.db.on('report.afterSaveWithAssociations', async (model, options) => {
      const weekContent = model.get('weekContent');
      weekContent.forEach(async ({ id, belongsPrjKey, taskId }) => {
        if (taskId && !belongsPrjKey) {
          const record = await this.app.db.getRepository('task').findOne({
            filterByTk: taskId,
          });
          this.app.logger.info('周报任务及项目联动', record.prjId);
          await this.app.db.getRepository('reportDetail').update({
            filterByTk: id,
            values: {
              belongsPrjKey: record.prjId,
            },
          });
        }
      });
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
    /* 计算项目计划开始时间 计划结束时间 */
    this.app.db.on('prj_plan_latest.afterSave', async (model) => {
      /* */
      const { prjId } = model;
      if (prjId) {
        const { plans } = await this.app.db.getRepository<any>('prj').findOne({
          filter: {
            id: prjId,
          },
          appends: ['plans'],
        });
        const dates = [],
          days = [],
          ends = [];
        plans.forEach(({ start, end }) => {
          const s = start ? dayjs(start) : null;
          const e = end ? dayjs(end) : null;
          if (s && s.isValid()) {
            dates.push(s);
          }
          if (e && e.isValid()) {
            dates.push(e);
          }
        });
        const start = dates.length ? dayjs.min(dates) : null;
        const end = dates.length ? dayjs.max(dates) : null;
        const values = {
          start: start ? moment2str(start, {}) : null,
          end: end ? moment2str(end, {}) : null,
        };
        if (start || end) {
          await this.app.db.getRepository<any>('prj').update({
            filterByTk: prjId,
            values,
          });
          this.app.logger.info('更新项目计划开始时间及计划结束时间', values);
        }
      }
       /*计算计划工期及实际工期*/
       await this.countDays('prj_plan_latest', model, 'start', 'end', 'plan_days');
       await this.countDays('prj_plan_latest', model, 'real_start', 'real_end', 'real_days');

    });
    this.app.db.on('prj.afterSave', async (model) => {
      /*计算计划工期及实际工期*/
      await this.countDays('prj', model, 'start', 'end', 'plan_days');
      await this.countDays('prj', model, 'real_start', 'real_end', 'real_days');
    });
    this.app.db.on('task.afterSave', async (model) => {
      /*计算计划工期及实际工期*/
      await this.countDays('task', model, 'start', 'end', 'plan_days');
      await this.countDays('task', model, 'real_start', 'real_end', 'real_days');
    });

    /*定时任务 剩1天截止 */
  }
  async countDays(collectionName, model, startName, endName, name) {
    const start = model.get(startName);
    const end = model.get(endName);
    const curValue = model.get(name);
    let days = null;
    if (start && end) {
      days = NETWORKDAYS(start, end, []);
    }
    if (curValue !== days) {
      await this.app.db.getRepository(collectionName).update({
        filter:{
          id: model.get('id')
        },
        values: {
          [name]: days
        },
      });
    }
  }
  updateReportDetail(report) {
    // debugger;
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
      directory: path.resolve(__dirname, './collections/basic'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/prj'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/report'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/task'),
    });

    //注册actions
    this.app.resourcer.registerActionHandlers({
      'prj:generatePlan': generatePlan,
      'prj:hoursCount': hoursCount,
      'prj:savePlanLatest': saveLatest,
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
        'prj_plan_task_time',
        'risk_basic',
      ],
      'loggedIn',
    );
    this.aclAllowList(['risk_basic', 'prj_stages_files', 'prjs_files', 'prjs_users', 'tasks_dependencies'], 'public');
    this.app.acl.allow('prj', 'hoursCount', 'loggedIn');
    this.app.acl.allow('prj', 'generatePlan', 'loggedIn');
    this.app.acl.allow('prj', 'savePlanLatest', 'loggedIn');

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
          id: belongsPrjKey,
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
