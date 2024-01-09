import { Migration } from '@nocobase/server';

export default class extends Migration {
  async up() {
    const match = await this.app.version.satisfies('<0.17.0-alpha.4');
    if (!match) {
      return;
    }
    const { db } = this.context;

    const PluginModel = db.getModel('applicationPlugins');
    await db.sequelize.transaction(async (transaction) => {
      await [
        '@business/plugin-produce-manager',
      ].reduce(
        (promise, packageName) =>
          promise.then(async () => {
            const existed = await PluginModel.findOne({ where: { packageName }, transaction });
            if (!existed) {
              await PluginModel.create(
                {
                  name: packageName,
                  packageName,
                  version: '0.17.0-alpha.1',
                  enabled: true,
                  installed: true,
                  builtin: true,
                },
                { transaction },
              );
            }
          }),
        Promise.resolve(),
      );
    });
  }
}
