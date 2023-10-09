import { uid } from "@nocobase/utils";

const sumHours = (list, filter?) => {
  let arr = list;
  if (typeof filter == 'function') {
    arr = list.filter(filter);
  }
  arr = arr.map(({hours})=>{
    return hours;
  })
  return arr.length>0?arr.reduce(function (prev, curr, idx, arr) {
    return prev + curr;
  }):0;
};
export const hoursCount = async (ctx, next) => {
  //统计所有项目相关的数据
  //已生成则直接返回
  let prjId = ctx.request?.query?.prjId;
  if (!prjId) {
    ctx.body = {
      errorMessage: '缺少项目ID参数',
    };
  } else {
    prjId = Number(prjId).valueOf();
    const report = ctx.db.getRepository('reportDetail');
    //获取总工时 工时 出差 加班
    //总工时 工时 来源周报
    //出差 来源周报 来源钉钉
    //加班 来源钉钉
    const reportList = await report.find({
      filter: {
        belongsPrjKey: prjId,
        report: {
          status: {
            value: '2',
          },
        }
      },
      appends: ['report', 'report.status', 'createdBy'],
    });

    const business = ctx.db.getRepository('business_trip');
    const businessList = await business.find({
      filter: {
        prjId: prjId,
      },
      appends: ['adduser', 'datesource'],
    });
    const overtime = ctx.db.getRepository('overtime');
    const overtimeList = await overtime.find({
      filter: {
        prjId: prjId,
      },
      appends: ['adduser', 'datesource'],
    });
    const dicItem = ctx.db.getRepository('dicItem');
    const isFromSystem = await dicItem.findOne({
      filter: {
        dicCode: 'oadate_source',
        value: '3',
      },
    });
    const result:any = {
      report: [
        ...reportList.map((temp) => {
          return {
            key: uid(),
            id: temp.id,
            hours: temp.hours,
            isBusinessTrip: temp.isBusinessTrip,
            __collection: 'reportDetail',
            sourceFrom: isFromSystem,
            user: temp.createdBy,
            content: temp.content,
            reportTitle: temp.report.title
          };
        })
      ],
      trip: [
        ...businessList.map((temp) => {
          return {
            key: uid(),
            id: temp.id,
            hours: temp.duration,
            isBusinessTrip: true,
            __collection: 'business_trip',
            sourceFrom: temp.datesource,
            user: temp.adduser,
            business: temp.business
          };
        })
      ],
      overtime: [
        ...overtimeList.map((temp) => {
          return {
            key: uid(),
            id: temp.id,
            hours: temp.duration,
            isBusinessTrip: false,
            __collection: 'overtime',
            sourceFrom: temp.datesource,
            user: temp.adduser,
            reason: temp.reason
          };
        })
      ]
    };
    const count = {
      all: sumHours(result.report),
      comp:sumHours(result.report,({isBusinessTrip})=>{return !isBusinessTrip}),
      sysTrip:sumHours(result.report,({isBusinessTrip})=>{return isBusinessTrip}),
      dingTrip:sumHours(result.trip),
      overtime: sumHours(result.overtime)
    };
    result.count = count;
    ctx.body = result;
  }
  //生成项目阶段计划
  return next();
};
