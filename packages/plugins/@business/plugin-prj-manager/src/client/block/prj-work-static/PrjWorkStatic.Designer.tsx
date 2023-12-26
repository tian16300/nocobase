import React, { useContext } from 'react';
import { useFieldSchema } from '@formily/react';
import {
  SchemaComponentOptions,
  GeneralSchemaDesigner,
  SchemaSettings,
  useCollection,
  SchemaSettingsRemove
} from '@nocobase/client';

export const PrjWorkStaticDesigner = () => {
  const { name, title } = useCollection();
  const fieldSchema = useFieldSchema();
  return (
    <GeneralSchemaDesigner title={title || name}>
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

// export default React.memo((props) => {
//   return (
//     <SchemaComponentOptions
//       components={{
//         'Action.Designer': PrjWorkStaticDesigner,
//       }}
//     >{props.children}</SchemaComponentOptions>
//   );
// });