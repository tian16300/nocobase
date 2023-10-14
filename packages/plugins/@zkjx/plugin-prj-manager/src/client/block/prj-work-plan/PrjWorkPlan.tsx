import React from 'react';
import { PrjWorkPlanInitializer } from './PrjWorkPlanInitializer';
import { PrjWorkPlanDesigner } from './PrjWorkPlan.Designer';
import { PrjWorkPlanProvider } from './PrjWorkPlanProvider';
import { PrjWorkPlanTable } from './PrjWorkPlanTable';
import { CardItem, css } from '@nocobase/client';

export const PrjWorkPlan = () => {
  return (
    <></>
  );
};
PrjWorkPlan.Wrap = ({ children }) => {
  return (<CardItem className={css`box-shadow:none!important;`} bodyStyle={{padding:0}}>{children}</CardItem>)
}

PrjWorkPlan.Table = PrjWorkPlanTable
PrjWorkPlan.Decorator = PrjWorkPlanProvider;
PrjWorkPlan.Designer = PrjWorkPlanDesigner;
PrjWorkPlan.Initial = PrjWorkPlanInitializer
