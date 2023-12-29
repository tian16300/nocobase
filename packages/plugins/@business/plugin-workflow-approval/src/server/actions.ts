import { Context, utils } from '@nocobase/actions';
import WorkflowPlugin, { EXECUTION_STATUS, JOB_STATUS } from '@nocobase/plugin-workflow';

import ApprovalInstruction from './ApprovalInstruction';

export async function submit(context: Context, next) {
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, values } = context.action.params;
  const { currentUser } = context.state;

  if (!currentUser) {
    return context.throw(401);
  }

  const plugin: WorkflowPlugin = context.app.pm.get('workflow') as WorkflowPlugin;
  const instruction = plugin.instructions.get('approval') as ApprovalInstruction;

  const userJob = await repository.findOne({
    filterByTk,
    // filter: {
    //   userId: currentUser?.id
    // },
    appends: ['job', 'node', 'execution','execution.workflow','applyUser','applyUser.directUser','currentApprovalUsers'],
    context,
  });

  if (!userJob) {
    return context.throw(404);
  }

  // const { forms = {} } = userJob.node.config;
  // const [formKey] = Object.keys(values.result ?? {}).filter((key) => key !== '_');
  const actionStatus = values.status;
  const [formKey] = Object.keys(values.result ?? {}).filter((key) => key !== '_');
  const actionKey = values.result?._;
  // const actionItem = forms[formKey]?.actions?.find((item) => item.key === actionKey);
  // NOTE: validate status
  
  if (
    userJob.job.status !== JOB_STATUS.PENDING ||
    userJob.execution.status !== EXECUTION_STATUS.STARTED ||
    !userJob.execution.workflow.enabled ||
    !actionStatus
  ) {
    return context.throw(400);
  }

  userJob.execution.workflow = userJob.workflow;
  const processor = plugin.createProcessor(userJob.execution);
  await processor.prepare();

  // NOTE: validate assignee
  /* 是否有审批权限 */
  const assignees = userJob.currentApprovalUsers.map((item) => item.id);
  if (!assignees.includes(currentUser.id)) {
    return context.throw(403);
  }
  // const presetValues = processor.getParsedValue(values ?? {}, userJob.nodeId, {
  //   // @deprecated
  //   currentUser: currentUser,
  //   // @deprecated
  //   currentRecord: values.result.form,
  //   // @deprecated
  //   currentTime: new Date(),
  //   $user: currentUser,
  //   $nForm: values.result.form,
  //   $nDate: {
  //     now: new Date(),
  //   },
  // });
  userJob.set({
    status: actionStatus,
    executionId: processor.execution.id
  });
  userJob.job.set({
    result:{
      ...userJob.job.result,
      currentUser: currentUser
    }
  })
  // userJob.job.set({
  //   status: jobStatus,
  //   result: jobStatus > JOB_STATUS.PENDING ? {} : Object.assign(userJob.result ?? {}, values.result),
  // });
  // const { forms = {} } = userJob.node.config;
  /**
   * {
   *   type:'create',
   *   collection:'approve_results',
   * }
   */
  const form = {
     type:'create',
     collection:'approval_results',

  };
  const handler = instruction.formTypes.get(form.type);
  let result = null;
  if (handler && userJob.status ) {
    result = await handler.call(instruction, {
      ...values,
      currentUser
    }, form, processor);
  }
  // const nodes = await context.app.db.getRepository('flow_nodes').find({
  //   filter: {
  //     workflowId: userJob?.workflowId,
  //     type: 'approval',
  //   }
  // });
  // const isLastApprovalNode = nodes[nodes.length - 1].id === userJob.nodeId;
  // /* 审批完成 */
  // if(result && isLastApprovalNode){
  //   userJob.set('jobIsEnd', true);
  // }

  // await userJob.job.save({ transaction: processor.transaction });
  await userJob.save({ transaction: (processor as any).transaction });

  await processor.exit();

  context.body = userJob;
  context.status = 202;

  await next();
  // userJob.job.status = jobStatus;
  userJob.job.execution = userJob.execution;
  userJob.job.latestUserJobResult = result;

  processor.logger.info(`manual node (${userJob.nodeId}) action trigger execution (${userJob.execution.id}) to resume`);
  plugin.resume(userJob.job);
}

/**
 *
 * @param context applyUser 申请人 nodeId 节点id
 * @param next
 */
export async function getNodeUsers(context: Context, next) {
  const { filterByTk, values } = context.action.params;
  const {  nodeId } = values;
  const apply = await context.app.db.getRepository('approval_apply').findOne({
    filterByTk: filterByTk,
    appends:['applyUser', 'applyUser.directUser']
  });
  const node = await context.app.db.getRepository('flow_nodes').findOne({
    filterByTk: nodeId,
  });
  const {rule,assignees,assigneeRoles} = node.config;
  const repository = context.app.db.getRepository('users');
  if (rule == '1') {
    context.body =  await repository.find({ 
      filter:{
          id:{
            $in:assignees
          }
      } });
  } else if (rule == '3') {
    const [users]  = await repository.findAndCount({ 
      filter:{
        dept:{
          id:{
            $in:assigneeRoles
          }
        }
      } });

      context.body = users;
  } else if (rule == '2') {
    context.body = [apply.applyUser.directUser];
  }
  context.status = 200;
  await next();
}
