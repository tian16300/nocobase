import { Registry } from '@nocobase/utils';
import WorkflowPlugin, { Processor, JOB_STATUS, Instruction } from '@nocobase/plugin-workflow';

import initFormTypes, { FormHandler } from './forms';

type FormType = {
  type: 'custom' | 'create' | 'update';
  actions: number[];
  options: {
    [key: string]: any;
  };
};

export interface ManualConfig {
  schema: { [key: string]: any };
  forms: { [key: string]: FormType };
  assignees?: (number | string)[];
  assigneesRule?: {
    ruleType: 'depts'|'roles'|'users'| string;
    depts?: number[];
    roles?: number[];
    users?: number[];
  };
  copyToRule?: {
    ruleType: 'depts'|'roles'|'users'| string;
    depts?: number[];
    roles?: number[];
    users?: number[];
  };
  mode?: number;
}

const MULTIPLE_ASSIGNED_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  ALL_PERCENTAGE: Symbol('all percentage'),
  ANY_PERCENTAGE: Symbol('any percentage'),
};

const Modes = {
  [MULTIPLE_ASSIGNED_MODE.SINGLE]: {
    getStatus(distribution, assignees) {
      const done = distribution.find((item) => item.status !== JOB_STATUS.PENDING && item.count > 0);
      return done ? done.status : null;
    },
  },
  [MULTIPLE_ASSIGNED_MODE.ALL]: {
    getStatus(distribution, assignees) {
      const resolved = distribution.find((item) => item.status === JOB_STATUS.RESOLVED);
      if (resolved && resolved.count === assignees.length) {
        return JOB_STATUS.RESOLVED;
      }
      const rejected = distribution.find((item) => item.status < JOB_STATUS.PENDING);
      if (rejected && rejected.count) {
        return rejected.status;
      }

      return null;
    },
  },
  [MULTIPLE_ASSIGNED_MODE.ANY]: {
    getStatus(distribution, assignees) {
      const resolved = distribution.find((item) => item.status === JOB_STATUS.RESOLVED);
      if (resolved && resolved.count) {
        return JOB_STATUS.RESOLVED;
      }
      const rejectedCount = distribution.reduce(
        (count, item) => (item.status < JOB_STATUS.PENDING ? count + item.count : count),
        0,
      );
      // NOTE: all failures are considered as rejected for now
      if (rejectedCount === assignees.length) {
        return JOB_STATUS.REJECTED;
      }

      return null;
    },
  },
};

function getMode(mode) {
  switch (true) {
    case mode === 1:
      return Modes[MULTIPLE_ASSIGNED_MODE.ALL];
    case mode === -1:
      return Modes[MULTIPLE_ASSIGNED_MODE.ANY];
    case mode > 0:
      return Modes[MULTIPLE_ASSIGNED_MODE.ALL_PERCENTAGE];
    case mode < 0:
      return Modes[MULTIPLE_ASSIGNED_MODE.ANY_PERCENTAGE];
    default:
      return Modes[MULTIPLE_ASSIGNED_MODE.SINGLE];
  }
}
/**
 * 功能逻辑  查找 抄送人, 发送消息 对方 JOB 标记完成  下一步
 */
export default class extends Instruction {
  formTypes = new Registry<FormHandler>();

  constructor(public plugin: WorkflowPlugin) {
    super(plugin);

    initFormTypes(this);
  }

  async run(node, prevJob, processor: Processor) {
    const { mode, ...config } = node.config as ManualConfig;
    /**
     * 查找
     */
    const transaction = processor.transaction;
    const workflowModel = await processor.execution.getWorkflow();
    const isApproval = workflowModel.get('isApproval');
    const job = await processor.saveJob({
      status: JOB_STATUS.PENDING,
      result: mode ? [] : null,
      nodeId: node.id,
      upstreamId: prevJob?.id ?? null,
    });
    if (!isApproval) {
      const assignees = [...new Set(processor.getParsedValue(config.assignees, node.id) || [])];
      // NOTE: batch create users jobs
      const UserJobModel = processor.options.plugin.db.getModel('users_jobs');
      await UserJobModel.bulkCreate(
        assignees.map((userId) => ({
          userId,
          jobId: job.id,
          nodeId: node.id,
          executionId: job.executionId,
          workflowId: node.workflowId,
          status: JOB_STATUS.PENDING,
        })),
        {
          transaction: processor.transaction,
        },
      );

     
    }else{
      /**
       *  查找审批人，抄送人
       */
      const collectionName = workflowModel.get('bussinessCollectionName');
      const bussinessCode = processor.getParsedValue(`{{$context.data.${collectionName}_code}}`,node.id)
      const assignees = await processor.getUserIdsByRule(config.assigneesRule, node.id)||[];
      const copyto = await processor.getUserIdsByRule(config.copyToRule, node.id)||[];
      //创建审批记录
      /**
       * 查询审批汇总表有无记录 有则更新 无则创建
       * 添加审批记录
       */
      const ApprovalModel = processor.options.plugin.db.getRepository('approval');
      const ApprovalRecord = await ApprovalModel.findOne({
        filter:{
          bussinessCollectionName:workflowModel.get('bussinessCollectionName'),
          bussinessCode: bussinessCode
          /**
           * 业务编号
           */
          // bussinessCode:

        },
        transaction: processor.transaction,
      });
      const submitterId = processor.getScope(node.id).$context.data.updatedById || processor.getScope(node.id).$context.data.createdById;
      const submitDate = processor.getScope(node.id).$context.data.updatedAt || processor.getScope(node.id).$context.data.createdAt;
      if(!ApprovalRecord){
        ApprovalModel.create({
          values:{
            bussinessCollectionName: collectionName,
            type: collectionName,
            bussinessCode: bussinessCode,
            submitterId: submitterId,
            submitDate: submitDate,
            submit_status:'1',
            current_approval_users_id: assignees,
            approval_record:[{
              approval_users_id:assignees,
              approval_status:'1',
              current: true
            }]
          },
          transaction: processor.transaction
        });
      }




      //创建消息记录  
      // const assignees = [...new Set(processor.getParsedValue(config.assigneesRule.ruleType, node.id) || [])];
      console.log('assignees', assignees);
      console.log('assignees', copyto);


    }
    return job;
  }

  async resume(node, job, processor: Processor) {
    // NOTE: check all users jobs related if all done then continue as parallel
    const { assignees = [], mode } = node.config as ManualConfig;

    const UserJobModel = processor.options.plugin.db.getModel('users_jobs');
    const distribution = await UserJobModel.count({
      where: {
        jobId: job.id,
      },
      group: ['status'],
      transaction: processor.transaction,
    });

    const submitted = distribution.reduce(
      (count, item) => (item.status !== JOB_STATUS.PENDING ? count + item.count : count),
      0,
    );
    const status = job.status || (getMode(mode).getStatus(distribution, assignees) ?? JOB_STATUS.PENDING);
    const result = mode ? (submitted || 0) / assignees.length : job.latestUserJob?.result ?? job.result;
    processor.logger.debug(`manual resume job and next status: ${status}`);
    job.set({
      status,
      result,
    });

    return job;
  }
}
