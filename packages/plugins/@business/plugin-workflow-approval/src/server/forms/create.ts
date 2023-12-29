import { Processor } from '@nocobase/plugin-workflow';
import ApprovalInstruction from '../ApprovalInstruction';

export default async function (this: ApprovalInstruction, instance, { collection }, processor: Processor) {
  const repo = this.plugin.db.getRepository(collection);
  if (!repo) {
    throw new Error(`collection ${collection} for create data on manual node not found`);
  }

  const { _, ...form } = instance.result;
  const [values] = Object.values(form);
  const model = await repo.create({
    values: {
      ...((values as { [key: string]: any }) ?? {}),
      // approvalUser_id:instance.currentUser.id,
      // approvalDate: new Date(),
      actionTime: new Date().toISOString(),
      user:instance.currentUser,
      apply_id:_.id,
      // executionId: processor.execution.id
    },
    context: {
      executionId: processor.execution.id,
    },
    // transaction: processor.transaction,
  });
  return model;
}
