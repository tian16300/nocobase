import { Migration } from '@nocobase/server';

export default class TaskAddFields extends Migration {
  async up() {
    const repo = this.context.db.getRepository('fields');
    if (repo) {
      const reportHoursField = await repo.findOne({
        filter: {
          collectionName: 'report',
          name: 'hours',
        },
      });
      if (!reportHoursField) {
        await repo.create({
          values: {
            collectionName: 'report',
            uiSchema: {
              'x-component-props': {
                step: '0.1',
                stringMode: true,
              },
              type: 'number',
              'x-component': 'InputNumber',
              title: '总工时(h)',
            },
            name: 'hours',
            type: 'double',
            interface: 'number',
          },
        });
      }
      let fieldData = await repo.findOne({
        filter: {
          collectionName: 'task',
          name: 'task_action',
        },
      });
      if (!fieldData) {
        const field = this.app.db.getCollection('task').getField('task_action');
        await repo.create({
          values: {
            collectionName: 'task',
            ...field.options,
          },
        });
      }
      fieldData = await repo.findOne({
        filter: {
          collectionName: 'task',
          name: 'score',
        },
      });
      if (!fieldData) {
        const field = this.app.db.getCollection('task').getField('score');
        await repo.create({
          values: {
            collectionName: 'task',
            ...field.options,
          },
        });
      }

      fieldData = await repo.findOne({
        filter: {
          collectionName: 'task',
          name: 'comments',
        },
      });
      if (!fieldData) {
        const field = this.app.db.getCollection('task').getField('comments');
        await repo.create({
          values: {
            collectionName: 'task',
            ...field.options,
          },
        });
      }

      /* 任务工时指向本周完成 */
      await repo.update({
        filter: {
          collectionName: 'task',
          name: 'task_hour',
        },
        values: {
          target: 'reportDetail',
          name: 'report_task_hour',
        },
      });
    }
    /* 更新 项目 prj prj_plan task 继承表 */
    const collections = this.context.db.getRepository('collections');
    if (collections) {
      /* 同步表 */
      await this.bindSync(['prj_plan_task_time']);
      await collections.update({
        filter: {
          name: {
            $in: ['prj', 'prj_plan', 'task'],
          },
        },
        values: {
          inherit: true,
          inherits: ['prj_plan_task_time'],
        },
      });
      /* 增加表的字段 */
      const a = this.app.db.getCollection('prj_plan_task_time');
      const b = this.app.db.getCollection('prj');
      const c = this.app.db.getCollection('prj_plan');
      const d = this.app.db.getCollection('task');
      const e = this.app.db.getCollection('prj_plan_history');
      const f = this.app.db.getCollection('prj_plan_latest');
      a.forEachField((field) => {
        if (!b.hasField(field.name)) {
          b.addField(field.name, field.options);
        }
        if (!c.hasField(field.name)) {
          c.addField(field.name, field.options);
        }
        if (!d.hasField(field.name)) {
          d.addField(field.name, field.options);
        }
        if (!e.hasField(field.name)) {
          e.addField(field.name, field.options);
        }
        if (!f.hasField(field.name)) {
          f.addField(field.name, field.options);
        }
      });

      /* 继承的表重写 */
      c.forEachField((field)=>{
        if (!e.hasField(field.name)) {
          e.addField(field.name, field.options);
        }
        if (!f.hasField(field.name)) {
          f.addField(field.name, field.options);
        }
      });
      
      await b.sync();
      await c.sync();
      await d.sync();
      await e.sync();
      await f.sync();
      /* 中间表隐藏 更新数据 */
      collections.update({
        filter: {
          name: {
            $in: [
             'prj_plan',
             'prj_stages_files', 
             'prjs_users',
             'prjs_files',
             'tasks_dependencies',
             'reportSettingsUsers'],
          },
        },
        values: {
          'hidden':true
        }
      });


    }
  }
  async bindSync(names) {
    names.forEach(async (name) => {
      const collectionName = name;
      const repo = this.db.getRepository<any>('collections');
      const result = await repo.findOne({
        filter: {
          name: collectionName,
        },
      });
      if (!result) {
        await repo.db2cm(collectionName);
      }
    });
  }
  async down() {}
}
