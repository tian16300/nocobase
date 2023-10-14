import { SchemaComponentOptions, SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';

import { PrjPlanCompare, usePrjPlanCompareOptionsProps, usePrjPlanCompareTableBlockProps } from '../block/prj-plan-compare';

export const PrjPlanCompareBlockProvider: React.FC = (props) => {
  const initializers = useContext<any>(SchemaInitializerContext);
  const children = initializers.BlockInitializers.items[2].children;
  const exist = children.some((initializer) => initializer.component === 'PrjPlanCompare.initializer');
  if (!exist) {
    children.push({
      key: 'prjPlanCompareBlock',
      type: 'item',
      title: '项目历史计划',
      component: 'PrjPlanCompare.initializer'
    });
  }
  return (
    <SchemaComponentOptions
      scope={{
        usePrjPlanCompareOptionsProps,
        usePrjPlanCompareTableBlockProps
      }}
      components={{
        PrjPlanCompare
      }}
    >
      <SchemaInitializerProvider
        initializers={{
          ...initializers,
          'PrjPlanCompare.initializer': PrjPlanCompare.initializer
        }}
      >
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
};

PrjPlanCompareBlockProvider.displayName = 'PrjPlanCompareBlockProvider';
