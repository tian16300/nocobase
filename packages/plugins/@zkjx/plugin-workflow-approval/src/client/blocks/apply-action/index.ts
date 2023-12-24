import { Action } from "@nocobase/client";
import { ApplyAction } from "./Apply.Action";
import { ApplyActionDesign } from "./Apply.Action.Design";


export const Apply: any = ApplyAction;

Apply.Action = ApplyAction;
Apply.Action.Designer = Action.Designer;
