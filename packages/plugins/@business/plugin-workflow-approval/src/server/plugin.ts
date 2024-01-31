import { InstallOptions, Plugin } from '@nocobase/server';
import WorkflowPlugin, { EXECUTION_STATUS, JOB_STATUS } from '@nocobase/plugin-workflow';

import { getNodeUsers, submit } from './actions';

import ApprovalInstruction from './ApprovalInstruction';
import CopyToInstruction from './CopyToInstruction';
import path from 'path';
// import { namespace } from '../preset';
export default class extends Plugin {
  workflow: WorkflowPlugin;
  beforeLoad() {
    this.db.addMigrations({
      // namespace: namespace,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    /* 添加事件同步 */
    /* 审批申请  申请人 = 创建人 */
    /* 审批结果  审批人 = 创建人  */
    this.db.on('approval_apply.afterSaveWithAssociations', async (model, { transaction }) => {
      const relatedCollection = model.get('relatedCollection');
      const related_data_id = model.get('related_data_id');
      const repo = this.app.db.getRepository(relatedCollection);
      /**
       * 将申请人记录 添加到申请记录
       */
      await repo.update({
        filterByTk: related_data_id,
        values: {
          currentApproval_id: model.get('id'),
        },
        transaction,
      });
      // const {id, ...others} = model.dataValues;
      /**
       * 添加申请记录
       */
      //   if( ['0'].includes(model.get('status'))){
      //   await this.app.db.getRepository('approval_results').create({
      //     values:{
      //       userId: model.get('updatedBy') || model.get('createdBy'),
      //       userAction:'0',
      //       remark: model.get('remark'),
      //       files: model.dataValues?.files,
      //       actionTime: new Date().toISOString(),
      //       apply_id: model.get('id'),

      //     },
      //     transaction
      //   })
      // }
    });
    /**
     * 审批结果  同步更新 approval_apply
     */
    // this.db.on('approval_apply.afterSave', async (model, { transaction })=>{
    //    const id = model.get('id');
    //    const applyResult = await this.app.db.getRepository('approval_results').findOne({
    //       filter:{
    //         apply_id: id
    //       },
    //       sort:['id'],
    //       transaction
    //    });
    //    if(applyResult){
    //     await this.app.db.getRepository('approval_apply').update({
    //       filterByTk: id,
    //       values:{
    //         jobId: applyResult.get('jobId'),
    //         nodeId: applyResult.get('nodeId'),
    //         executionId: applyResult.get('executionId')
    //       },
    //       transaction
    //     })
    //    }
    // });
    /**
     * 审批状态 = 已撤销 终止流程
     */
    // this.db.on('approval_apply.afterUpdate', async (model, { transaction }) => {
    //   const changed = Array.from(model._changed);
    //   const status = model.get('status');
    //   if (changed.includes('status') && status == '5') {
    //     /* 终止job 流程  */
    //   }
    // });
    // this.db.on("execution.afterSave", async (model, { transaction }) => {
    //    if(model.get('isApproval') && model.get('current')){
    //       const execution = await this.app.db.getRepository('executions').findOne({
    //         filter:{
    //           workflowId: model.get('id')
    //         },
    //         sort:['-id'],
    //         transaction
    //       });
    //       if(execution){
    //         const job = await this.app.db.getRepository('jobs').findOne({
    //           filter:{
    //             executionId: execution.get('id')
    //           },
    //           sort:['-id'],
    //           transaction
    //         });
    //         if(job){
    //           console.log(job);
    //         }

    //       }

    //    }
    // });
    /**
     * 撤销审批
     */
    this.db.on('approval_apply.afterSave', async (model, { transaction }) => {
      const changed = Array.from(model._changed);
      const status = model.get('status');
      const filterByTk = model.get('executionId');
      const ExecutionRepo = this.db.getRepository('executions');
      const updatedAt = model.get('updatedAt');
      const relatedCollection = model.get('relatedCollection');
      const related_data_id = model.get('related_data_id');
      //具体数据
      const dataModel = await this.db.getRepository(relatedCollection).findOne({
        filterByTk: related_data_id,
        appends: ['updatedBy']
      });
      //具体数据
      const execution = await ExecutionRepo.findOne({
        filterByTk,
        appends: ['jobs'],
      });
      if (execution && changed.includes('status')) {
        // 撤销申请
        if (status == '3') {
          /* 取消流程  */
          const JobRepo = this.db.getRepository('jobs');
          const res = await execution.update(
            {
              status: EXECUTION_STATUS.CANCELED,
            },
            { transaction },
          );
          const pendingJobs = execution.jobs.filter((job) => job.status === JOB_STATUS.PENDING);
          await JobRepo.update({
            values: {
              status: JOB_STATUS.CANCELED,
            },
            filter: {
              id: pendingJobs.map((job) => job.id),
            },
            individualHooks: false,
            transaction,
          });
          this.app.logger.info('cancel', res);
        }
        //存储 审批结果
        /**
         * 用户 申请人  申请、撤销申请
         * 审批人 通过、拒绝
         */
        if (['0', '1', '2', '3'].includes(status)) {
          const logModel: any = {
            apply_id: model.get('id'),
            executionId: execution.id,
          };
          logModel.userAction = status;
          if (['0', '3'].includes(status)) {
            logModel.userType = '1';
            logModel.remark = dataModel.get('remark');
          } else if (['1', '2'].includes(status)) {
            logModel.userType = '2';
            logModel.remark = model.get('remark');
          }
          logModel.user = dataModel.get('updatedBy');
          logModel.createdBy = dataModel.get('updatedBy');
          logModel.createdAt = updatedAt;
          logModel.actionTime = updatedAt;
          await this.app.db.getRepository('approval_results').create({
            values: logModel,
            updateAssociationValues:['user','createdBy'],
            transaction
          });
        }
      }
    });
  }
  async load() {
    /* 导入审批相关的表 */
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('approval_users_mid');
      await repo.db2cm('approval_apply');
      await repo.db2cm('approval_results');
    }
    this.app.acl.allow('approval_users_mid', '*', 'public');
    const workflowPlugin = this.app.pm.get(WorkflowPlugin) as WorkflowPlugin;
    this.workflow = workflowPlugin;
    workflowPlugin.registerInstruction('approval', ApprovalInstruction);
    workflowPlugin.registerInstruction('copyTo', CopyToInstruction);

    this.app.resourcer.registerActionHandler('approval_apply:submit', submit);
    this.app.resourcer.registerActionHandler('approval_apply:getNodeUsers', getNodeUsers);
  }
  async install(options?: InstallOptions): Promise<void> {
    const Storage = this.db.getCollection('storages');

    const exist = await Storage.repository.findOne({
      filter: {
        name: 'approval',
      },
    });
    if (!exist) {
      await Storage.repository.create({
        values: {
          title: '审批材料',
          name: 'approval',
          type: 'local',
          options: {
            documentRoot: 'storage/uploads',
          },
          path: 'approval',
          baseUrl: '/storage/uploads',
          default: false,
          paranoid: true,
        },
      });
    }
  }
}
