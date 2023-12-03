// This file is auto-generated, don't edit it
import Util from '@alicloud/tea-util';
import dingtalkoauth2_1_0, * as $dingtalkoauth2_1_0 from '@alicloud/dingtalk/oauth2_1_0';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import * as $tea from '@alicloud/tea-typescript';

export default class Client {
  /**
   * 使用 Token 初始化账号Client
   * @return Client
   * @throws Exception
   */
  static createClient(): dingtalkoauth2_1_0 {
    let config = new $OpenApi.Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    return new dingtalkoauth2_1_0(config);
  }

  static async main(args: string[]): Promise<void> {
    let client = Client.createClient();
    let getAccessTokenRequest = new $dingtalkoauth2_1_0.GetAccessTokenRequest({
      appKey: 'dingf40w2xcssiysmpbs',
      appSecret: 'iN5Gu3o_15c1KDpO4GGq9KPJJTQBE0ABwRdM_HSq2vB4vgcRqNgp',
    });
    try {
      return await client.getAccessToken(getAccessTokenRequest);
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        // err 中含有 code 和 message 属性，可帮助开发定位问题
      }
    }
    return null;
  }
}

Client.main(process.argv.slice(2));
