import React from 'react';
import { PrjWorkPlanInitializer } from './PrjWorkPlanInitializer';
import { PrjWorkPlanDesigner } from './PrjWorkPlan.Designer';
import { PrjWorkPlanForm } from './PrjWorkPlanForm';
import { PrjWorkPlanProvider } from './PrjWorkPlanProvider';
import { PrjWorkPlanView } from './PrjWorkPlanView';
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
PrjWorkPlan.Form = PrjWorkPlanForm;
PrjWorkPlan.View = PrjWorkPlanView;
PrjWorkPlan.Decorator = PrjWorkPlanProvider;
PrjWorkPlan.Designer = PrjWorkPlanDesigner;
PrjWorkPlan.Initial = PrjWorkPlanInitializer
