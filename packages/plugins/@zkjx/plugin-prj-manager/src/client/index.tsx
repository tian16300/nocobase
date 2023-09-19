import { Plugin } from '@nocobase/client';
import { DataSelectProvider } from './provider';

export class PluginPrjManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addProvider(DataSelectProvider);
  }
}

export default PluginPrjManagerClient;
