import { Migration } from '@nocobase/server';

export default class extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<0.17.0-alpha.4');
    if (!match) {
      return;
    }
    const { db } = this.context;

    const PluginModel = db.getRepository('applicationPlugins');
    const existed = await PluginModel.findOne({ where: { packageName: '@nocobase/plugin-workflow-approval' } });
    if (existed) {
      await PluginModel.destroy(
        {
          filterByTk: existed.id
        }
      );
    }
  }
}
