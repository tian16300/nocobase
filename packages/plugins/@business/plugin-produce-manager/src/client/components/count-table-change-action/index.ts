import { CountTableChangeAction } from './CountTableChange.Action';
import { CountTableChangeActionDesign } from './CountTableChange.Action.Design';
import { CountTableChangeActionInitializer } from './CountTableChangeActionInitializer';

export const CountTableChange: any = CountTableChangeAction;

CountTableChange.Action = CountTableChangeAction;
CountTableChange.Action.Design = CountTableChangeActionDesign;
export {CountTableChangeActionInitializer}
