import Application from '@nocobase/server';
import { dayjs } from '@nocobase/utils';
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
  isInited = false;
  constructor(app, cache) {
    this.app = app;
    this.cache = cache;
  }
  async init(values) {
    this.appKey = values;
  }
  async getAccessToken(ctx?, next?) {
    if (ctx && ctx.action.params) {
      const token = await this.getAccessTokenByValues(ctx.action.params);
      ctx.body = token;
      await next();
    } else {
      const repo = this.app.db.getRepository('systemSettings');
      const sys = await repo.findOne({
        filterByTk: 1,
      });
      const token = await this.getAccessTokenByValues(sys.options?.appConfig);
      return token;
    }
  }
  async getAccessTokenByValues(values) {
    await this.init(values);
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
                  if (user && !user.dingUserId) {
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

    await Promise.all(promises);
    ctx.body = `同步成功，更新${updateCount}条`;
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
  /* 获取考勤列 */
  async getAttenceColumnFromDing() {
    const access_token = await this.getAccessToken();
    /* 获取考勤列 */
    const res = await axios.post(
      `https://oapi.dingtalk.com/topapi/attendance/getattcolumns?access_token=${access_token}`,
    );
    return res;
  }
  /* 获取考勤统计数据 */
  async syncAttendData(ctx, next) {
    const { start } = ctx.action.params;
    const from_date = dayjs(start).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const to_date = dayjs(start).endOf('month').format('YYYY-MM-DD 23:59:59');
    const access_token = await this.getAccessToken();
    const messages = [];

    const app = ctx.app;
    const userRep = app.db.getRepository('users');
    const users = await userRep.find({
      filter: {
        dingUserId: {
          $notEmpty: true,
        },
      },
    });
    const [details, detailsCount] = await app.db.getRepository('reportDetail').findAndCount({
      filter: {
        report: {
          userId: {
            $in: users.map((user) => user.id),
          },
          start: {
            $between: [from_date, to_date],
          },

        },
      },
      appends: ['report', 'report.status'],
    });
    const fields = await app.db.getRepository('fields').find({
      filter: {
        collectionName: 'attendance',
      },
    });
    const fieldsMap = new Map();
    const dingColumns = fields
      .filter((field) => {
        return field.options?.dingColumnId;
      })
      .map((field) => {
        const dingColumnId = field.options.dingColumnId;
        fieldsMap.set(dingColumnId, field);
        return dingColumnId;
      });
    const url = `https://oapi.dingtalk.com/topapi/attendance/getcolumnval?access_token=${access_token}`;
    const rows = [];
    await Promise.all(
      users.map(async (user) => {
        return axios
          .post(url, {
            userid: user.dingUserId,
            column_id_list: dingColumns.join(','),
            from_date,
            to_date,
          })
          .then((res) => {
            const { column_vals } = res.data.result;
            const reportTime = details
              .filter(({ report }) => {
                return report.userId == user.id;
              })
              .reduce((prev, { hours }) => prev + hours, 0);
            const reportBussinessTrip = details
              .filter(({ report, isBusinessTrip }) => {
                return report.userId == user.id   && isBusinessTrip;
              })
              .reduce((prev, { hours }) => prev + hours, 0);
            const row = {
              dingUser_id: user.dingUserId,
              static_month: from_date,
              reportDetails_time: reportTime,
              reportDetails_bussiness_time: reportBussinessTrip/8
            };

            column_vals.forEach(({ column_vo, column_vals }) => {
              const field = fieldsMap.get(column_vo.id);
              let value = column_vals.reduce((prev, { value }) => prev + Number(value).valueOf(), 0);
              if (field.options?.unit) {
                value = value / field.options.unit;
              }
              row[field.name] = value;
            });
            rows.push(row);
          });
      }),
    );
    /**
     * 数据组装
     */
    await app.db.getRepository('attendance').destroy({
      filter: {
        static_month: from_date,
        dingUser_id: {
          $in: users.map(({ dingUserId }) => {
            return dingUserId;
          }),
        },
      },
    });
    const res = await app.db.getRepository('attendance').createMany({
      records: rows,
    });

    ctx.body = res;
    await next();
  }
}
