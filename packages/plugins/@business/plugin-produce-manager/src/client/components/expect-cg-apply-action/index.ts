import { Action } from "@nocobase/client";
import { ExpectCgApplyAction } from "./ExpectCgApply.Action";
import { ExpectCgApplyActionInitializer } from "./ExpectCgApplyActionInitializer";
// import { ApplyActionDesign } from "./Apply.Action.Design";


export const ExpectCgApply: any = ExpectCgApplyAction;

ExpectCgApply.Action = ExpectCgApplyAction;
ExpectCgApply.Action.Designer = Action.Designer;

export {ExpectCgApplyActionInitializer}

