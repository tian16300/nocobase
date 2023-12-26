import { Migration } from '@nocobase/server';

export default class AddEnabledFieldMigration extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<=0.12.0-alpha.4');
    if (!match) {
      return;
    }
    const Field = this.context.db.getRepository('fields');
    const existed = await Field.count({
      filter: {
        name: 'enabled',
        collectionName: 'users',
      },
    });
    if (!existed) {
      await Field.create({
        values: {
          collectionName: 'users',
          uiSchema: {
            'x-component': 'Switch',
            type: 'boolean',
            title: '启用',
          },
          name: 'enabled',
          type: 'boolean',
          interface: 'checkbox',
          defaultValue: true,
        },
        // NOTE: to trigger hook
        context: {},
      });
    }
  }

  async down() {}
}
