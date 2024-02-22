import * as functions from '@formulajs/formulajs';
import { dayjs } from '@nocobase/utils';

Object.assign(functions, {
  dayjs: dayjs,
});

import { evaluate } from '.';

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
