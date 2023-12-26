import { TableOutlined } from '@ant-design/icons';
import { SchemaInitializer, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { createDataSelectBlockSchema } from '../../utils';
import { uid } from '@nocobase/utils';
export const DataSelectBlockInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<TableOutlined />}
      onClick={() => {
        const s = createDataSelectBlockSchema({});
        insert(s);
      }}
    />
  );
};
