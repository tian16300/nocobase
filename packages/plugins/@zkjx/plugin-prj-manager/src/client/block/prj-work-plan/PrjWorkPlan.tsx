import React from 'react';
import { PrjWorkPlanInitializer } from './PrjWorkPlanInitializer';
import { PrjWorkPlanDesigner } from './PrjWorkPlan.Designer';
import { PrjWorkPlanProvider } from './PrjWorkPlanProvider';
import { PrjWorkPlanTable } from './PrjWorkPlanTable';

export const PrjWorkPlan = () => {
  return (
    <></>
  );
};
PrjWorkPlan.Wrap = ({ children }) => {
  return (<>{children}</>)
}

PrjWorkPlan.Table = PrjWorkPlanTable
PrjWorkPlan.Decorator = PrjWorkPlanProvider;
PrjWorkPlan.Designer = PrjWorkPlanDesigner;
PrjWorkPlan.Initial = PrjWorkPlanInitializer
