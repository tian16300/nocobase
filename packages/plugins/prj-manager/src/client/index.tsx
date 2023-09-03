import { Plugin } from '@nocobase/client';
import { DataSelectProvider, DataSelectFieldProvider } from './block';
export class PrjManagerPlugin extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addProviders();
    // this.addRoutes();
  }
  addProviders(){ 
    this.app.addProvider(DataSelectProvider);
    // this.app.addProvider(DataSelectFieldProvider);
  }
  addRoutes() {
    // this.app.router.add('hello', {
    //   path: '/hello',
    //   element: <HelloWorld />,
    // });
  }
}

export default PrjManagerPlugin;
