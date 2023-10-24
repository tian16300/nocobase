export const generatePlan = async (ctx, next) => {
  //已生成则直接返回
  const prjId = ctx.request?.body?.id;
  if (!prjId) {
    ctx.body = {
      errorMessage: '缺少项目ID参数',
    };
  } else {
    const isExist = await ctx.db.getRepository('prj_plan_latest').findOne({
      filter: {
        prjId: prjId,
      },
    });
    if (!isExist) {
      //查找字典项目阶段
      const rep = ctx.db.getRepository('dicItem');
      const stages = await rep.find({
        filter: {
          dicCode: 'prj_cycle',
        },
      });
      const status = await rep.findOne({
        filter: {
          dicCode: 'prj_cycle_status',
          value: '1',
        },
      });
      //生成项目计划
      const prj = ctx.db.getRepository('prj');
      ctx.body = await prj.update({
        filterByTk: prjId,
        values: {
          plans: stages.map((stage) => {
            return {
              stage,
              status,
              title: stage.label,
            };
          }),
        },
      });
    } else {
      ctx.body = {
        errorMessage: '项目计划已创建',
      };
    }
  }
  //生成项目阶段计划
  return next();
};

/* 保存为新版本
 * body { id, plans  }
 */
export const saveLatest = async (ctx, next) => {
  const { id } = ctx.request?.body || {};
  if (!id) {
    ctx.body = {
      errorMessage: '缺少项目ID参数',
    };
  } else {
    /* 查找项目当前最新版本 */
    /* 将之前的数据 保存到历史版本中 */
    /* 将现在的数据保存到最新版本中 */
    const rep = ctx.db.getRepository('prj_plan_version');
    const version = await rep.findOne({
      filter: {
        prjId: id,
      },
      sort: '-version',
    });
    const newVersion = version ? version.version + 1 : 1;
    /* 增加项目版本 */
    await ctx.db.getRepository('prj_plan_version').create({
      values: {
        prjId: id,
        version: newVersion,
      },
    });

    const historyData = await ctx.db.getRepository('prj_plan_latest').find({
      filter: {
        prjId: id
      },
      sort:'id'
    });
    const records =[];

    historyData.forEach((model)=>{
      const {id, ...others} = model.dataValues;


      records.push({
        ...others,
        version: newVersion
      });


    })


    await ctx.db.getRepository('prj_plan_history').createMany({
      records: records
    });
    ctx.logger.info('计划保存为新版本', id, newVersion);
    /* 保存最新的数据 */
    // await plans.forEach(async (plan) => {
    //   const { id, updatedAt, updatedBy, ...others } = plan;
    //   await ctx.db.getRepository('prj_plan_latest').update({
    //     filterByTk: id,
    //     values: others,
    //   });
    // });
    ctx.body = 'ok';
  }

  return next();
};
