import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import { initCreateMany } from './actions/initCreateMany';
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
    // this.app.db.on('bom_wl.beforeSave', async (model, { transaction }) => {
    //   const bom = await this.db.getRepository('bom').findOne({
    //     filter: {
    //       id: model.get('bom_id'),
    //     },
    //     transaction,
    //   });
    //   if (bom) {
    //     model.set('prjId', bom.get('prjId'));
    //   }
    // });
    /* 存储库存 把项目也作更新 */
    this.app.db.on('wl_stock.beforeSave', async (model, { transaction }) => {
      if (model.get('stock_id') && !model.get('prjId')) {
        const prjModel = await this.db.getRepository('prj').findOne({
          filter: {
            stock_id: model.get('stock_id'),
          },
          transaction,
        });
        if (prjModel) {
          model.set('prjId', prjModel.get('id'));
        }
      } else if (model.get('prjId') && !model.get('stock_id')) {
        const prjModel = await this.db.getRepository('prj').findOne({
          filter: {
            id: model.get('prjId'),
          },
          transaction,
        });
        if (prjModel) {
          model.set('stock_id', prjModel.get('stock_id'));
        }
      }
    });
    /*创建bom_applys 计算累计补单次数 */
    this.app.db.on('bom_apply.afterCreate', async (model, { transaction }) => {
      const typeIsBd = !model.get('orderType') || model.get('orderType') == '2';
      if (typeIsBd) {
        const sdModel = await this.db.getRepository('bom_apply').findOne({
          filter: {
            bomType_dicId: model.get('bomType_dicId'),
            prjId: model.get('prjId'),
            orderType: '1'
          },
          transaction
        });
        if (sdModel) {
          const [bdModels, bdCount] = await this.db.getRepository('bom_apply').findAndCount({
            filter: {
              bomType_dicId: model.get('bomType_dicId'),
              prjId: model.get('prjId'),
              orderType: '2'
            },
            transaction
          });
          //更新补单次数
          await this.db.getRepository('bom_apply').update({
            filterByTk: sdModel.get('id'),
            values: {
              bd_count: bdCount,
              link_bom_applys: bdModels
            },
            updateAssociationValues: ['link_bom_applys'],
            transaction
          });
        }
      }
    });
  }
  async getAllParentIds(bomId: number, transaction: any): Promise<number[]> {
    const bom = await this.db.getRepository('bom').findOne({
      filter: {
        id: bomId
      },
      transaction
    });

    if (bom && bom.get('parentId')) {
      const parents = await this.getAllParentIds(bom.get('parentId'), transaction);
      return [bomId, ...parents];
    } else {
      return [bomId];
    }
  }

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections/basic'),
    });
    await this.db.import({
      directory: path.resolve(__dirname, 'collections/bom'),
    });
    await this.db.import({
      directory: path.resolve(__dirname, 'collections/bom_cg'),
    });
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('wl_category');
      await repo.db2cm('wl_info');
      await repo.db2cm('data_log_flag');
      await repo.db2cm('basic_wl_info');
      await repo.db2cm('basic_cg_detail');
      await repo.db2cm('bom_bomcountwl');
      await repo.db2cm('bom_bomwl');
      await repo.db2cm('bom_wl');
      await repo.db2cm('bom');
      await repo.db2cm('bom_count_wl');
      await repo.db2cm('cg_apply_bom_throught');
      await repo.db2cm('cg_apply_list');
      await repo.db2cm('cg_apply');
    }
    this.app.resourcer.registerActionHandler('bom_apply:initCreateMany', initCreateMany);
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginProduceManagerServer;
