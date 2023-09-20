import JSON5 from 'json5';

// import { query } from '../query';

// export const getData = async (ctx, next) => {
//   const { filterByTk } = ctx.action.params;
//   const r = ctx.db.getRepository('chartsQueries');
//   try {
//     const instance = await r.findOne({ filterByTk });
//     const result = await query[instance.type](instance.options, { db: ctx.db, skipError: true });
//     if (typeof result === 'string') {
//       ctx.body = JSON5.parse(result);
//     } else {
//       ctx.body = result;
//     }
//   } catch (error) {
//     ctx.body = [];
//     ctx.logger.info('chartsQueries', error);
//   }
//   return next();
// };

// export const validate = async (ctx, next) => {
//   const { values } = ctx.action.params;
//   ctx.body = {
//     errorMessage: '',
//   };
//   try {
//     await query.sql(values, { db: ctx.db, validateSQL: true });
//   } catch (error) {
//     ctx.body = {
//       errorMessage: error.message,
//     };
//   }
//   return next();
// };

// export const listMetadata = async (ctx, next) => {
//   const r = ctx.db.getRepository('chartsQueries');
//   const items = await r.find({ sort: '-id' });
//   ctx.body = items.map((item) => {
//     return {
//       id: item.id,
//       title: item.title,
//       type: item.type,
//       fields: item.fields,
//     };
//   });
//   return next();
// };

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
