import { TableOutlined } from '@ant-design/icons';
import { SchemaInitializer } from '@nocobase/client';
import React from 'react';
import { createDataSelectBlockSchema } from '../../utils';
import { uid } from '@nocobase/utils';
export const DataSelectBlockInitializer = (props) => {
  const { insert } = props;
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<TableOutlined />}
      onClick={() => {
        const s = createDataSelectBlockSchema({});
        insert(s);
      }}
    />
  );
};
