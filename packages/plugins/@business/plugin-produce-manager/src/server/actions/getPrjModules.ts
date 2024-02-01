export const getPrjModules = async (ctx, next) => {
  const prjId = ctx.action.params?.prjId;
//   const createdBy = ctx.state.user.id;
  /**
   * 获取有BOM的模块
   */
  const models = await ctx.app.db.getRepository('bom_wl_list').find({
    filter: {
      prjId: prjId,
    },
  });
  /**
   * 获取项目下的所有模块 字段 label_gz   单元 label_unit
   * 层级结构 工站-单元
   */
 const  gzHash = {};

  await Promise.all(models.map(async (model) => {
    let { label_gz , label_unit } = model;
    label_gz = label_gz || '未关联';
    label_unit = label_unit || '未关联';
    if(!gzHash[label_gz]){
        gzHash[label_gz] = {
            name: label_gz,
            type: 'label_gz',
            prjId: prjId,
            units:{},
            records:[],
            count: 0,
        };            
    }
    /**
     * 单元判断
     */
    const units = gzHash[label_gz].units
    const records = gzHash[label_gz].records;
    records.push(model);
    gzHash[label_gz].count++;
    if(!units[label_unit]){
        units[label_unit] = {
            name: label_unit,
            type: 'label_unit',
            prjId: prjId,
            records:[],
            count: 0,
        };
    }
    units[label_unit].records.push(model);
    units[label_unit].count++;  
  }));
    const gz = Object.values(gzHash);
    const res =  await Promise.all(gz.map(async (gzModel:any) => {
        const {records, units, ...record} = gzModel;
        /**
         * 是否存在 key 工站
         */
        let dbGzModel = await ctx.app.db.getRepository('prj_bom_module').findOne({
            filter: {
                name: record.name,
                type: record.type,
                prjId: prjId,
            }});
        if(!dbGzModel){
          dbGzModel = await ctx.app.db.getRepository('prj_bom_module').create({
            values: record
          });
        }
        /**
         * 创建单元
         */
        const unitArr = Object.values(units);

        await Promise.all(unitArr.map(async (unitModel:any) => {
            const {records,  ...record} = unitModel;
            /**
             * 是否存在 key 工站
             */
            let dbUnitModel = await ctx.app.db.getRepository('prj_bom_module').findOne({
                filter: {
                    name: record.name,
                    type: record.type,
                    prjId: prjId,
                }});
            if(!dbUnitModel){
              dbUnitModel = await ctx.app.db.getRepository('prj_bom_module').create({
                values:{
                    ...record,
                    parent: dbGzModel
                },
                updateAssociationValues:['parent']
              });
            }
           
            /* 更新 records */
            await ctx.app.db.getRepository('bom_wl_list').update({
                filter: {
                    id: {
                        $in: records.map((item)=>item.id)
                    }
                },
                values:{
                  modules:[dbGzModel,dbUnitModel]
                },
                updateAssociationValues:['modules']
            });
            return unitModel;
        }));
        return gzModel;  
    }));

//   /**
//    * 创建项目模块
//    */
//   await Promise.all(Object.keys(gz).map(async (key: string)=>{
//     /**
//      * 是否存在 key 工站
//      */
//     const gzModel = await ctx.app.db.getRepository('prj_bom_module').findOne({
//         filter: {
//             name: key,
//             prjId: prjId,
//         },
//     });
//     if (!gzModel) {
//        const res =  await ctx.app.db.getRepository('prj_bom_module').create({
//             name: key,
//             type: 'label_gz',
//             prjId: prjId,
//             count:
//         });
//     }
    


//   }));
 


  /**
   *  创建项目模块
   */
  ctx.body = res;
  next();
};
