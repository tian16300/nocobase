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
    appends: ['job', 'node', 'execution', 'workflow', 'currentApprovalUsers'],
    context,
  });

  if (!userJob) {
    return context.throw(404);
  }

  // const { forms = {} } = userJob.node.config;
  // const [formKey] = Object.keys(values.result ?? {}).filter((key) => key !== '_');
  const actionStatus = values.result?.status;

  // const actionItem = forms[formKey]?.actions?.find((item) => item.key === actionKey);
  // NOTE: validate status
  if (
    userJob.job.status !== JOB_STATUS.PENDING ||
    userJob.execution.status !== EXECUTION_STATUS.STARTED ||
    !userJob.workflow.enabled ||
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
  // const presetValues = processor.getParsedValue(actionItem.values ?? {}, userJob.nodeId, {
  //   // @deprecated
  //   currentUser: currentUser,
  //   // @deprecated
  //   currentRecord: {},
  //   // @deprecated
  //   currentTime: new Date(),
  //   $user: currentUser,
  //   $nForm: {},
  //   $nDate: {
  //     now: new Date(),
  //   },
  // });

  userJob.set({
    status: actionStatus,
    result: actionStatus > JOB_STATUS.PENDING ? {} : Object.assign(userJob.result ?? {}, values.result),
  });

  // const handler = instruction.formTypes.get(forms[formKey].type);
  // if (handler && userJob.status) {
  //   await handler.call(instruction, userJob, forms[formKey], processor);
  // }

  // await userJob.save({ transaction: processor.transaction });

  // await processor.exit();

  context.body = userJob;
  context.status = 200;

  await next();

  // userJob.job.execution = userJob.execution;
  // userJob.job.latestUserJob = userJob;

  // NOTE: resume the process and no `await` for quick returning
  // processor.logger.info(
  //   `approval node (${userJob.nodeId}) action trigger execution (${userJob.execution.id}) to resume`,
  // );

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
