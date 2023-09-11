import { Plugin } from '@nocobase/client';
import { DataSelectProvider } from './provider/index';
import { registerLicense } from '@syncfusion/ej2-base';

export class PrjManagerPlugin extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    registerLicense('@31362e342e30b14Xv2RtRgS+It+2vH1XiAC6WGs4a/Y1IkBAOnWSmeY=');
    this.addProviders();
  }
  addProviders() {
    this.app.addProvider(DataSelectProvider);
  }
  addRoutes() {}
}

export default PrjManagerPlugin;
