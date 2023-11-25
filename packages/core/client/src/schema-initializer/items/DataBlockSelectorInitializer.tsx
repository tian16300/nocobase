import { merge } from '@formily/shared';
import React from 'react';
import { SchemaInitializer } from '..';

export const DataBlockSelectorInitializer = (props) => {
    const { item, schema, insert } = props;
    return (      
      <SchemaInitializer.Item
        onClick={() => {
          const s = merge(schema || {}, item.schema || {});
          item?.schemaInitialize?.(s);
          insert(s);
        }}
      />
    );
}