import { FormOutlined } from '@ant-design/icons';
import { createSchema } from './schema/createSchema';
import React from 'react';
import { DataBlockInitializer, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';

export const Initializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      componentType={'TreeForm'}
      icon={<FormOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const name = item.name;
        insert(
          createSchema({
            collection: name,
          }),
        );
      }}
    ></DataBlockInitializer>
  );
};
