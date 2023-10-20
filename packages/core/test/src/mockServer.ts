import { Database, mockDatabase } from '@nocobase/database';
import Application, { AppSupervisor, ApplicationOptions, Gateway, PluginManager } from '@nocobase/server';
import jwt from 'jsonwebtoken';
import qs from 'qs';
import supertest, { SuperAgentTest } from 'supertest';

interface ActionParams {
  filterByTk?: any;
  fields?: string[];
  filter?: any;
  sort?: string[];
  page?: number;
  pageSize?: number;
  values?: any;
  /**
   * @deprecated
   */
  resourceName?: string;
  /**
   * @deprecated
   */
  resourceIndex?: string;
  /**
   * @deprecated
   */
  associatedName?: string;
  /**
   * @deprecated
   */
  associatedIndex?: string;

  [key: string]: any;
}

interface SortActionParams {
  resourceName?: string;
  resourceIndex?: any;
  associatedName?: string;
  associatedIndex?: any;
  sourceId?: any;
  targetId?: any;
  sortField?: string;
  method?: string;
  target?: any;
  sticky?: boolean;

  [key: string]: any;
}

interface Resource {
  get: (params?: ActionParams) => Promise<supertest.Response>;
  list: (params?: ActionParams) => Promise<supertest.Response>;
  create: (params?: ActionParams) => Promise<supertest.Response>;
  update: (params?: ActionParams) => Promise<supertest.Response>;
  destroy: (params?: ActionParams) => Promise<supertest.Response>;
  sort: (params?: SortActionParams) => Promise<supertest.Response>;

  [name: string]: (params?: ActionParams) => Promise<supertest.Response>;
}

export class MockServer extends Application {
  async loadAndInstall(options: any = {}) {
    await this.load({ method: 'install' });

    if (options.afterLoad) {
      await options.afterLoad(this);
    }

    await this.install({
      ...options,
      sync: {
        force: false,
        alter: {
          drop: false,
        },
      },
    });
  }

  async cleanDb() {
    await this.db.clean({ drop: true });
  }

  protected createDatabase(options: ApplicationOptions) {
    const oldDatabase = this._db;

    const databaseOptions = oldDatabase ? oldDatabase.options : <any>options?.database || {};
    const database = mockDatabase(databaseOptions);
    database.setLogger(this._logger);
    database.setContext({ app: this });

    return database;
  }

  async destroy(options: any = {}): Promise<void> {
    await super.destroy(options);

    Gateway.getInstance().destroy();
    await AppSupervisor.getInstance().destroy();
  }

  agent(): SuperAgentTest & {
    login: (user: any) => SuperAgentTest;
    loginUsingId: (userId: number) => SuperAgentTest;
    resource: (name: string, resourceOf?: any) => Resource;
  } {
    const agent = supertest.agent(this.callback());
    const prefix = this.resourcer.options.prefix;
    const proxy = new Proxy(agent, {
      get(target, method: string, receiver) {
        if (['login', 'loginUsingId'].includes(method)) {
          return (userOrId: any) => {
            return proxy
              .auth(
                jwt.sign(
                  {
                    userId: typeof userOrId === 'number' ? userOrId : userOrId?.id,
                  },
                  process.env.APP_KEY,
                  {
                    expiresIn: '1d',
                  },
                ),
                { type: 'bearer' },
              )
              .set('X-Authenticator', 'basic');
          };
        }
        if (method === 'resource') {
          return (name: string, resourceOf?: any) => {
            const keys = name.split('.');
            const proxy = new Proxy(
              {},
              {
                get(target, method: string, receiver) {
                  return (params: ActionParams = {}) => {
                    let { filterByTk } = params;
                    const { values = {}, file, ...restParams } = params;
                    if (params.associatedIndex) {
                      resourceOf = params.associatedIndex;
                    }
                    if (params.resourceIndex) {
                      filterByTk = params.resourceIndex;
                    }
                    let url = prefix || '';
                    if (keys.length > 1) {
                      url += `/${keys[0]}/${resourceOf}/${keys[1]}`;
                    } else {
                      url += `/${name}`;
                    }
                    url += `:${method as string}`;
                    if (filterByTk) {
                      url += `/${filterByTk}`;
                    }

                    const queryString = qs.stringify(restParams, { arrayFormat: 'brackets' });

                    let request;

                    switch (method) {
                      case 'list':
                      case 'get':
                        request = agent.get(`${url}?${queryString}`);
                        break;
                      default:
                        request = agent.post(`${url}?${queryString}`);
                        break;
                    }

                    return file ? request.attach('file', file).field(values) : request.send(values);
                  };
                },
              },
            );
            return proxy;
          };
        }
        return agent[method];
      },
    });
    return proxy as any;
  }
}

export function mockServer(options: ApplicationOptions = {}) {
  if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
  }

  if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = require('util').TextDecoder;
  }

  Gateway.getInstance().reset();
  AppSupervisor.getInstance().reset();

  // @ts-ignore
  if (!PluginManager.findPackagePatched) {
    PluginManager.getPackageJson = () => {
      return {
        version: '0.0.0',
      };
    };

    // @ts-ignore
    PluginManager.findPackagePatched = true;
  }

  const app = new MockServer({
    acl: false,
    ...options,
  });

  return app;
}

export function createMockServer() {}

export default mockServer;
