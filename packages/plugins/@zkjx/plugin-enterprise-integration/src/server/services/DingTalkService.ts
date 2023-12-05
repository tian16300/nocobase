import Application from '@nocobase/server';
const axios = require('axios');

export class DingTalkService {
  app: Application;
  cache: any;
  appKey:{
    appKey: string;
    appSecret: string;
    agentId: string;
  };
  isInited: boolean = false;
  constructor (app, cache){
    this.app = app;
    this.cache = cache;
  }
  async init(){
    const repo = this.app.db.getRepository('app_key_mgr');
    const appKeyModel = await repo.findOne({
        filter: {
          apiType: 'DingTalkAPI',
        },
      });
    this.appKey = appKeyModel;
  }
  async getAccessToken() {
    if (!this.isInited) {
      await this.init();
      this.isInited = true;
    }
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
    const response = await axios.get('https://oapi.dingtalk.com/topapi/v2/user/list', {
      params: {
        access_token: accessToken,
        dept_id: 1,
        cursor: 0,
        size: 100
      },
    });
    /* 关联字段 工号 job_number */
    if(response.data.errcode === 0){
        const { list } = response.data.result;
        const repo = this.app.db.getRepository('users');
        let addCount = 0;
        let updateCount = 0;
        const promise = list.map( async  (item) => {
            const { userid, name, mobile, email, job_number } = item;
            const user = await repo.findOne({
                filter: {
                    $or:[{
                        job_number: job_number
                    },{
                        phone: mobile
                    }]
                   
                },
            });
            if(!user){
                ++addCount;
                return await repo.create({
                    values:{
                        nickname: name,
                        phone: mobile,
                        job_number,
                        dingUserId:userid
                    }
                });
            }else if(!user.dingUserId){
                ++updateCount;
               return await repo.update({
                    filterByTk: user.id,
                    values:{
                        dingUserId:userid,
                        phone: mobile,
                    }
                });
            }
        });
        const results = await Promise.all(promise);
        ctx.body = `同步成功，新增${addCount}条，更新${updateCount}条`;
        await next();


    }else{
      throw new Error(response.data.errmsg);
    }
  }
  /* 发送消息通知 */
  async sendMsgToUser({ isAll, userIds}, msg) {
    const accessToken = await this.getAccessToken();
    const response = await axios.post('https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2', {
      agent_id: this.appKey.agentId,
      userid_list: userIds,
      to_all_user: isAll,
      msg,
    }, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } 


}
