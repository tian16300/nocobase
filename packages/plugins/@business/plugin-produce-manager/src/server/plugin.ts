import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class PluginProduceManagerServer extends Plugin {
  afterAdd() {}

  beforeLoad() {
    this.db.addMigrations({
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    /* BOM物料明细 继承 BOM单  */
    this.app.db.on('bom.afterSaveWithAssociations', async (model, { transaction }) => {
      await this.db.getRepository('bom_wl').update({
        filter: {
          bom_id: model.get('id'),
        },
        values: {
          prj_code: model.get('prj_code')
        },
        transaction
      });
    });
  }
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('wl_category');
      await repo.db2cm('wl_info');
    }
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginProduceManagerServer;
