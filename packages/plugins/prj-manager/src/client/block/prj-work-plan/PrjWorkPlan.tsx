import React from 'react';
import { PrjWorkStaticInitializer } from './PrjWorkStaticInitializer';
import { PrjWorkStaticDesigner } from './PrjWorkStatic.Designer';
import { PrjWorkPlanForm } from './PrjWorkPlanForm';
import { PrjWorkPlanProvider } from './PrjWorkPlanProvider';
import { PrjWorkStaticView } from './PrjWorkStaticView';

export const PrjWorkPlan = () => {
  return (
    <></>
  );
};
PrjWorkPlan.Wrap = ({ children }) => {
  return (<>{children}</>)

}
PrjWorkPlan.Form = PrjWorkPlanForm;
PrjWorkPlan.View = PrjWorkStaticView;
PrjWorkPlan.Decorator = PrjWorkPlanProvider;
PrjWorkPlan.Designer = PrjWorkStaticDesigner;


PrjWorkPlan.Initial = PrjWorkStaticInitializer
