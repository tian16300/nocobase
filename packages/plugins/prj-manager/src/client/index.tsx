import { Plugin } from '@nocobase/client';
import { DataSelectProvider } from './provider/index';

export class PrjManagerPlugin extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addProviders();
  }
  addProviders() {
    this.app.addProvider(DataSelectProvider);
  }
  addRoutes() {}
}

export default PrjManagerPlugin;
