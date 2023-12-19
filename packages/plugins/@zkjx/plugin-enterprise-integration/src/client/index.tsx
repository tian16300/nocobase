import { Plugin, useCollection, useSchemaInitializer } from '@nocobase/client';
import * as scopes from './scopes';
import { IntergrationPluginSettingPage } from './page';
import { SyncAttenceActionInitializer } from './components/SyncAttenceActionInitializer';

export class PluginEnterpriseIntegrationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addComponents({ SyncAttenceActionInitializer });
    this.app.addScopes(scopes);
    this.app.pluginSettingsManager.add('integration', {
      title: '第三方应用设置', // 原 title
      icon: 'SettingOutlined', // 原 icon
      Component: IntergrationPluginSettingPage, // 原 tab component
    });
    /**
     * 配置操作 增加初始化配置
     */
    this.schemaInitializerManager.addItem(
      'TableActionInitializers', // 示例，已存在的 schema initializer
      'enableActions.syncAttenceAction', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        title: '{{t("同步考勤")}}',
        useVisible() {
          const collection = useCollection();
          return collection?.name === 'attendance';
        },
        Component: 'SyncAttenceActionInitializer',
      },
    );

    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginEnterpriseIntegrationClient;
