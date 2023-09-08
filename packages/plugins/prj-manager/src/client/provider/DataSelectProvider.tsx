import { SchemaComponentOptions, SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext, useEffect } from 'react';
import { DataSelect, PrjWorkStatic, useFormSelectBlockProps, useFormSelectOptionsProps } from '../block/index';
import { PrjRecordBlockInitializers } from '../initializers';

export const DataSelectProvider: React.FC = (props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[0].children;
  const has = children.some((initializer) => initializer.component === 'DataSelect.initializer');
  console.log('DataSelectProvider');
  if (!has) {
    children.push({
      key: 'dataSelectBlock',
      type: 'item',
      title: '下拉列表',
      component: 'DataSelect.initializer',
    });
  }
  return (
    <SchemaComponentOptions
      scope={{
        useFormSelectBlockProps,
        useFormSelectOptionsProps,
      }}
      components={{
        PrjRecordBlockInitializers,
        DataSelect,
        PrjWorkStatic,
      }}
    >
      <SchemaInitializerProvider initializers={{ ...initializers, 'DataSelect.initializer': DataSelect.initializer }}>
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
};

DataSelectProvider.displayName = 'DataSelectProvider';
