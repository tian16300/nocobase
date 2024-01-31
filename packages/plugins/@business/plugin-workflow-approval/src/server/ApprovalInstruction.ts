import WorkflowPlugin, { Processor, JOB_STATUS, Instruction, ExecutionModel } from '@nocobase/plugin-workflow';
import axios from 'axios';
import initFormTypes, { FormHandler } from './forms';
import { Registry, dayjs } from '@nocobase/utils';
export async function request(config) {
  // default headers
  const { url, method = 'POST', data, timeout = 5000 } = config;
  const headers = (config.headers ?? []).reduce((result, header) => {
    if (header.name.toLowerCase() === 'content-type') {
      return result;
    }
    return Object.assign(result, { [header.name]: header.value });
  }, {});
  const params = (config.params ?? []).reduce(
    (result, param) => Object.assign(result, { [param.name]: param.value }),
    {},
  );

  // TODO(feat): only support JSON type for now, should support others in future
  headers['Content-Type'] = 'application/json';

  return axios.request({
    url,
    method,
    headers,
    params,
    data,
    timeout,
  });
}
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
    ruleType: 'depts' | 'roles' | 'users' | string;
    depts?: number[];
    roles?: number[];
    users?: number[];
  };
  copyToRule?: {
    ruleType: 'depts' | 'roles' | 'users' | string;
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
 * 功能逻辑  查找 审批人, 新增或保存审批表单 审批记录
 */
export default class extends Instruction {
  formTypes = new Registry<FormHandler>();
  updateJobValues = new Map();
  constructor(public workflow: WorkflowPlugin) {
    super(workflow);
    initFormTypes(this);
  }

  async run(node, prevJob, processor: Processor) {
    /**
     * 查找人
     */
    // const transaction = (processor as any).transaction;
    const workflowModel = await processor.execution.getWorkflow();
    const approvalModel = processor.getParsedValue(`{{$context.data}}`, node.id);
    const currentUser = prevJob.result?.currentUser || approvalModel.applyUser;
    // const currentUser = prevJob.result?.currentUser || prevJob.result?.data?.applyUser;

    const users = await processor.getUsersByRule(node.config, node.id, currentUser);
    const { relatedCollection, related_data_id } = approvalModel;
    // 获取关联数据
    // const relatedModel = processor.options.plugin.app.db.getRepository(relatedCollection);
    // const relatedData = await relatedModel.findOne({
    //   filterByTk: related_data_id,
    //   transaction,
    // });

    const statusField = this.workflow.app.db.getCollection('approval_apply').getField('status');
    const statusText = statusField.options.uiSchema.enum.find(({ value }) => {
      return value == approvalModel.status;
    }).label;
    const dingUsers = users.filter(({ dingUserId }) => {
      return dingUserId && dingUserId !== '';
    });
    let message = null;
    const text = `${approvalModel.applyUser.nickname}发起了${workflowModel.title}申请${
      !approvalModel.isNewRecord ? statusText : ''
    },请到我的审批查看。`;
    /* 发送消息 */
    if (dingUsers.length) {
      const data = {
        userIds: dingUsers
          .map(({ dingUserId }) => {
            return dingUserId;
          })
          .join(','),
        msg: {
          msgtype: 'text',
          text: text,
        },
      };

      const dingTalkService = (this.workflow.app.pm.get('@domain/plugin-enterprise-integration') as any)
        .dingTalkService;
      message = await dingTalkService.sendMsgToUserByDingAction(data);
    }

    /**
     * 创建审批记录 approve_results
     */
    const job = await processor.saveJob({
      status: JOB_STATUS.PENDING,
      result: {
        data:{
          ...approvalModel
        },
        type: 'approval',
        relatedData:{
          relatedCollection,
          related_data_id
        },
        users: users.map(({id, nickname, dingUserId})=>{
          return {
            id,
            nickname,
            dingUserId
          }
        }),
        // dingUsers,
        message:{
          text,
          result: message
        },
        currentUser
      },
      nodeId: node.id,
      upstreamId: prevJob?.id ?? null,
    });
    const registry = this.workflow.app.db.getRepository('approval_apply');
    await registry.update({
      filterByTk: approvalModel.id,
      updateAssociationValues:['currentApprovalUsers'],
      values: {
        jobId: job.id,
        nodeId: node.id,
        executionId: job.executionId,
        workflowKey: workflowModel.key,
        currentApprovalUsers: users,
        // result: relatedData,
      },
      // transaction,
    });
    return job;
  }

  /**
   * TODO 设置当前审批状态
   * @param node
   * @param job
   * @param processor
   * @returns
   */
  async resume(node, job, processor: Processor) {
    /**
     * 当前节点是否通过
     */
    const nextNode = node.downstream;
    const isResolved = job.latestUserJobResult?.userAction == '1';
    const isRejected = job.latestUserJobResult?.userAction == '-5';

    job.set('result', {
      type: 'approval',
      ...job.result,
      approvalResult: job.latestUserJobResult,
    });
    /* 如果拒绝则 审批完成 */
    if (job.latestUserJobResult && isRejected) {
      await processor.options.plugin.app.db.getRepository('approval_apply').update({
        filterByTk: processor.execution.context.data.id,
        values: {
          jobIsEnd: true,
        },
      });
    }else if(isResolved && !nextNode){
      /* 如果是最后一个节点 则审批完成 */
      await processor.options.plugin.app.db.getRepository('approval_apply').update({
        filterByTk: processor.execution.context.data.id,
        values: {
          jobIsEnd: true
        }
      });
    }else{
      await processor.options.plugin.app.db.getRepository('approval_apply').update({
        filterByTk: processor.execution.context.data.id,
        values: {
          jobIsEnd: false
        }
      });
    }
    if (nextNode?.type == 'copyTo') {
      job.set('status', JOB_STATUS.RESOLVED);
    }else{
      job.set('status', Number(job.latestUserJobResult?.userAction).valueOf());
    }
    return job;
  }
}
