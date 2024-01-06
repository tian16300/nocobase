import { Migration } from '@nocobase/server';

export default class extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<0.17.0-alpha.4');
    if (!match) {
      return;
    }
    const { db } = this.context;
    db.getRepository('uiSchemas').update({
      filter: {
        schema: {
          $includes: '"gridInitializer":"PrjRecordBlockInitializers"',
        },
        name: {
          $includes: 'tabs_',
        },
      },
      values: {
        schema: {
          _isJSONSchemaObject: true,
          version: '2.0',
          type: 'void',
          'x-component': 'Tabs',
          'x-component-props': {
            useProps: '{{ usePrjTabsProps }}',
          },
          'x-initializer': 'TabPaneInitializers',
          'x-initializer-props': {
            gridInitializer: 'PrjRecordBlockInitializers',
            gridInitializerProps: {
              isBulkEdit: true,
            },
          },
        },
      },
    });
  }
}
