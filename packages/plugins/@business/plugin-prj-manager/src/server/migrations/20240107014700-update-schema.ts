import { Migration } from '@nocobase/server';
export default class extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<0.17.0-alpha.4');
    if (!match) {
      return;
    }
    const { db } = this.context;
    const items = await db.getRepository('uiSchemas').find({
      filter: {
        'schema.x-initializer-props.gridInitializer': 'PrjRecordBlockInitializers',
      },
    });;
    await db.sequelize.transaction(async (transaction) => {
      for (const item of items) {
        const schema = item.schema;
        schema['x-component-props'] =  schema['x-component-props'] || {};
        schema['x-component-props'].useProps ='{{ usePrjTabsProps }}';
        item.set('schema', schema);
        await item.save({ transaction });
      }
    });
  }
}
