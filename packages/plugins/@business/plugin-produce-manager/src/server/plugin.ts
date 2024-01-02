import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
export class PluginProduceManagerServer extends Plugin {
  afterAdd() {}

  beforeLoad() {
    this.db.addMigrations({
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    /* BOM物料明细 继承 BOM单  */
    this.app.db.on('bom.afterSaveWithAssociations', async (model, { transaction }) => {
      const prj = await  this.db.getRepository('prj').findOne({
        filter:{
          code: model.get('prj_code')   
        },
        transaction
      })
      await this.db.getRepository('bom_wl').update({
        filter: {
          bom_id: model.get('id'),
        },
        values: {
          prjId: prj.get('id')
        },
        transaction
      });
      // await this.db.getRepository('bom').update({
      //   filterByTk: model.get('id'),
      //   values: {
      //     prjId: prj.get('id')
      //   },
      //   transaction
      // });
    });
    // this.app.db.on('bom.beforeSave', async (model, { transaction })=>{
    //   const prj = await  this.db.getRepository('prj').findOne({
    //     filterByTk: model.get('prjId'),
    //     transaction
    //   });
    //   model.set('prj_code', prj.code);

    // })
    
  }
  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('wl_category');
      await repo.db2cm('wl_info');
    }
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginProduceManagerServer;
