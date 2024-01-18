export const initCreateMany = async (ctx, next) => {
  const prjId = ctx.action.params?.prjId;
  const bomTypeDicCode = 'bom_apply_type';
  const currentUser = ctx.state.currentUser;
  const prjIdValue = Number(prjId).valueOf();
  if(typeof prjIdValue!== 'number'){
    ctx.body = '项目ID不正确';
    return;
  }

  const bomTypes = await ctx.app.db.getRepository('dicItem').find({
    filter: {
      dicCode: bomTypeDicCode,
    },
  });
  const rows = [], resRows = [];
  await Promise.all(
    bomTypes.map(async (bomType) => {
      const row = {
        bomType_dicId: bomType.id,
        orderType: '1',
        prjId: prjIdValue,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
      };
      const bomAppy = await ctx.app.db.getRepository(ctx.action.resourceName);
      const exist = await bomAppy.findOne({
        filter: {
          prjId: prjIdValue,
          bomType_dicId: bomType.id,
          orderType: '1',
        },
      });
      if (!exist) {
        rows.push(row);
      }
    }),
  );
  await rows.reduce(async (promise, row) => {
    await promise;
    const bomAppy = await ctx.app.db.getRepository(ctx.action.resourceName);
    const res = await bomAppy.create({
      values: row,
    });
    resRows.push(res);
    return res;
  }, Promise.resolve());
  if (resRows.length) {
    // ctx.state.status = 200;
    ctx.body = {
        data: resRows,
        message: '创建成功'
    };
  } else {
    // ctx.state.status = 400;
    ctx.body = '单据已经存在,可以选择补单';
  }
  next();
};
