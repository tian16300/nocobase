import { Migration } from '@nocobase/server';

export default class TaskAddFields extends Migration {
  async up() {
    const repo = this.context.db.getRepository('fields');
    if (repo) {
      // this.db.logger.info(
      //   '更新项目计划指定表',
      //   await repo.update({
      //     filter: {
      //       $or: [
      //         {
      //           collectionName: 'task',
      //           name: 'prjStage',
      //         },
      //         {
      //           collectionName: 'prj',
      //           name: 'plans',
      //         },
      //       ],
      //     },
      //     values: {
      //       target: 'prj_plan_latest',
      //     },
      //   }),
      // );
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
          target: 'reportDetail'   
        }
      })
    }
  }
  async down() {}
}
