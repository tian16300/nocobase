import { Action } from "@nocobase/client";
import { ExpectCgApplyAction } from "./ExpectCgApply.Action";
// import { ApplyActionDesign } from "./Apply.Action.Design";


export const Apply: any = ExpectCgApplyAction;

Apply.Action = ExpectCgApplyAction;
Apply.Action.Designer = Action.Designer;
