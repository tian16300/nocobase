
export const generatePlan = async (ctx, next) => {
  //已生成则直接返回
  const prjId = ctx.request?.body?.id;
  if (!prjId) {
    ctx.body = {
      errorMessage: '缺少项目ID参数',
    };
  } else {
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
          };
        }),
      },
    });
  }
  //生成项目阶段计划
  return next();
};
