import WorkflowPlugin, { Processor, JOB_STATUS, Instruction } from '@nocobase/plugin-workflow';
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
 * 功能逻辑  查找 抄送人, 发送消息 对方 JOB 标记完成  下一步
 */
export default class extends Instruction {
  constructor(public plugin: WorkflowPlugin) {
    super(plugin);
  }

  async run(node, prevJob, processor: Processor) {
    /**
     * 查找人
     */
    const transaction = processor.transaction;
    const workflowModel = await processor.execution.getWorkflow();
    const users = await processor.getUsersByRule(node.config, node.id);
    const approvalModel = processor.getParsedValue(`{{$context.data}}`, node.id);
   
    const { relatedCollection, related_data_id } = approvalModel;
    // 获取关联数据
    const relatedModel = processor.options.plugin.app.db.getRepository(relatedCollection);
    const relatedData = await relatedModel.findOne({
      filterByTk: related_data_id,
      transaction,
    });
    const statusField =  processor.options.plugin.app.db.getCollection('approval_apply').getField('status');
    const statusText = statusField.options.uiSchema.enum.find(({value})=>{return value == approvalModel.status}).label;
    const data = {
      userIds: users
        .map(({ dingUserId }) => {
          return dingUserId;
        })
        .join(','),
      msg:{
        msgtype: 'text',
        text: {
          content: `${approvalModel.applyUser.nickname}发起了${workflowModel.title}申请${statusText},请知悉!`,
        },
      }
    };
    const dingTalkService = (processor.options.plugin.app.getPlugin('@zkjx/plugin-enterprise-integration') as any)
      .dingTalkService;
    const message = await dingTalkService.sendMsgToUserByDingAction(data);
    const job = await processor.saveJob({
      status: JOB_STATUS.RESOLVED,
      result: {
        users,
        relatedData,
        message,
      },
      nodeId: node.id,
      upstreamId: prevJob?.id ?? null,
    });
    return job;
  }

  async resume(node, job, processor: Processor) {
    // NOTE: check all users jobs related if all done then continue as parallel
    // const { assignees = [], mode } = node.config as ManualConfig;

    // const UserJobModel = processor.options.plugin.db.getModel('users_jobs');
    // const distribution = await UserJobModel.count({
    //   where: {
    //     jobId: job.id,
    //   },
    //   group: ['status'],
    //   transaction: processor.transaction,
    // });

    // const submitted = distribution.reduce(
    //   (count, item) => (item.status !== JOB_STATUS.PENDING ? count + item.count : count),
    //   0,
    // );
    // const status = job.status || (getMode(mode).getStatus(distribution, assignees) ?? JOB_STATUS.PENDING);
    // const result = mode ? (submitted || 0) / assignees.length : job.latestUserJob?.result ?? job.result;
    // processor.logger.debug(`manual resume job and next status: ${status}`);
    // job.set({
    //   status,
    //   result,
    // });

    return job;
  }
}
