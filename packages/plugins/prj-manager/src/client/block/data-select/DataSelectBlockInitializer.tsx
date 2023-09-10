import { TableOutlined } from '@ant-design/icons';
import { DataBlockInitializer } from '@nocobase/client';
import React from 'react';
import { createDataSelectBlockSchema } from '../../utils';
export const DataSelectBlockInitializer = (props) => {
  return (
    <DataBlockInitializer
      {...props}
      icon={<TableOutlined />}
      componentType={'DataSelect'}
      templateWrap={(templateSchema, { item }) => {
        const s = createDataSelectBlockSchema({
          template: templateSchema,
          collection: item.name,
        });
        if (item.template && item.mode === 'reference') {
          s['x-template-key'] = item.template.key;
        }
        return s;
      }}
      createBlockSchema={createDataSelectBlockSchema}
    />
  );
};
