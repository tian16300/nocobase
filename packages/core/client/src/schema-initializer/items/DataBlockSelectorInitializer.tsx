import { merge } from '@formily/shared';
import React from 'react';
import { useSchemaInitializerItem } from '../../application';
import { useCollection } from '../../collection-manager';
import { BlockInitializer } from './BlockInitializer';

export const DataBlockSelectorInitializer = () => {
  const collection = useCollection();
  const itemConfig = useSchemaInitializerItem();

  const schema = {};
  if (collection && schema['x-acl-action']) {
    schema['x-acl-action'] = `${collection.name}:${schema['x-acl-action']}`;
    schema['x-decorator'] = 'ACLActionProvider';
  }

  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />;
}