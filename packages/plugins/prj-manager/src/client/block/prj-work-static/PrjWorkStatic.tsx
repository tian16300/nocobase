import React from 'react';
import { SchemaComponent, SchemaComponentProvider } from '@nocobase/client';
import { PrjWorkStaticInitializer } from './PrjWorkStaticInitializer';
import { PrjWorkStaticDesigner } from './PrjWorkStatic.Designer';
import { PrjWorkStaticForm } from './PrjWorkStaticForm';
import { PrjWorkStaticShow } from './PrjWorkStaticShow';
import { PrjWorkProvider } from './PrjWorkProvider';

const schema = {
  type: 'void',
  properties: {
    condition: {
       type: 'object',
       'x-component': 'PrjWorkStaticForm'
    },
    dataBlock: {
      type: 'void',
      'x-component': 'PrjWorkStaticShow',
    }
  }
};

const components = {
  PrjWorkStaticForm,
  PrjWorkStaticShow
};

export const PrjWorkStatic = () => {
  return (
    <SchemaComponentProvider components={components}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
PrjWorkStatic.Decorator = PrjWorkProvider;
PrjWorkStatic.Designer = PrjWorkStaticDesigner;


PrjWorkStatic.Initial = PrjWorkStaticInitializer
