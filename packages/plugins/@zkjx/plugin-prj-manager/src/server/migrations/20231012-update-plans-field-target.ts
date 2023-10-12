import { Migration } from '@nocobase/server';

export default class UpdatePlansFieldTarget extends Migration {
  async up() {
    const repo = this.context.db.getRepository('fields');
    if (repo) {
      this.db.logger.info('更新项目计划指定表',await repo.update({
        filter: {
          $or: [
            {
              collectionName: 'task',
              name: 'prjStage',
            },
            {
              collectionName: 'prj',
              name: 'plans',
            },
          ],
        },
        values: {
          target: 'prj_plan_latest',
        },
      }));
    }
  }
  async down() {}
}
