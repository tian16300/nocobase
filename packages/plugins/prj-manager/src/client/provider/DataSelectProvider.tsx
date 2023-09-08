import {
  SchemaComponentOptions,
  SchemaInitializerContext,
  SchemaInitializerProvider,
} from '@nocobase/client';
import React, { useContext, useEffect } from 'react';
// import {
//   DataSelectBlockInitializer,
//   DataSelectDesigner,
//   DataSelectFieldProvider,
//   PrjWorkStatic,
//   useFormSelectBlockProps,
//   useFormSelectOptionsProps
// } from '../block/index';
// import { PrjRecordBlockInitializers } from '../initializers';


export const DataSelectProvider = React.memo((props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[0].children;
  useEffect(() => {
    // if (!children.find((item) => item.component === 'DataSelectBlockInitializer')) {
    //   children.push({
    //     key: 'dataSelectBlock',
    //     type: 'item',
    //     title: '下拉列表',
    //     component: 'DataSelectBlockInitializer',
    //   });
    // }
  }, []);
  return (
    // <SchemaComponentOptions scope={{
    //   // useFormSelectBlockProps,
    //   // useFormSelectOptionsProps
    // }}
    //   components={{
    //     // DataSelectBlockInitializer,
    //     // PrjRecordBlockInitializers,
    //     // DataSelectDesigner,
    //     // DataSelectFieldProvider,
    //     // PrjWorkStatic
    //   }}>
    //   <SchemaInitializerProvider>
    //     {props.children}
    //   </SchemaInitializerProvider>
    // </SchemaComponentOptions>
    <></>
  );
});

DataSelectProvider.displayName = 'DataSelectProvider';

