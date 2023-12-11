import { Plugin } from '@nocobase/client';
import *  as scopes from './scopes';
import { IntergrationPluginSettingPage } from './page';

export class PluginEnterpriseIntegrationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addScopes(scopes);
    this.app.pluginSettingsManager.add('integration',{
      title: "第三方应用设置", // 原 title
      icon: "SettingOutlined", // 原 icon
      Component: IntergrationPluginSettingPage, // 原 tab component
    });
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginEnterpriseIntegrationClient;
