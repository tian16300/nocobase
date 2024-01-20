import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class PluginCommonServer extends Plugin {
  afterAdd() {}

  beforeLoad() {
    this.db.addMigrations({
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
  }

  async load() {}

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginCommonServer;
