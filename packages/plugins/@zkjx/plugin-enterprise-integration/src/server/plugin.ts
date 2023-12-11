import { InstallOptions, Plugin } from '@nocobase/server';
import { DingTalkService } from './services/DingTalkService';
import path from 'path';
export class PluginEnterpriseIntegrationServer extends Plugin {
  dingTalkService: DingTalkService;
  cache: any;
  afterAdd() {}

  beforeLoad() {}

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    await this.db.addMigrations({
      namespace: this.name,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    this.cache = await this.app.cacheManager.createCache({
      name: 'integration',
      prefix: 'integration',
      store: 'memory',
    });
    this.dingTalkService = new DingTalkService(this.app, this.cache);
    this.app.resourcer.registerActionHandler('users:syncFromDingTalk', this.dingTalkService.syncUserListFromDingTalk.bind(this.dingTalkService));
    this.app.resourcer.registerActionHandler('notifications:sendMsgToUserByDing', this.dingTalkService.sendMsgToUserByDing.bind(this.dingTalkService));
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginEnterpriseIntegrationServer;
