import { Migration } from '../migration';
export default class extends Migration {
  async up() {
    const collection = this.db.getCollection('applicationPlugins');
    if (!collection) {
      return;
    } 
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
  }
}
