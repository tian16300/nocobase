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
  }
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('wl_category');
    }
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginProduceManagerServer;
