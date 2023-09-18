import React, { useContext } from 'react';
import { useFieldSchema } from '@formily/react';
import {
  SchemaComponentOptions,
  GeneralSchemaDesigner,
  SchemaSettings,
  useCollection,
  Gantt
} from '@nocobase/client';

export const PrjWorkPlanDesigner = Gantt.Designer;

// export default React.memo((props) => {
//   return (
//     <SchemaComponentOptions
//       components={{
//         'Action.Designer': PrjWorkStaticDesigner,
//       }}
//     >{props.children}</SchemaComponentOptions>
//   );
// });