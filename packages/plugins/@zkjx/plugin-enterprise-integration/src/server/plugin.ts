import { InstallOptions, Plugin } from '@nocobase/server';
import { DingTalkService } from './services/DingTalkService';

export class PluginEnterpriseIntegrationServer extends Plugin {
  dingTalkService: DingTalkService;
  cache: any;
  afterAdd() {}

  beforeLoad() {}

  async load() {
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
