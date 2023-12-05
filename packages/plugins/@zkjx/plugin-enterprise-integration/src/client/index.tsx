import { Plugin } from '@nocobase/client';
import { syncUsersFromDingTalk } from './scopes/syncUsersFromDingTalk';

export class PluginEnterpriseIntegrationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    this.app.addScopes({syncUsersFromDingTalk});
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginEnterpriseIntegrationClient;
