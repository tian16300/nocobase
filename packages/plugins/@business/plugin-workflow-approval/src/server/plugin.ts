import { InstallOptions, Plugin } from '@nocobase/server';
import WorkflowPlugin, { JOB_STATUS } from '@nocobase/plugin-workflow';

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
  
  }
  async load() {
    /* 导入审批相关的表 */
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('approval_apply');
      await repo.db2cm('approval_results');
    }

    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
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
