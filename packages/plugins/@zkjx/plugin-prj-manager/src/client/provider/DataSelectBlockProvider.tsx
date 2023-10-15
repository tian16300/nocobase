import { SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';
import {
  DataSelect,
} from '../block/index';

export const DataSelectBlockProvider: React.FC = (props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[2].children;
  const hasDataSelect = children.some((initializer) => initializer.component === 'DataSelect.initializer');
  if (!hasDataSelect) {
    children.push({
      key: 'dataSelectBlock',
      type: 'item',
      title: '项目详情',
      component: 'DataSelect.initializer',
    });
  }
  return (
      <SchemaInitializerProvider
        initializers={{
          ...initializers,
          'DataSelect.initializer': DataSelect.initializer
        }}
      >
        {props.children}
      </SchemaInitializerProvider>
  );
};

DataSelectBlockProvider.displayName = 'DataSelectBlockProvider';
