import { Migration } from '@nocobase/server';

export default class UpdateTaskFieldsMigration extends Migration {
  async up() {
    /**
     * 增加前置任务
     */
    const match = await this.app.version.satisfies('<=0.7.4-alpha.7');
    if (!match) {
      return;
    }
    const Field = this.context.db.getRepository('fields');
    const existed = await Field.count({
      filter: {
        name: 'dependencies',
        collectionName: 'task',
      },
    });
    if (!existed) {
      await Field.create({
        values: {
          foreignKey: 'taskDepId',
          collectionName: 'task',
          otherKey: 'taskId',
          name: 'dependencies',
          type: 'belongsToMany',
          through: 'tasks_dependencies',
          uiSchema: {
            'x-component': 'AssociationField',
            'x-component-props': {
              multiple: true,
              fieldNames: {
                label: 'id',
                value: 'id',
              },
            },
            title: '前置任务',
          },
          interface: 'm2m',
          target: 'task',
        },
      });
    }
  }
  async down() {}
}
