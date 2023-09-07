import {
  SchemaComponentOptions,
  SchemaInitializerContext,
  SchemaInitializerProvider,
} from '@nocobase/client';
import React, { useContext, useEffect } from 'react';
import {
  DataSelectBlockInitializer,
  DataSelectDesigner,
  DataSelectFieldProvider,
  useFormSelectBlockProps,
  useFormSelectOptionsProps
} from '../block/index';


export const DataSelectProvider = React.memo((props) => {
  const items = useContext<any>(SchemaInitializerContext);
  const children = items.BlockInitializers.items[0].children;
  useEffect(() => {
    if (!children.find((item) => item.component === 'DataSelectBlockInitializer')) {
      children.push({
        key: 'dataSelectBlock',
        type: 'item',
        title: '下拉列表',
        component: 'DataSelectBlockInitializer',
      });
    }
  }, []);
  return (
    <SchemaComponentOptions scope={{
       useFormSelectBlockProps, 
      useFormSelectOptionsProps
    }}
      components={{ 
        DataSelectBlockInitializer,
       DataSelectDesigner, 
       DataSelectFieldProvider }}>
      <SchemaInitializerProvider>
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
});

DataSelectProvider.displayName = 'DataSelectProvider';

export default DataSelectProvider;
