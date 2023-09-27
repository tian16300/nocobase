import { SchemaComponentOptions, SchemaInitializerContext, SchemaInitializerProvider } from '@nocobase/client';
import React, { useContext } from 'react';
import {
  DataSelect,
  PrjWorkPlan,
  PrjWorkStatic,
  StageColumnInitializers,
  SubPageAction,
  TaskColumnInitializers,
  useDataSelectTabsProps,
  useFormSelectBlockProps,
  useFormSelectOptionsProps,
  usePrjWorkPlanDecoratorProps,
  usePrjWorkPlanGanttBlockProps,
  usePrjWorkPlanProcessData,
  usePrjWorkPlanTableBlockProps,
  useTaskTableBlockProps,
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
  return (
    <SchemaComponentOptions
      scope={{
        useFormSelectBlockProps,
        useFormSelectOptionsProps,
        useDataSelectTabsProps,
        usePrjWorkPlanDecoratorProps,
        usePrjWorkPlanTableBlockProps,
        usePrjWorkPlanGanttBlockProps,
        useTaskTableBlockProps,
        usePrjWorkPlanProcessData
      }}
      components={{
        PrjRecordBlockInitializers,
        DataSelect,
        PrjWorkStatic,
        PrjWorkPlan,
      }}
    >
      <SchemaInitializerProvider
        initializers={{
          ...initializers,
          'DataSelect.initializer': DataSelect.initializer,
          StageColumnInitializers,
          TaskColumnInitializers,
        }}
      >
        {props.children}
      </SchemaInitializerProvider>
    </SchemaComponentOptions>
  );
};

DataSelectProvider.displayName = 'DataSelectProvider';
