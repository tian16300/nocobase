import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializer } from '@nocobase/client';
import { createPrjWorkPlanShema } from '../../utils';

export const PrjWorkPlanInitializer = (props) => {
  const { insert } = props;
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert(createPrjWorkPlanShema());
      }}
    />
  );
};
