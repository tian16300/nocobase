import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializer } from '@nocobase/client';
import { createPrjWorkStaticShema } from '../../utils';

export const PrjWorkStaticInitializer = (props) => {
  const { insert } = props;
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert(createPrjWorkStaticShema());
      }}
    />
  );
};
