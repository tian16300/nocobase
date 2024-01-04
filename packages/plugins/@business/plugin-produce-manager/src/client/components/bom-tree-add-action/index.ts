import { BomTreeAddAction } from './BomTreeAdd.Action';
import { BomTreeAddActionDesign } from './BomTreeAdd.Action.Design';
import { BomTreeAddActionInitializer } from './BomTreeAddActionInitializer';

export const BomTreeAdd: any = BomTreeAddAction;

BomTreeAdd.Action = BomTreeAddAction;
BomTreeAdd.Action.Design = BomTreeAddActionDesign;
export {BomTreeAddActionInitializer}
