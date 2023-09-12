import * as functions from '@formulajs/formulajs';
import { dayjs, toDayjs, toLocal } from '@nocobase/utils';

Object.assign(functions, {
  WEEKFIRSTDAY() {
    dayjs.locale('zh-cn');
    const weekDay = dayjs(new Date()).startOf('week');
    return toLocal(toDayjs(weekDay, { utcOffset: 0 }));
  },
  WEEKLASTDAY() {
    const weekDay = dayjs().endOf('week');
    return toLocal(toDayjs(weekDay, { utcOffset: 0 }));
  },
  THISWEEKNAME() {
    // const d = dayjs;
    // console.log(dayjs.tz.guess());
    // console.log(dayjs('2023-09-10').format('YYYY年第ww周'));
    // console.log(toDayjs(new Date(), { utcOffset: 0 }).format('YYYY年第ww周'))
    return dayjs().format('YYYY年第ww周');
  },
});

const fnNames = Object.keys(functions).filter((key) => key !== 'default');
const fns = fnNames.map((key) => functions[key]);
export default function (expression: string, scope = {}) {
  const fn = new Function(...fnNames, ...Object.keys(scope), `return ${expression}`);
  const result = fn(...fns, ...Object.values(scope));
  if (typeof result === 'number') {
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      return null;
    }
    return functions.ROUND(result, 9);
  }
  console.log('formulajs 打印结果', result);
  return result;
}
