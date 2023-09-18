import { Cache, createCache } from '@nocobase/cache';
import { lodash } from '@nocobase/utils';
import Application from '../application';
import { getResource } from './resource';

export class Locale {
  app: Application;
  cache: Cache;
  defaultLang = 'en-US';
  localeFn = new Map();

  constructor(app: Application) {
    this.app = app;
    this.cache = createCache();

    this.app.on('afterLoad', async () => {
      this.app.log.debug('load locale resource');
      this.app.setMaintainingMessage('load locale resource');
      await this.load();
      this.app.log.debug('locale resource loaded');
      this.app.setMaintainingMessage('locale resource loaded');
    });
  }

  async load() {
    await this.get(this.defaultLang);
  }

  setLocaleFn(name: string, fn: (lang: string) => Promise<any>) {
    this.localeFn.set(name, fn);
  }

  async get(lang: string) {
    const defaults = {
      resources: await this.getCacheResources(lang),
    };
    for (const [name, fn] of this.localeFn) {
      // this.app.log.debug(`load [${name}] locale resource `);
      const result = await this.wrapCache(`locale:${name}:${lang}`, async () => await fn(lang));
      if (result) {
        defaults[name] = result;
      }
    }
    return defaults;
  }

  async wrapCache(key: string, fn: () => any) {
    const result = await this.cache.get(key);
    if (result) {
      return result;
    }
    const value = await fn();
    if (lodash.isEmpty(value)) {
      return value;
    }
    await this.cache.set(key, value);
    return value;
  }

  async getCacheResources(lang: string) {
    return await this.wrapCache(`locale:resources:${lang}`, () => this.getResources(lang));
  }

  getResources(lang: string) {
    const resources = {};
    const names = this.app.pm.getAliases();
    for (const name of names) {
      try {
        const p = this.app.pm.get(name);
        if (!p) {
          continue;
        }
        const packageName = p.options?.packageName;
        if (!packageName) {
          continue;
        }
        // this.app.log.debug(`load [${packageName}] locale resource `);
        // this.app.setMaintainingMessage(`load [${packageName}] locale resource `);
        const res = getResource(packageName, lang);
        if (res) {
          resources[name] = { ...res };
        }
      } catch (err) {
        // empty
      }
    }
    return resources;
  }
}
