import { Migration } from '@nocobase/server';

export default class UpdatePlansFieldTarget extends Migration {
  async up() {
    const repo = this.context.db.getRepository('fields');
    if (repo) {
      this.db.logger.info(
        '更新项目计划指定表',
        await repo.update({
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
        }),
      );
      const item = await repo.findOne({
        filter: {
          collectionName: 'prj',
          name: 'plan_version',
        },
      });
      if (!item)
        await repo.create({
          values: {
            foreignKey: 'prjId',
            onDelete: 'CASCADE',
            name: 'plan_version',
            type: 'hasMany',
            collectionName: 'prj',
            uiSchema: {
              'x-component': 'AssociationField',
              'x-component-props': {
                multiple: true,
                fieldNames: {
                  label: 'id',
                  value: 'id',
                },
              },
              title: '项目计划版本列表',
            },
            interface: 'o2m',
            target: 'prj_plan_version'
          },
        });
    }
  }
  async down() {}
}
