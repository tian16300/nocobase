import { SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';
import {
  DataItemSelect,
} from '../block/index';

export const DataItemSelectBlockProvider: React.FC = (props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[0].children;
  const hasDataSelect = children.some((initializer) => initializer.component === 'DataItemSelect.initializer');
  if (!hasDataSelect) {
    children.push({
      key: 'dataItemSelectBlock',
      type: 'item',
      title: '下拉列表',
      component: 'DataItemSelect.initializer',
    });
  }
  return (
      <SchemaInitializerProvider
        initializers={{
          ...initializers,
          'DataItemSelect.initializer': DataItemSelect.initializer
        }}
      >
        {props.children}
      </SchemaInitializerProvider>
  );
};

DataItemSelectBlockProvider.displayName = 'DataItemSelectBlockProvider';
