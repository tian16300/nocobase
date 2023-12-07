import Application from '@nocobase/server';
const axios = require('axios');

export class DingTalkService {
  app: Application;
  cache: any;
  appKey: {
    appKey: string;
    appSecret: string;
    agentId: string;
    robotCode: string;
  };
  isInited: boolean = false;
  constructor(app, cache) {
    this.app = app;
    this.cache = cache;
  }
  async init() {
    const repo = this.app.db.getRepository('app_key_mgr');
    const appKeyModel = await repo.findOne({
      filter: {
        appType: 'dingTalk',
      },
    });
    this.appKey = appKeyModel;
  }
  async getAccessToken() {
    await this.init();
    let token = await this.getTokenFromCache();
    if (!token) {
      token = await this.getNewToken();
      await this.storeTokenToCache(token);
    }

    return token;
  }

  getTokenFromCache() {
    return new Promise(async (resolve, reject) => {
      const token = await this.cache.get('dingtalk_access_token');
      if (token) {
        return resolve(token);
      } else {
        return resolve(null);
      }
    });
  }

  async getNewToken() {
    /**
     * 获取钉钉的access_token
     */
    const appKeyModel = this.appKey;
    if (!appKeyModel) {
      throw new Error('请先配置钉钉的appkey和appsecret');
    } else {
      const { appKey, appSecret } = appKeyModel;

      const response = await axios.get('https://oapi.dingtalk.com/gettoken', {
        params: {
          appkey: appKey,
          appsecret: appSecret,
        },
      });
      return response.data.access_token;
    }
  }

  async storeTokenToCache(token) {
    const res = await this.cache.set('dingtalk_access_token', token, 7200);
    return res;
  }
  /**
   * 同步员工列表
   */
  async syncUserListFromDingTalk(ctx, next) {
    const accessToken = await this.getAccessToken();
    //先获取管理员列表
    const metaUrl = `https://oapi.dingtalk.com/topapi/v2/department/listsub?access_token=${accessToken}`;
    const deptListRes = await axios.post(metaUrl);
    let addCount = 0;
    let updateCount = 0;
    const promises = [];
    //再获取部门员工
    if (deptListRes.data.errcode === 0) {
      deptListRes.data.result.map(({ dept_id }) => {
        promises.push(
          axios
            .get('https://oapi.dingtalk.com/topapi/v2/user/list', {
              params: {
                access_token: accessToken,
                dept_id: dept_id,
                cursor: 0,
                size: 100,
              },
            })
            .then((response) => {
              /* 关联字段 工号 job_number */
              if (response.data.errcode === 0) {
                const { list } = response.data.result;
                const repo = this.app.db.getRepository('users');
                list.forEach(async (item) => {
                  const { userid, name, mobile, email, job_number } = item;
                  const filters = [];
                  if (job_number) {
                    filters.push({ job_number });
                  }
                  if (mobile) {
                    filters.push({ phone: mobile });
                  }
                  if (email) {
                    filters.push({ email: email });
                  }
                  if (name) {
                    filters.push({ nickname: name });
                  }

                  const user = await repo.findOne({
                    filter: {
                      $or: filters,
                    },
                  });
                  if (!user) {
                    ++addCount;
                    promises.push(
                      repo.create({
                        values: {
                          nickname: name,
                          phone: mobile,
                          job_number,
                          dingUserId: userid,
                        },
                      }),
                    );
                  } else if (!user.dingUserId) {
                    ++updateCount;
                    promises.push(
                      repo.update({
                        filterByTk: user.id,
                        values: {
                          dingUserId: userid,
                        },
                      }),
                    );
                  }
                });
              }
            }),
        );
      });
    }

    const results = await Promise.all(promises);
    ctx.body = `同步成功，新增${addCount}条，更新${updateCount}条`;
    await next();
  }
  /* 发送消息通知 */
  async sendMsgToUserByDing(ctx, next) {
    const { userIds, msg } = ctx.action.params;
    const accessToken = await this.getAccessToken();
    const url = `https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=${accessToken}`;
    const response = await axios.post(url, {
      agent_id: this.appKey.agentId,
      userid_list: userIds,
      msg,
    });
    /* 增加消息日志 */
    
    ctx.body = response.data;
    await next();
  }
}
