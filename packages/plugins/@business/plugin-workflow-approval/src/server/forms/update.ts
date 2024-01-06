import { Processor } from '@nocobase/plugin-workflow';
import ApprovalInstruction from '../ApprovalInstruction';

export default async function (this: ApprovalInstruction, instance, { collection, filter = {} }, processor: Processor) {
  const repo = this.workflow.db.getRepository(collection);
  if (!repo) {
    throw new Error(`collection ${collection} for update data on manual node not found`);
  }

  const { _, ...form } = instance.result;
  const [values] = Object.values(form);
  await repo.update({
    filter: processor.getParsedValue(filter, instance.nodeId),
    values: {
      ...((values as { [key: string]: any }) ?? {}),
      updatedBy: instance.userId,
    },
    context: {
      executionId: processor.execution.id,
    },
    // transaction: processor.transaction,
  });
}
