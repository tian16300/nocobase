import React from 'react';
import { PrjWorkStaticInitializer } from './PrjWorkStaticInitializer';
import { PrjWorkStaticDesigner } from './PrjWorkStatic.Designer';
import { PrjWorkStaticForm } from './PrjWorkStaticForm';
import { PrjWorkProvider } from './PrjWorkProvider';
import { PrjWorkStaticView } from './PrjWorkStaticView';

export const PrjWorkStatic = () => {
  return (
    <></>
  );
};
PrjWorkStatic.Wrap = ({ children }) => {
  return (<>{children}</>)

}
PrjWorkStatic.Form = PrjWorkStaticForm;
PrjWorkStatic.View = PrjWorkStaticView;
PrjWorkStatic.Decorator = PrjWorkProvider;
PrjWorkStatic.Designer = PrjWorkStaticDesigner;


PrjWorkStatic.Initial = PrjWorkStaticInitializer
