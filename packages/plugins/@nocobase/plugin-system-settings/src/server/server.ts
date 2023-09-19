import { InstallOptions, Plugin } from '@nocobase/server';
import { resolve } from 'path';

export class SystemSettingsPlugin extends Plugin {
  getInitAppLang(options) {
    return options?.cliArgs?.[0]?.opts?.lang || process.env.INIT_APP_LANG || 'en-US';
  }

  async install(options?: InstallOptions) {
    await this.db.getRepository('systemSettings').create({
      values: {
        title: '中科匠新',
        simpleTitle: '中科匠新',
        appLang: this.getInitAppLang(options),
        enabledLanguages: [this.getInitAppLang(options)],
        logo: {
          title: 'logo',
          filename: 'logo.png',
          extname: '.png',
          mimetype: 'image/png',
          url: '/storage/uploads/sys/logo.png',
        },
      },
    });
    // const repo = this.db.getRepository<any>('collections');
    // if (repo) {
    //   await repo.db2cm('systemSettings');
    // }
  }

  beforeLoad() {
    const cmd = this.app.findCommand('install');
    if (cmd) {
      cmd.option('-l, --lang [lang]');
    }

    this.app.acl.registerSnippet({
      name: `pm.${this.name}.system-settings`,
      actions: ['systemSettings:update'],
    });
  }

  async load() {
    await this.app.db.import({
      directory: resolve(__dirname, 'collections'),
    });

    this.app.acl.addFixedParams('systemSettings', 'destroy', () => {
      return {
        'id.$ne': 1,
      };
    });

    this.app.acl.allow('systemSettings', 'get', 'public');
  }
}

export default SystemSettingsPlugin;
