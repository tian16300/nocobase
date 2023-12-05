import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializer, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import { createPrjWorkPlanShema } from '../../utils';

export const PrjWorkPlanInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<FormOutlined />}
      onClick={() => {
        insert(createPrjWorkPlanShema());
      }}
    />
  );
};
