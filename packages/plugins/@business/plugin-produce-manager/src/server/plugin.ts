import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import _ from 'lodash';
import { initCreateMany } from './actions/initCreateMany';
import axios from 'axios';
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
            orderType: '1',
          },
          transaction,
        });
        if (sdModel) {
          const [bdModels, bdCount] = await this.db.getRepository('bom_apply').findAndCount({
            filter: {
              bomType_dicId: model.get('bomType_dicId'),
              prjId: model.get('prjId'),
              orderType: '2',
            },
            transaction,
          });
          //更新补单次数
          await this.db.getRepository('bom_apply').update({
            filterByTk: sdModel.get('id'),
            values: {
              bd_count: bdCount,
              link_bom_applys: bdModels,
            },
            updateAssociationValues: ['link_bom_applys'],
            transaction,
          });
        }
      }
    });
    this.app.db.on('bom_apply.afterDestroy', async (model, { transaction }) => {
      const typeIsBd = !model.get('orderType') || model.get('orderType') == '2';
      if (typeIsBd) {
        const sdModel = await this.db.getRepository('bom_apply').findOne({
          filter: {
            bomType_dicId: model.get('bomType_dicId'),
            prjId: model.get('prjId'),
            orderType: '1',
          },
          transaction,
        });
        if (sdModel) {
          const [bdModels, bdCount] = await this.db.getRepository('bom_apply').findAndCount({
            filter: {
              bomType_dicId: model.get('bomType_dicId'),
              prjId: model.get('prjId'),
              orderType: '2',
            },
            transaction,
          });
          //更新补单次数
          await this.db.getRepository('bom_apply').update({
            filterByTk: sdModel.get('id'),
            values: {
              bd_count: bdCount,
              link_bom_applys: bdModels,
            },
            updateAssociationValues: ['link_bom_applys'],
            transaction,
          });
        }
      }
    });
    //采购申请单  保存BOM物料明细价格
    this.app.db.on('cg_apply.afterSaveWithAssociations', async (model, { transaction }) => {
      //查找 cg_apply_list 明细 bom_wl_list
      const models = await this.app.db.getRepository('cg_apply_list').find({
        filter: {
          cg_apply_id: model.get('id'),
        },
        appends: ['bom_wl_list', 'bom_wl_list.wl'],
      });
      await Promise.all(
        models.map(async (item: any) => {
          const rate = item.get('rate');
          const price = item.get('price');
          // const price = item.get('price');
          await Promise.all(
            item.bom_wl_list.map(async (bom_wl: any) => {
              // 更新 bom明细价格
              await this.app.db.getRepository('bom_wl').update({
                filterByTk: bom_wl.get('id'),
                values: {
                  price,
                  rate,
                },
                transaction,
              });
              const wl = bom_wl.get('wl');
              if (wl) {
                // 在物料表里 增加物料价格
                // await this.app.db.getRepository('wl').update({
                //   filterByTk: wl.get('id'),
                //   values: {
                //     price,
                //     rate
                //   },
                //   transaction
                // });
              }
            }),
          );
        }),
      );
    });
    this.app.db.on('cg_apply_list.afterSave', async (model, { transaction }) => {
      const cg_apply_id = model.get('cg_apply_id');
      const bom_wl_list = model.get('bom_wl_list');
      //查找 cg_apply_list 明细 bom_wl_list
      const models = await this.app.db.getRepository('cg_apply_list').find({
        filterByTk: model.get('id'),
        appends: ['bom_wl_list', 'bom_wl_list.prj'],
      });
      // const bom_wl_lists = models.reduce((prev: any, cur: any) => {
      //   return [...prev, ...cur.bom_wl_list];
      // },[]);
      await Promise.all(
        models.map(async (item: any) => {
          const rate = item.get('rate');
          const price = item.get('price');
          await Promise.all(
            item.bom_wl_list.map(async (bom_wl: any) => {
              const wl = bom_wl.get('wl');
              if (!wl) {
                // 更新 bom明细价格
                await this.app.db.getRepository('bom_wl').update({
                  filterByTk: bom_wl.get('id'),
                  values: {
                    price,
                    rate,
                  },
                  transaction,
                });
              }
            }),
          );
        }),
      );
    });
    //物料BOM新增 或者修改 生成项目BOM Tree结构
    this.app.db.on('bom_wl.beforeSave', this.updatePrjBomTree.bind(this));
    //物料BOM新增 或者修改 生成项目BOM Tree结构
    // this.app.db.on('bom_wl.beforeDestroy', async (model, { transaction }) => {
    //   //将项目BOM Tree结构 保存到 bom 表里
    // });
  }
  async updatePrjBomTree(model: any, { transaction }) {
    // 查找所有 prj bom 生成 分组  全部   工站  单元   未关联
    const prjId = model.get('prjId');
    const prjModel = await this.app.db.getRepository('prj').findOne({
      filter: {
        id: prjId,
      },
      transaction,
    });
    const code = prjModel.get('code');
    // const bomWls = await this.app.db.getRepository('bom_wl').find({
    //   filter: {
    //     prjId,
    //   },
    //   transaction,
    // });

    /* gz */
    const treeRep = this.app.db.getRepository('bom_wl_tree');
    const gz = model.label_gz || '其他';
    const unit = model.label_unit || '其他';
    let unitName = gz == '其他' && unit == '其他' ? '未关联' : gz + '-' + unit;
    const treeModel = await treeRep.findOne({
      filter: {
        prjId: prjId,
        unit_name: unitName,
      },
      transaction,
    });
    if (!treeModel) {
      if (unitName == '未关联') {
        //创建未关联
        await treeRep.create({
          values: {
            prjId: prjId,
            unit_name: code + '-' + unitName,
            // bom_wl_ids: [model.get('id')],
          },
          transaction,
        });
      } else {
        // 查找 工站 是否创建
        const gzTreeModel = await treeRep.findOne({
          filter: {
            prjId: prjId,
            unit_name: code + '-' + gz,
          },
          transaction,
        });
        //未创建查找 code 是否创建
        //  const gzTreeModel = await treeRep.findOne({
        //   filter: {
        //     prjId: prjId,
        //     unit_name: code + '-' + gz,
        //   },
        //   transaction,
        // });

      }
    }
    // if (treeModel) {
    //   const bomWlIds = bomWls.map((item: any) => item.get('id'));
    //   const bomWlTreeIds = treeModel.get('bom_wl_ids');
    //   const bomWlTreeIdsStr = bomWlTreeIds.join(',');
    //   const bomWlIdsStr = bomWlIds.join(',');
    //   if (bomWlTreeIdsStr != bomWlIdsStr) {
    //     await treeRep.update({
    //       filterByTk: treeModel.get('id'),
    //       values: {
    //         bom_wl_ids: bomWlIds,
    //       },
    //       transaction,
    //     });
    //   }
    // } else {
    //   await treeRep.create({
    //     values: {
    //       prjId: prjId,
    //       unit_name: unitName,
    //       bom_wl_ids: bomWls.map((item: any) => item.get('id')),
    //     },
    //     transaction,
    //   });
    // }
    // /* 分组 */
    // const root = [
    //   {
    //     name: '全部',
    //     children: [],
    //   },
    // ];
    // // var group = _.groupBy(bomWls, function (n) { return n.name+" ++ "+n.score; });//把字段连接起来，作为生成的对象的属性(唯一)
    // var group = _.groupBy(bomWls, function (n) {
    //   const gz = n.label_gz || '其他';
    //   const unit = n.label_unit || '其他';
    //   if (gz == '其他' && unit == '其他') {
    //     return '未关联';
    //   } else {
    //     return gz + '-' + unit;
    //   }
    // });

    // console.log(group);
  }
  async getAllParentIds(bomId: number, transaction: any): Promise<number[]> {
    const bom = await this.db.getRepository('bom').findOne({
      filter: {
        id: bomId,
      },
      transaction,
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
