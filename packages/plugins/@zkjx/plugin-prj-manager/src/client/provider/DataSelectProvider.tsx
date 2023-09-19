import { SchemaComponentOptions, SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';
import {
  DataSelect,
  PrjWorkPlan,
  PrjWorkStatic,
  SubPageAction,
  useDataSelectTabsProps,
  useFormSelectBlockProps,
  useFormSelectOptionsProps,
  usePrjWorkPlanDecoratorProps,
} from '../block/index';
import { PrjRecordBlockInitializers } from '../initializers';

export const DataSelectProvider: React.FC = (props) => {
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
  const hasSubPage = children.some((initializer) => initializer.component === 'SubPageAction.initializer');
  if (!hasSubPage) {
    children.push({
      key: 'subPageBlock',
      type: 'item',
      title: '界面详情',
      component: 'SubPageAction.initializer',
    });
  }
  return (
    <SchemaComponentOptions
      scope={{
        useFormSelectBlockProps,
        useFormSelectOptionsProps,
        useDataSelectTabsProps,
        usePrjWorkPlanDecoratorProps,
      }}
      components={{
        PrjRecordBlockInitializers,
        DataSelect,
        PrjWorkStatic,
        PrjWorkPlan,
        SubPageAction,
      }}
    >
      <SchemaInitializerProvider initializers={{ ...initializers, 'DataSelect.initializer': DataSelect.initializer }}>
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
};

DataSelectProvider.displayName = 'DataSelectProvider';
