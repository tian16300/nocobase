/**
 * 导出同步列
 * 功能实现步骤
 * 1、查人员表, 统计日期 开始日期  结束日期之间的人员考勤数据
 * 2、根据开始日期，结束日期 查本周完成的工时计算 周报工作时长 周报出差时长
 */
export const syncUserAttendceColumns = async (app) => {
  /**
   * 获取考勤列
   */
  

  const from_date = '2021-01-01';
  const to_date = '2021-01-31';
  const userRep = app.db.getRepository('users');
  const users = await userRep.find({
    filter: {
      dingUserId: {
        $notEmpty: true,
      },
    },
  });
  users.forEach(async (user) => {

    /* 查找考勤数据 */
    

    /* 查找周报工作时长 */
    const details = await app.db.getRepository('reportDetails').find({
        filter:{
            report:{
                userId: user.id,
                start:{
                    $between: [from_date, to_date] 
                }
            }
        },
        appends:[
            'report'
        ]
    });



  });
};
