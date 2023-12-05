import { merge } from '@formily/shared';
import React from 'react';
import { SchemaInitializerItem } from '../../application';

export const DataBlockSelectorInitializer = (props) => {
    const { item, schema, insert } = props;
    return (      
      <SchemaInitializerItem
        onClick={() => {
          const s = merge(schema || {}, item.schema || {});
          item?.schemaInitialize?.(s);
          insert(s);
        }}
      />
    );
}