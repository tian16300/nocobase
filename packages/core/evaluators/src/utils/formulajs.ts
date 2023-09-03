import * as functions from '@formulajs/formulajs';
import { dayjs, toDayjs, toLocal } from '@nocobase/utils';

Object.assign(functions, {
  WEEKFIRSTDAY() {
    dayjs.locale('zh-cn');
    const weekDay = dayjs(new Date()).startOf('week');
    return toLocal(toDayjs(weekDay, { utcOffset: 0 }));
  },
  WEEKLASTDAY() {
    const weekDay = dayjs(new Date()).endOf('week');
    return toLocal(toDayjs(weekDay, { utcOffset: 0 }));
  },
  DATEFORMAT(date, format) {
    // return dayjs.utc(date).utcOffset(1, true).format(format);
    return '';
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
