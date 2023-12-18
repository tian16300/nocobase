import { InstallOptions, Plugin } from '@nocobase/server';
import { DingTalkService } from './services/DingTalkService';
import path from 'path';
import attendceColumns from './utils/attendceColumns';
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
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    await this.db.addMigrations({
      namespace: this.name,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
        dingTalkService: this.dingTalkService,
      },
    });

    this.app.resourcer.registerActionHandler(
      'users:syncFromDingTalk',
      this.dingTalkService.syncUserListFromDingTalk.bind(this.dingTalkService),
    );
    this.app.resourcer.registerActionHandler(
      'notifications:sendMsgToUserByDing',
      this.dingTalkService.sendMsgToUserByDing.bind(this.dingTalkService),
    );
    this.app.resourcer.registerActionHandler(
      'systemSettings:getAccessToken',
      this.dingTalkService.getAccessToken.bind(this.dingTalkService),
    );
    /* 钉钉考勤表创建 */
    this.app.resourcer.registerActionHandler('systemSettings:addAttendCollection', this.addAttendCollection.bind(this));
  }
  async addAttendCollection(ctx, next) {
    /*  */
    const attendance = this.app.db.getCollection('attendance');
    const repo = this.app.db.getRepository('systemSettings');
    const sys = await repo.findOne({
      filterByTk: 1,
    });

    if (sys && sys.options && sys.options.appConfig) {
      if (!attendance) {
        const res: any = await this.dingTalkService.getAttenceColumnFromDing();
        if (res && res.data?.result) {
          /**
           * 获取考勤列
           */
          const visibleColumns = attendceColumns.filter(({ visible, alias }) => {
            const column = res.data.result.columns.find((col) => {
              return col.alias == alias;
            });
            return visible && column;
          });
          const columns = visibleColumns.map((field) => {
            const column = res.data.result.columns.find(({ alias }) => {
              return field.alias == alias;
            });
            return {
              name: field.name,
              type: field.type,
              interface: field.interface,
              uiSchema: field.uiSchema,
              dingColumn: column,
              dingColumnId: column.id,
            };
          });
          /* 其它列 用户 统计日期 */
          const fields: any = [
            {
              name: 'id',
              type: 'bigInt',
              interface: 'id',
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
              uiSchema: {
                type: 'number',
                title: '{{t("ID")}}',
                'x-component': 'InputNumber',
                'x-read-pretty': true,
              },
            },
            {
              name: 'dingUser_id',
              type: 'string',
              interface: 'input',
              isForeignKey: true,
              uiSchema: {
                type: 'string',
                title: 'dingUser_id',
                'x-component': 'Input',
                'x-read-pretty': true,
              },
            },
            {
              name: 'user',
              type: 'belongsTo',
              interface: 'obo',
              foreignKey: 'dingUser_id',
              onDelete: 'SET NULL',
              uiSchema: {
                'x-component': 'AssociationField',
                'x-component-props': {
                  multiple: false,
                  fieldNames: {
                    label: 'nickname',
                    value: 'dingUserId',
                  },
                },
                title: '用户',
              },
              target: 'users',
              targetKey: 'dingUserId',
            },
            {
              name: 'static_month',
              type: 'date',
              interface: 'datetime',
              collectionName: 'attendance',
              uiSchema: {
                'x-component-props': {
                  dateFormat: 'YYYY年MM月',
                  gmt: false,
                  showTime: false,
                  timeFormat: 'HH:mm:ss',
                },
                type: 'string',
                'x-component': 'DatePicker',
                title: '统计日期',
              },
            },
          ].concat(columns as any);
          const attendance = this.app.db.collection({
            name: 'attendance',
            title: '考勤统计',
            logging: true,
            fields,
          });
          await attendance.sync();
          const repo = this.db.getRepository<any>('collections');
          if (repo) {
            await repo.db2cm('attendance');
          }
          ctx.body = {
            success: true,
            message: '考勤表创建成功',
          };
        }
      } else {
        ctx.body = {
          success: false,
          message: '考勤表已存在',
        };
      }
    } else {
      ctx.body = {
        success: false,
        message: '缺少钉钉配置',
      };
    }
    await next();
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginEnterpriseIntegrationServer;
