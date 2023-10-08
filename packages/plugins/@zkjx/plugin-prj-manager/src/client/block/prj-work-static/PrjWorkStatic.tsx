import React from 'react';
import { PrjWorkStaticInitializer } from './PrjWorkStaticInitializer';
import { PrjWorkStaticDesigner } from './PrjWorkStatic.Designer';
import { PrjWorkProvider } from './PrjWorkProvider';
import { PrjWorkStaticView } from './PrjWorkStaticView';

export const PrjWorkStatic = () => {
  return (
    <></>
  );
};
PrjWorkStatic.Wrap = ({ children }) => {
  return (<div className='prj-work-static-block'>{children}</div>)

}
PrjWorkStatic.View = PrjWorkStaticView;
PrjWorkStatic.Decorator = PrjWorkProvider;
PrjWorkStatic.Designer = PrjWorkStaticDesigner;
PrjWorkStatic.Initial = PrjWorkStaticInitializer
