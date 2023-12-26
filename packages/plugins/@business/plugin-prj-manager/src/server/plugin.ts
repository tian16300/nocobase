import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import dicRecords from './dicRecords';
import { generatePlan, saveLatest } from './actions/plan';
import { namespace } from '../preset';
import { hoursCount } from './actions/hours';
import 'dayjs/plugin/minMax';
import { dayjs, moment2str } from '@nocobase/utils';
// import { ReportDetailModel, ReportModel } from './model';
import * as functions from '@formulajs/formulajs';
import { getHoliday } from './actions/getHoliday';
const getWorkDays = (start, end, holidays) => {
  return functions['NETWORKDAYS'](start, end, holidays);
};
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

    this.app.db.on('reportDetail.afterSave', async (model, options) => {
      if (model._changed.has('reportId')) {
        if (!model.get('reportId')) {
          const rep = this.app.db.getRepository('reportDetail');
          await rep.destroy({
            filter: {
              id: model.get('id'),
            },
            transaction: options.transaction,
          });
          this.app.db.logger.info(`删除本周完成 ${model.id}`);
        }
      }
      if (model._changed.has('taskId')) {
        /* 保存任务的项目id */
        if (model.get('taskId')) {
          const record = await this.app.db.getRepository('task').findOne({
            filterByTk: model.get('taskId'),
          });
          await this.app.db.getRepository('reportDetail').update({
            filterByTk: model.get('id'),
            values: {
              belongsPrjKey: record.prjId,
            },
            transaction: options.transaction,
          });
        } else {
          await this.app.db.getRepository('reportDetail').update({
            filterByTk: model.get('id'),
            values: {
              belongsPrj: null,
            },
            transaction: options.transaction,
          });
        }
      }
      if (model._changed.has('belongsPrjKey')) {
        /* 更新 项目活跃*/
        const belongsPrjKey = model.get('belongsPrjKey') || model._previousDataValues?.belongsPrjKey;
        if (belongsPrjKey) {
          const count = await this.app.db.getRepository('reportDetail').count({
            filter: {
              belongsPrjKey: belongsPrjKey,
            },
            transaction: options.transaction,
          });
          await this.app.db.getRepository('prj').update({
            filter: {
              id: belongsPrjKey,
            },
            values: {
              activeIndex: count,
            },
            transaction: options.transaction,
          });
        }
      }
    });

    /* 删除项目历史版本时 移除项目计划历史版本 */
    this.app.db.on('prj_plan_version.afterDestroy', async (model, options) => {
      const prjId = model.get('prjId');
      const version = model.get('version');
      const reb = this.app.db.getRepository<any>('prj_plan_history');
      await reb.destroy({
        filter: {
          prjId: prjId,
          version: version,
        },
        transaction: options.transaction,
      });
    });
    /* 计算项目计划开始时间 计划结束时间 */
    this.app.db.on('prj_plan_latest.afterSave', async (model, options) => {
      /* */

      /*计算计划工期及实际工期*/
      await this.countDays('prj_plan_latest', model, options, 'start', 'end', 'plan_days');
      await this.countDays('prj_plan_latest', model, options, 'real_start', 'real_end', 'real_days');
      const { prjId } = model;
      if (prjId) {
        const { plans } = await this.app.db.getRepository<any>('prj').findOne({
          filter: {
            id: prjId,
          },
          appends: ['plans'],
          transaction: options.transaction,
        });
        const dates = [];
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
            transaction: options.transaction,
          });
          this.app.logger.info('更新项目计划开始时间及计划结束时间', values);
        }
      }
    });
    this.app.db.on('prj.afterSave', async (model, options) => {
      /*计算计划工期及实际工期*/
      await this.countDays('prj', model, options, 'start', 'end', 'plan_days');
      await this.countDays('prj', model, options, 'real_start', 'real_end', 'real_days');
    });
    this.app.db.on('task.afterSave', async (model, options) => {
      /*计算计划工期及实际工期*/
      await this.countDays('task', model, options, 'start', 'end', 'plan_days');
      await this.countDays('task', model, options, 'real_start', 'real_end', 'real_days');
    });
    this.app.db.on('holidays.afterSave', async (model, options) => {
      /*同步节假日安排*/
      const repo = this.app.db.getRepository('holidays');
      const { year: date } = model;
      const year = dayjs(date).year();
      const json = await getHoliday(year);
      if(json){
        const res = await repo.update({
          filterByTk: model.get('id'),
          values: {
            holidayConfig: json
          },
          transaction: options.transaction
        });
        this.app.logger.info(`同步${year}年节假日成功`, res);
      }     
    });
  }
  async countDays(collectionName, model, options, startName, endName, name) {
    if (model._changed.has(startName) || model._changed.has(endName) || model._changed.has(name)) {
      const start = model.get(startName);
      const end = model.get(endName);
      const curValue = model.get(name);
      let days = null;
      if (start && end) {
        const holidaysRes = await this.app.db.getRepository('holidays').find({
          filter:{
            year:{
              $dateBetween:[start,end]
            }
          },
          transaction: options.transaction
        });
        let keys = [];
        holidaysRes.map(({holidayConfig})=>{
          keys = keys.concat(Object.keys(holidayConfig));
        });
        const holidays = Array.from(new Set(keys));
        days = getWorkDays(start, end, holidays);
      }
      if (curValue !== days) {
        await this.app.db.getRepository(collectionName).update({
          filter: {
            id: model.get('id'),
          },
          values: {
            [name]: days,
          },
          transaction: options.transaction,
        });
      }
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
      directory: path.resolve(__dirname, './collections/through'),
    });
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections/inherits'),
    });
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
      ],
      'loggedIn',
    );
    this.aclAllowList(['prj_stages_files', 'prjs_files', 'prjs_users', 'tasks_dependencies', 'reportUsers'], 'public');
    this.app.acl.allow('prj', 'hoursCount', 'loggedIn');
    this.app.acl.allow('prj', 'generatePlan', 'loggedIn');
    this.app.acl.allow('prj', 'savePlanLatest', 'loggedIn');
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

  async install(options?: InstallOptions) {
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('prj_plan_task_time');
      await repo.db2cm('prj_stages_files');
      await repo.db2cm('prjs_files');
      await repo.db2cm('prjs_users');
      await repo.db2cm('tasks_dependencies');
      await repo.db2cm('reportSetting');
      await repo.db2cm('prj');
      await repo.db2cm('prj_plan');
      await repo.db2cm('report');
      await repo.db2cm('reportPlan');
      await repo.db2cm('reportDetail');
      await repo.db2cm('report_target');
      await repo.db2cm('prj_plan_version');
      await repo.db2cm('prj_plan_latest');
      await repo.db2cm('prj_plan_history');
      await repo.db2cm('task');
    }
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginPrjManagerServer;
