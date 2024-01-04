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
      
      const prj = await this.db.getRepository('prj').findOne({
        filter: {
          code: model.get('prj_code'),
        },
        transaction,
      });
      const records = model.dataValues.bom_wls;
      await Promise.all(
        records.map(async (record) => {
          return new Promise(async (resolve, reject) => {
            // const bomIds = await this.getAllParentIds(model.get('id'), transaction);
            const res = await this.db.getRepository('bom_wl').update({
              filterByTk: record.id,
              values: {
                prjId: prj.get('id'),
                // bom_id: bomIds,
              },
              transaction,
            });
            resolve(res);
          });
        }),
      );
      // await this.db.getRepository('bom_wl').update({
      //   filter: {
      //     bom_id: model.get('id'),
      //   },
      //   values: {
      //     prjId: prj.get('id'),
      //   },
      //   transaction,
      // });
      /* 统计BOM 物料明细 */
      //  const wl_list = await this.db.getRepository('bom_wl').findOne({
      //   filter: {
      //     bom_id: model.get('id'),
      //     prjId: prj.get('id')
      //   },
      //   transaction,
      //  });
      //  if(wl_list.length){
      // const wl_map = {};
      // const groupByWl = wl_list.reduce((group, record) => {
      //   const { wl_id } = record;
      //   group[wl_id] = group[wl_id] ?? [];
      //   group[wl_id].push(record);
      //   wl_map[wl_id] = record;
      //   return group;
      // }, {});

      //  }

      /* 统计每个BOM 新增明细 */
      // const wl = await this.db.getRepository('wl').findOne({
      //   filter: {
      //     code: model.get('wl_code'),
      //   },
      //   transaction,
      // });
    });
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
  }
  async  getAllParentIds(bomId: number, transaction: any): Promise<number[]> {
    const bom = await this.db.getRepository('bom').findOne({
      filter: {
        id: bomId,
      },
      transaction,
    });

    if (bom && bom.get('parentId')) {
      const parentIds = await this.getAllParentIds(bom.get('parentId'), transaction);
      return [bomId, ...parentIds];
    } else {
      return [bomId];
    }
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
