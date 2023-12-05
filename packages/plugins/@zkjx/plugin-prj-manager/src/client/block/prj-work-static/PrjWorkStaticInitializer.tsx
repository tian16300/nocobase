import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializer, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import { createPrjWorkStaticShema } from '../../utils';

export const PrjWorkStaticInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<FormOutlined />}
      onClick={() => {
        insert(createPrjWorkStaticShema());
      }}
    />
  );
};
