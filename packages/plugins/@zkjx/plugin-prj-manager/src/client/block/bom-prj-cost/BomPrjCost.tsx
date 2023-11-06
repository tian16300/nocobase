import React from 'react';
import { BlockItem, GeneralSchemaDesigner, SchemaSettings, useCollection, useSchemaTemplate } from '@nocobase/client';

export const BomPrjCost = (props) => {
  return (
    <div>项目详情133444</div>
  );
};

BomPrjCost.Decorator = (props) => {
  return <BlockItem>{props.children}</BlockItem>;
};

BomPrjCost.Designer = () => {
  const template = useSchemaTemplate();
  const { name, title, sortable } = useCollection();
  return (
    <GeneralSchemaDesigner template={template} title={title || name}>
      <SchemaSettings.Divider />
      <SchemaSettings.Remove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};
