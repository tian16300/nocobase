// const request = require('request');
/**
 * https://gitee.com/sk88/get_holiday/blob/master/index.js
 */
// export const getHoliday = (ctx)=>{
//     const year = ctx.request.year || new Date().getFullYear();
//     request.get(`https://fangjia.51240.com/${year}__fangjia/`, (err, response, body) => {
//         if(err) return res.json({ err })
//         return res.json( { 
//           year,
//           holiday: operation(body, year) 
//         })
//       })
// }