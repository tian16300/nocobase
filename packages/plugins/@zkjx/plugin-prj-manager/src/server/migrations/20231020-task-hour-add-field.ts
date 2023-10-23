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
      /* 任务工时指向本周完成 */
      await repo.update({
        filter: {
          collectionName: 'task',
          name: 'task_hour',
        },
        values: {
          target: 'reportDetail',
        },
      });
      //移除 prj prj_plan  task
      // await repo.destroy({
      //   filter: {
      //     collectionName: {
      //       $in: ['prj', 'prj_plan', 'task'],
      //     },
      //     name: {
      //       $in: ['start', 'end', 'real_start', 'real_end'],
      //     },
      //   },
      // });
    }
    /* 更新 项目 prj prj_plan task 继承表 */
    const collections = this.context.db.getRepository('collections');
    if (collections) {
      /* 同步表 */
      await this.bindSync(['prj_plan_task_time','risk_basic']);
      await collections.update({
        filter: {
          name: {
            $in: ['prj', 'prj_plan', 'task'],
          },
        },
        values: {
          inherits: ['prj_plan_task_time'],
        },
      });
      /* 增加表的字段 */
      const a = this.app.db.getCollection('prj_plan_task_time');
      const b = this.app.db.getCollection('prj');
      const c = this.app.db.getCollection('prj_plan');
      const d = this.app.db.getCollection('task');
      a.forEachField((field) => {
        if(!b.hasField(field.name)){
          b.addField(field.name, field.options);
        }
        if(!c.hasField(field.name)){
          c.addField(field.name, field.options);
        }
        if(!d.hasField(field.name)){
          d.addField(field.name, field.options);
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
