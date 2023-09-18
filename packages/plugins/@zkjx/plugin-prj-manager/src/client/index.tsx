import { Plugin } from '@nocobase/client';
import { DataSelectProvider } from './provider';

export class PluginPrjManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {
    
  }

  // You can get and modify the app instance here
  async load() {
    this.app.addProvider(DataSelectProvider);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginPrjManagerClient;
