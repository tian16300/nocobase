import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import {
  SchemaInitializer,
  SchemaInitializerItem,
  useCollection,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@nocobase/client';
import { createPrjWorkStaticShema } from '../../utils';

export const PrjWorkStaticInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  return (
    <SchemaInitializerItem
      {...others}
      icon={<FormOutlined />}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          insert(createPrjWorkStaticShema());
        }
      }}
    />
  );
};
