import { Plugin } from '@nocobase/client';
import { providers }  from './provider/index';
export class PrjManagerPlugin extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addProviders();
  }
  addProviders(){ 
    // this.app.addProvider(DataSelectProvider);
    this.app.addProviders(providers);
  }
  addRoutes() {
  }
}

export default PrjManagerPlugin;
