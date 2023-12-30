import path from 'path';

import LRUCache from 'lru-cache';

import { Op } from '@nocobase/database';
import { Plugin } from '@nocobase/server';
import { Registry } from '@nocobase/utils';

import { Logger, LoggerOptions } from '@nocobase/logger';
import Processor from './Processor';
import initActions from './actions';
import { EXECUTION_STATUS } from './constants';
import initFunctions, { CustomFunction } from './functions';
import Trigger from './triggers';
import CollectionTrigger from './triggers/CollectionTrigger';
import ScheduleTrigger from './triggers/ScheduleTrigger';
import { Instruction, InstructionInterface } from './instructions';
import CalculationInstruction from './instructions/CalculationInstruction';
import ConditionInstruction from './instructions/ConditionInstruction';
import CreateInstruction from './instructions/CreateInstruction';
import DestroyInstruction from './instructions/DestroyInstruction';
import QueryInstruction from './instructions/QueryInstruction';
import UpdateInstruction from './instructions/UpdateInstruction';

import type { ExecutionModel, JobModel, WorkflowModel } from './types';

type ID = number | string;

type Pending = [ExecutionModel, JobModel?];

type CachedEvent = [WorkflowModel, any, { context?: any }];

export default class WorkflowPlugin extends Plugin {
  instructions: Registry<InstructionInterface> = new Registry();
  triggers: Registry<Trigger> = new Registry();
  functions: Registry<CustomFunction> = new Registry();

  private ready = false;
  private executing: Promise<void> | null = null;
  private pending: Pending[] = [];
  private events: CachedEvent[] = [];

  private loggerCache: LRUCache<string, Logger>;

  getLogger(workflowId: ID): Logger {
    const now = new Date();
    const date = `${now.getFullYear()}-${`0${now.getMonth() + 1}`.slice(-2)}-${`0${now.getDate()}`.slice(-2)}`;
    const key = `${date}-${workflowId}}`;
    if (this.loggerCache.has(key)) {
      return this.loggerCache.get(key);
    }

    const logger = this.createLogger({
      dirname: path.join('workflows', date),
      filename: `${workflowId}.log`,
      transports: [...(process.env.NODE_ENV !== 'production' ? ['console'] : ['file'])],
    } as LoggerOptions);

    this.loggerCache.set(key, logger);

    return logger;
  }

  onBeforeSave = async (instance: WorkflowModel, options) => {
    const Model = <typeof WorkflowModel>instance.constructor;

    if (instance.enabled) {
      instance.set('current', true);
    } else if (!instance.current) {
      const count = await Model.count({
        where: {
          key: instance.key,
        },
        transaction: options.transaction,
      });
      if (!count) {
        instance.set('current', true);
      }
    }

    if (!instance.changed('enabled') || !instance.enabled) {
      return;
    }

    const previous = await Model.findOne({
      where: {
        key: instance.key,
        current: true,
        id: {
          [Op.ne]: instance.id,
        },
      },
      transaction: options.transaction,
    });

    if (previous) {
      // NOTE: set to `null` but not `false` will not violate the unique index
      await previous.update(
        { enabled: false, current: null },
        {
          transaction: options.transaction,
          hooks: false,
        },
      );

      this.toggle(previous, false);
    }
  };

  registerTrigger<T extends Trigger>(type: string, trigger: T | { new (p: Plugin): T }) {
    if (typeof trigger === 'function') {
      this.triggers.register(type, new trigger(this));
    } else if (trigger) {
      this.triggers.register(type, trigger);
    } else {
      throw new Error('invalid trigger type to register');
    }
  }

  registerInstruction(type: string, instruction: InstructionInterface | { new (p: Plugin): InstructionInterface }) {
    if (typeof instruction === 'function') {
      this.instructions.register(type, new instruction(this));
    } else if (instruction) {
      this.instructions.register(type, instruction);
    } else {
      throw new Error('invalid instruction type to register');
    }
  }

  private initTriggers<T extends Trigger>(more: { [key: string]: T | { new (p: Plugin): T } } = {}) {
    this.registerTrigger('collection', CollectionTrigger);
    this.registerTrigger('schedule', ScheduleTrigger);

    for (const [name, trigger] of Object.entries(more)) {
      this.registerTrigger(name, trigger);
    }
  }

  private initInstructions<T extends Instruction>(more: { [key: string]: T | { new (p: Plugin): T } } = {}) {
    this.registerInstruction('calculation', CalculationInstruction);
    this.registerInstruction('condition', ConditionInstruction);
    this.registerInstruction('create', CreateInstruction);
    this.registerInstruction('destroy', DestroyInstruction);
    this.registerInstruction('query', QueryInstruction);
    this.registerInstruction('update', UpdateInstruction);

    for (const [name, instruction] of Object.entries({ ...more })) {
      this.registerInstruction(name, instruction);
    }
  }

  async load() {
    const { db, options } = this;

    initActions(this);
    this.initTriggers(options.triggers);
    this.initInstructions(options.instructions);
    initFunctions(this, options.functions);

    this.loggerCache = new LRUCache({
      max: 20,
      updateAgeOnGet: true,
      dispose(logger) {
        (<Logger>logger).end();
      },
    });

    this.app.acl.registerSnippet({
      name: `pm.${this.name}.workflows`,
      actions: [
        'workflows:*',
        'workflows.nodes:*',
        'executions:list',
        'executions:get',
        'flow_nodes:update',
        'flow_nodes:destroy',
      ],
    });

    this.app.acl.registerSnippet({
      name: 'ui.*',
      actions: ['workflows:list'],
    });

    this.app.acl.allow('approval_apply', ['list', 'get', 'submit'], 'loggedIn');
    this.app.acl.allow('approval_results', ['list', 'get'], 'loggedIn');
    this.app.acl.allow('workflows', ['trigger'], 'loggedIn');

    await db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

    this.db.addMigrations({
      namespace: this.name,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });

    db.on('workflows.beforeSave', this.onBeforeSave);
    db.on('workflows.afterSave', (model: WorkflowModel) => this.toggle(model));
    db.on('workflows.afterDestroy', (model: WorkflowModel) => this.toggle(model, false));

    // [Life Cycle]:
    //   * load all workflows in db
    //   * add all hooks for enabled workflows
    //   * add hooks for create/update[enabled]/delete workflow to add/remove specific hooks
    this.app.on('beforeStart', async () => {
      const collection = db.getCollection('workflows');
      const workflows = await collection.repository.find({
        filter: { enabled: true },
      });

      workflows.forEach((workflow: WorkflowModel) => {
        this.toggle(workflow);
      });
    });

    this.app.on('afterStart', () => {
      this.app.setMaintainingMessage('check for not started executions');
      this.ready = true;
      // check for not started executions
      this.dispatch();
    });

    this.app.on('beforeStop', async () => {
      const collection = db.getCollection('workflows');
      const workflows = await collection.repository.find({
        filter: { enabled: true },
      });

      workflows.forEach((workflow: WorkflowModel) => {
        this.toggle(workflow, false);
      });

      this.ready = false;
      if (this.events.length) {
        await this.prepare();
      }
      if (this.executing) {
        await this.executing;
      }
    });
  }

  toggle(workflow: WorkflowModel, enable?: boolean) {
    const type = workflow.get('type');
    const trigger = this.triggers.get(type);
    if (!trigger) {
      this.getLogger(workflow.id).error(`trigger type ${workflow.type} of workflow ${workflow.id} is not implemented`);
      return;
    }
    if (typeof enable !== 'undefined' ? enable : workflow.get('enabled')) {
      // NOTE: remove previous listener if config updated
      const prev = workflow.previous();
      if (prev.config) {
        trigger.off({ ...workflow.get(), ...prev });
      }
      trigger.on(workflow);
    } else {
      trigger.off(workflow);
    }
  }

  public trigger(workflow: WorkflowModel, context: object, options: { context?: any } = {}): void {
    const logger = this.getLogger(workflow.id);
    if (!this.ready) {
      logger.warn(`app is not ready, event of workflow ${workflow.id} will be ignored`);
      logger.debug(`ignored event data:`, { data: context });
      return;
    }
    // `null` means not to trigger
    if (context == null) {
      logger.warn(`workflow ${workflow.id} event data context is null, event will be ignored`);
      return;
    }

    this.events.push([workflow, context, options]);

    logger.info(`new event triggered, now events: ${this.events.length}`);
    logger.debug(`event data:`, {
      data: context,
    });

    if (this.events.length > 1) {
      return;
    }

    // NOTE: no await for quick return
    setTimeout(this.prepare);
  }

  public async resume(job) {
    if (!job.execution) {
      job.execution = await job.getExecution();
    }
    this.getLogger(job.execution.workflowId).info(
      `execution (${job.execution.id}) resuming from job (${job.id}) added to pending list`,
    );
    this.pending.push([job.execution, job]);
    this.dispatch();
  }

  public createProcessor(execution: ExecutionModel, options = {}): Processor {
    return new Processor(execution, { ...options, plugin: this });
  }

  private async createExecution(event: CachedEvent): Promise<ExecutionModel | null> {
    const [workflow, context, options] = event;

    if (options.context?.executionId) {
      // NOTE: no transaction here for read-uncommitted execution
      const existed = await workflow.countExecutions({
        where: {
          id: options.context.executionId,
        },
      });

      if (existed) {
        this.getLogger(workflow.id).warn(
          `workflow ${workflow.id} has already been triggered in same execution (${options.context.executionId}), and newly triggering will be skipped.`,
        );

        return null;
      }
    }

    const execution = await this.db.sequelize.transaction(async (transaction) => {
      const execution = await workflow.createExecution(
        {
          context,
          key: workflow.key,
          status: EXECUTION_STATUS.QUEUEING,
        },
        { transaction },
      );

      await workflow.increment(['executed', 'allExecuted'], { transaction });
      // NOTE: https://sequelize.org/api/v6/class/src/model.js~model#instance-method-increment
      if (this.db.options.dialect !== 'postgres') {
        await workflow.reload({ transaction });
      }

      await (<typeof WorkflowModel>workflow.constructor).update(
        {
          allExecuted: workflow.allExecuted,
        },
        {
          where: {
            key: workflow.key,
          },
          transaction,
        },
      );

      execution.workflow = workflow;

      return execution;
    });

    this.getLogger(workflow.id).info(`execution of workflow ${workflow.id} created as ${execution.id}`);

    // NOTE: cache first execution for most cases
    if (!this.executing && !this.pending.length) {
      this.pending.push([execution]);
    }

    return execution;
  }

  private prepare = async () => {
    const event = this.events.shift();
    if (!event) {
      this.getLogger('dispatcher').warn(`events queue is empty, no need to prepare`);
      return;
    }

    const logger = this.getLogger(event[0].id);
    logger.info(`preparing execution for event`);

    try {
      await this.createExecution(event);
    } catch (err) {
      logger.error(`failed to create execution: ${err.message}`, err);
      // this.events.push(event); // NOTE: retry will cause infinite loop
    }

    if (this.events.length) {
      await this.prepare();
    } else {
      this.dispatch();
    }
  };

  private dispatch() {
    if (!this.ready) {
      this.getLogger('dispatcher').warn(`app is not ready, new dispatching will be ignored`);
      return;
    }

    if (this.executing) {
      this.getLogger('dispatcher').warn(`workflow executing is not finished, new dispatching will be ignored`);
      return;
    }

    this.executing = (async () => {
      let next: Pending | null = null;
      // resuming has high priority
      if (this.pending.length) {
        next = this.pending.shift() as Pending;
        this.getLogger(next[0].workflowId).info(`pending execution (${next[0].id}) ready to process`);
      } else {
        const execution = (await this.db.getRepository('executions').findOne({
          filter: {
            status: EXECUTION_STATUS.QUEUEING,
            'workflow.enabled': true,
            'workflow.id': {
              [Op.not]: null,
            },
          },
          appends: ['workflow'],
          sort: 'createdAt',
        })) as ExecutionModel;
        if (execution) {
          this.getLogger(execution.workflowId).info(`execution (${execution.id}) fetched from db`);
          next = [execution];
        }
      }
      if (next) {
        await this.process(...next);
      }

      this.executing = null;

      if (next) {
        this.dispatch();
      }
    })();
  }

  private async process(execution: ExecutionModel, job?: JobModel) {
    if (execution.status === EXECUTION_STATUS.QUEUEING) {
      await execution.update({ status: EXECUTION_STATUS.STARTED });
    }

    const processor = this.createProcessor(execution);

    this.getLogger(execution.workflowId).info(`execution (${execution.id}) ${job ? 'resuming' : 'starting'}...`);
    await (job ? processor.resume(job) : processor.start());
    this.getLogger(execution.workflowId).info(
      `execution (${execution.id}) finished with status: ${execution.status}`,
    );
    if (execution.status && execution.workflow.options?.deleteExecutionOnStatus?.includes(execution.status)) {
      await execution.destroy();
    }
    try {
    
    } catch (err) {
      this.getLogger(execution.workflowId).error(`execution (${execution.id}) error: ${err.message}`, err);
    }
  }
}
