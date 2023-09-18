import {
  // RecordBlockInitializerContext,
  // RecordBlockInitializerProvider,
  SchemaComponentOptions,
  SchemaInitializerContext,
  SchemaInitializerProvider,
} from '@nocobase/client';
import React, { useContext, useEffect } from 'react';
import { PrjFilterForm } from '../component';

/**
 * 在详情板块里增加筛选表单
 */
export const PrjFormProvider = React.memo((props) => {
  // const items = useContext<any>(RecordBlockInitializerContext);
  // const children = items.BlockInitializers.items[0].children;
  useEffect(() => {
    // if (!children.find((item) => item.component === 'PrjFilterForm')) {
    //   children.push({
    //     key: 'dataSelectBlock',
    //     type: 'item',
    //     title: '下拉列表',
    //     component: 'PrjFilterForm',
    //   });
    // }
  }, []);
  return (
    <SchemaComponentOptions components={{ PrjFilterForm }}>
       {props.children}
    </SchemaComponentOptions>
  );
});

PrjFormProvider.displayName = 'PrjFormProvider';

export const useRecordBlockInitializerItems = (items)=>{

};

