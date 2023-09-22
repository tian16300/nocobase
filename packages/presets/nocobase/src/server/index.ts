import { Repository } from '@nocobase/database';
import { Plugin, PluginManager } from '@nocobase/server';
import _ from 'lodash';
import path from 'path';

export class PresetNocoBase extends Plugin {
  builtInPlugins = [
    'error-handler',
    'collection-manager',
    'ui-schema-storage',
    // 'ui-routes-storage',
    'file-manager',
    'system-settings',
    'sequence-field',
    'verification',
    'users',
    'acl',
    'china-region',
    'workflow',
    'client',
    'export',
    'import',
    'duplicator',
    'iframe-block',
    'formula-field',
    'charts',
    'data-visualization',
    'auth',
    'sms-auth',
    'theme-editor',
    'graph-collection-manager',
    'mobile-client',
    'audit-logs',
    'company-info',
    'dic-manager',
    'prj-manager',
  ];

  localPlugins = [
    'sample-hello',
    'multi-app-manager',
    'multi-app-share-collection',
    'oidc',
    'saml',
    'map',
    'snapshot-field',
    'api-keys',
    'localization-management',
    'cas',
    'api-doc',
  ];

  splitNames(name: string) {
    return (name || '').split(',').filter(Boolean);
  }

  getBuiltInPlugins() {
    const { PRESET_NOCOBASE_PLUGINS, APPEND_PRESET_BUILT_IN_PLUGINS } = process.env;
    return _.uniq(
      this.splitNames(APPEND_PRESET_BUILT_IN_PLUGINS || PRESET_NOCOBASE_PLUGINS).concat(this.builtInPlugins),
    );
  }

  getLocalPlugins() {
    const { APPEND_PRESET_LOCAL_PLUGINS } = process.env;
    return _.uniq(this.splitNames(APPEND_PRESET_LOCAL_PLUGINS).concat(this.localPlugins));
  }

  beforeLoad() {
    this.db.addMigrations({
      namespace: this.getName(),
      directory: path.resolve(__dirname, './migrations'),
      context: {
        plugin: this,
      },
    });
    this.app.on('beforeUpgrade', async () => {
      await this.updateOrCreatePlugins();
    });
  }

  get allPlugins() {
    return this.builtInPlugins
      .map((name) => {
        const packageName = PluginManager.getPackageName(name);
        const packageJson = PluginManager.getPackageJson(packageName);
        return { name, packageName, enabled: true, builtIn: true, version: packageJson.version } as any;
      })
      .concat(
        this.localPlugins.map((name) => {
          const packageName = PluginManager.getPackageName(name);
          const packageJson = PluginManager.getPackageJson(packageName);
          return { name, packageName, version: packageJson.version };
        }),
      );
  }

  async updateOrCreatePlugins() {
    const repository = this.app.db.getRepository<Repository>('applicationPlugins');
    return Promise.all(
      this.allPlugins.map((values) =>
        repository.updateOrCreate({
          values,
          filterKeys: ['name'],
        }),
      ),
    );
  }

  async createIfNotExists() {
    const repository = this.app.db.getRepository<Repository>('applicationPlugins');
    const existPlugins = await repository.find();
    const existPluginNames = existPlugins.map((item) => item.name);
    const plugins = this.allPlugins.filter((item) => !existPluginNames.includes(item.name));
    await repository.create({ values: plugins });
  }

  async install() {
    const repository = this.db.getRepository<any>('applicationPlugins');
    await this.createIfNotExists();
    this.log.debug('install preset plugins');
    await repository.init();
    await this.app.pm.load();
    await this.app.pm.install();
  }
}

export default PresetNocoBase;
