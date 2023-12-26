import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class PluginDicManagerServer extends Plugin {
  afterAdd() {}

  beforeLoad() {
    this.bindSync(['dic', 'dicItem']);
  }
  bindSync(names) {
    names.forEach((name) => {
      this.db.on(`${name}.afterSync`, async (model, options) => {
        const collectionName = name;
        const collection = this.db.getCollection(collectionName);
        const repo = this.db.getRepository<any>('collections');
        const result = await repo.findOne({
          filter: {
            name: collectionName,
          },
        });
        if (!result) {
          await repo.db2cm(collectionName);
        } else {
          const fields = [];
          for (const [name, field] of collection.fields) {
            fields.push({
              name,
              ...field.options,
            });
          }
          const upRes = await repo.update({
            filter: {
              name: collectionName,
            },
            values: {
              fields,
              from: 'db2cm',
            },
          });
        }
      });
    });
  }
  async load() {
    /* 创建表 */
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    this.app.acl.allow('dic', 'get', 'public');
    this.app.acl.allow('dicItem', 'get', 'public');
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginDicManagerServer;
