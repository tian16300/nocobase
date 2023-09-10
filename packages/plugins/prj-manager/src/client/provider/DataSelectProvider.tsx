import { SchemaComponentOptions, SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';
import { 
  DataSelect, 
  PrjWorkPlan, 
  PrjWorkStatic, 
  useDataSelectTabsProps, 
  useFormSelectBlockProps, 
  useFormSelectOptionsProps } from '../block/index';
import { PrjRecordBlockInitializers } from '../initializers';

export const DataSelectProvider: React.FC = (props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[2].children;
  const has = children.some((initializer) => initializer.component === 'DataSelect.initializer');
  if (!has) {
    children.push({
      key: 'dataSelectBlock',
      type: 'item',
      title: '项目详情',
      component: 'DataSelect.initializer',
    });
  }
  return (
    <SchemaComponentOptions
      scope={{
        useFormSelectBlockProps,
        useFormSelectOptionsProps,
        useDataSelectTabsProps
      }}
      components={{
        PrjRecordBlockInitializers,
        DataSelect,
        PrjWorkStatic,
        PrjWorkPlan
      }}
    >
      <SchemaInitializerProvider initializers={{ ...initializers, 'DataSelect.initializer': DataSelect.initializer }}>
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
};

DataSelectProvider.displayName = 'DataSelectProvider';
