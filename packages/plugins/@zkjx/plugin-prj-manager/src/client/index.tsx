import { Plugin } from '@nocobase/client';
import { DataSelectBlockProvider, PrjPlanCompareBlockProvider } from './provider';

export class PluginPrjManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addProvider(DataSelectBlockProvider);
    this.app.addProvider(PrjPlanCompareBlockProvider);
  }
}

export default PluginPrjManagerClient;
