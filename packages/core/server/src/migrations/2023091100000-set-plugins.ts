import { Migration } from '@nocobase/server';

import { PluginManager } from '../plugin-manager';
export default class extends Migration {
  async up() {
    const collection = this.db.getCollection('applicationPlugins');
    if (!collection) {
      return;
    }
    const { db } = this.context;
    const repository = this.db.getRepository<any>('applicationPlugins');
    const oldPluginNames = [
      'company-info',
      'dic-manager',
      'prj-manager',
      '@zkjx/plugin-workflow-approval',
      '@zkjx/plugin-enterprise-integration',
    ];
    await repository.destroy({
      filter: {
        name: {
          $in: oldPluginNames
        },
      },
    });
    const PluginModel = db.getModel('applicationPlugins');

    await db.sequelize.transaction(async (transaction) => {
      await [        
        '@domain/plugin-common',
        '@domain/plugin-dic-manager',
        '@domain/plugin-enterprise-integration',
        '@business/plugin-common',  
        '@business/plugin-company-info',      
        '@business/plugin-prj-manager',
        '@business/plugin-workflow-approval',
      ].reduce(
        (promise, packageName) =>
          promise.then(async () => {
            const existed = await PluginModel.findOne({ where: { packageName }, transaction });
            if (!existed) {
              await PluginModel.create(
                {
                  name: packageName,
                  packageName,
                  version: '0.18.0-alpha.2',
                  enabled: true
                },
                { transaction },
              );
            }else {

            }
          }),
        Promise.resolve(),
      );
    });
  }
    // const midgrationRepo = this.db.getRepository<any>('migrations');

    // await midgrationRepo.destroy({
    //   filter: {
    //     name: {
    //       $like: oldPluginNames,
    //     },
    //   },
    // });

    // const PluginModel = db.getModel('applicationPlugins');

    // await db.sequelize.transaction(async (transaction) => {
    //   await [
    //     '@business/plugin-company-info',
    //     '@domain/plugin-dic-manager',
    //     '@business/plugin-prj-manager',
    //     '@business/plugin-workflow-approval',
    //     '@domain/plugin-enterprise-integration',
    //   ].reduce(
    //     (promise, packageName) =>
    //       promise.then(async () => {
    //         const existed = await PluginModel.findOne({ where: { packageName }, transaction });

    //         if (!existed) {
    //           await PluginModel.create(
    //             {
    //               name: packageName,
    //               packageName,
    //               version: '0.18.0-alpha.2',
    //               enabled: true,
    //               installed: true,
    //               builtin: true,
    //             },
    //             { transaction },
    //           );
    //         }
    //       }),
    //     Promise.resolve(),
    //   );
    // });
  // }
}
