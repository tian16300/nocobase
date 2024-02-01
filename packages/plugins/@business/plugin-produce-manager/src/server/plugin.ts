import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import _ from 'lodash';
import { initCreateMany } from './actions/initCreateMany';
import { getPrjModules } from './actions/getPrjModules';

const countWlAmount = function (models, isWs = false) {
  return models.reduce((prev: any, cur: any) => {
    const rate = isWs ? 1 + cur.rate : 1;
    return prev + (cur.price / rate) * (cur.num - cur.tc_num - cur.tk_num);
  }, 0);
};
export class PluginProduceManagerServer extends Plugin {
  afterAdd() {}
  beforeLoad() {
    this.db.addMigrations({
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
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

    //物料BOM 保存时 如果无项目 则更新项目
    this.app.db.on('bom_wl_list.beforeSave', async (model, { transaction }) => {
      if (model.get('bom_apply_id')) {
        const bom_apply_model = await this.app.db.getRepository('bom_apply').findOne({
          filterByTk: model.get('bom_apply_id'),
          transaction,
        });
        model.set('prjId', bom_apply_model.get('prjId'));
      }
    });

    this.addCgApplyEvents();
  }
  async addCgApplyEvents() {
    this.app.db.on('cg_wl_list.afterSave', async (model, { transaction }) => {
      const cg_apply_id = model.get('cg_apply_id');
      const bom_wl_list = model.get('bom_wl_list');
      //查找 cg_apply_list 明细 bom_wl_list
      const models = await this.app.db.getRepository('cg_wl_list').find({
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
                await this.app.db.getRepository('bom_wl_list').update({
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
    //采购申请单  保存BOM物料明细价格
    this.app.db.on('cg_apply.afterSaveWithAssociations', async (model, { transaction }) => {
      //查找 cg_apply_list 明细 bom_wl_list
      const models = await this.app.db.getRepository('cg_wl_list').find({
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
              await this.app.db.getRepository('bom_wl_list').update({
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

    //中间表关联同步 cg_apply_bom_throught cg_apply_id
    this.app.db.on('cg_apply_bom_throught.beforeSave', async (model, { transaction }) => {
      const cg_wl_id = model.get('cg_wl_id');
      //查找 cg_apply_list 明细 cg_apply_id
      const record = await this.app.db.getRepository('cg_wl_list').findOne({
        filterByTk: cg_wl_id,
        transaction,
      });
      model.set('cg_apply_id', record.get('cg_apply_id'));
    });

    //采购申请单 统计项目物料成本
    // 步骤 查找所有的BOM 明细  按照 项目分组  统计审批通过的总物料BOM 本次新增物料BOM 历史审批的项目物料BOM
    this.app.db.on('cg_apply.afterSaveWithAssociations', async (model, { transaction }) => {
      /* 查找BOM 明细 */
      const cg_apply_id = model.get('id');
      const currentTime = model.get('updatedAt') || model.get('createdAt');
      //删除采购申请单的所有项目物料成本
      await this.app.db.getRepository('prj_wl_cb').destroy({
        filter: {
          cg_apply_id,
        },
        transaction,
      });
      const [models, count] = await this.app.db.getRepository('bom_wl_list').findAndCount({
        filter: {
          $and: [
            {
              cg_apply_list: {
                id: {
                  $in: [cg_apply_id],
                },
              },
            },
            {
              bom_apply: {
                approvalStatus: {
                  jobIsEnd: true,
                },
              },
            },
            {
              prj: {
                id: {
                  $not: null,
                },
              },
            },
          ],
        },
        transaction,
      });
      // 创建新的项目物料成本  新增的物料
      const groups = _.groupBy(models, function (n) {
        return n.prjId;
      });
      const prjs = Object.keys(groups),
        rows = [];

      await Promise.all(
        prjs.map(async (prjId: any) => {
          const row: any = {};
          row.prjId = prjId;
          row.cg_apply_id = cg_apply_id;
          // 本次总物料BOM bom_wl_list 本次新增物料BOM add_wl_list 历史审批的项目物料BOM history_wl_list
          const add_wl_list = groups[prjId];
          const bom_wl_list =
            (await this.app.db.getRepository('bom_wl_list').find({
              filter: {
                $and: [
                  {
                    bom_apply: {
                      approvalStatus: {
                        jobIsEnd: true,
                      },
                    },
                  },
                  {
                    prj: {
                      id: prjId,
                    },
                  },
                ],
              },
              transaction,
            })) || [];
          //查找历史审批的项目物料BOM
          const history_wl_list =
            (await this.app.db.getRepository('bom_wl_list').find({
              filter: {
                $and: [
                  {
                    cg_apply_list: {
                      approvalStatus: {
                        jobIsEnd: true,
                      },
                    },
                  },
                  {
                    cg_apply_list: {
                      updatedAt: {
                        $dateBefore: currentTime,
                      },
                    },
                  },
                  {
                    prj: {
                      id: prjId,
                    },
                  },
                ],
              },
              transaction,
            })) || [];
          row.bom_wl_list = bom_wl_list;
          row.add_wl_list = add_wl_list;
          row.history_wl_list = history_wl_list;
          row.add_cb = countWlAmount(add_wl_list);
          row.add_ws_cb = countWlAmount(add_wl_list, true);
          row.total_cb = countWlAmount(bom_wl_list);
          row.total_ws_cb = countWlAmount(bom_wl_list, true);
          row.history_cb = countWlAmount(history_wl_list);
          row.history_ws_cb = countWlAmount(history_wl_list, true);
          /**
           * history_cb history_ws_cb
           */
          const res = await this.app.db.getRepository('prj_wl_cb').create({
            values: row,
            updateAssociationValues: ['bom_wl_list', 'add_wl_list', 'history_wl_list'],
            transaction,
          });
        }),
      );

      // models.forEach(async (item: any) => {});
    });
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
      await repo.db2cm('cg_apply_bom_throught');
      await repo.db2cm('prjWlCb_bomWl_mid');
      await repo.db2cm('fj_info_mid');
      await repo.db2cm('cgApply_prjs');
      await repo.db2cm('basic_wl_info');
      await repo.db2cm('basic_cg_detail');
      await repo.db2cm('basic_bom_wl');
      await repo.db2cm('bom_module_mid');
      await repo.db2cm('prj_bom_module');
      await repo.db2cm('bom_wl_list');
      await repo.db2cm('bom_apply');
      await repo.db2cm('prj_wl_cb');
      await repo.db2cm('cg_wl_list');
      await repo.db2cm('cg_apply');
    }
    this.app.resourcer.registerActionHandler('bom_apply:initCreateMany', initCreateMany);
    this.app.resourcer.registerActionHandler('prj:getPrjModules', getPrjModules);
    this.app.acl.allow('fj_info_mid', '*', 'public');
    this.app.acl.allow('cg_apply_bom_throught', '*', 'public');
    this.app.acl.allow('prjWlCb_bomWl_mid', '*', 'public');
    this.app.acl.allow('bom_module_mid', '*', 'public');
    this.app.acl.allow('cgApply_prjs', '*', 'public');
    this.app.acl.allow('bom_apply', '*', 'loggedIn');
    this.app.acl.allow('bom_wl_list', '*', 'loggedIn');
    this.app.acl.allow('cg_apply', '*', 'loggedIn');
    this.app.acl.allow('cg_wl_list', '*', 'loggedIn');
    this.app.acl.allow('prj_wl_cb', '*', 'loggedIn');
    this.app.acl.allow('prj_bom_module', '*', 'loggedIn');
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginProduceManagerServer;
