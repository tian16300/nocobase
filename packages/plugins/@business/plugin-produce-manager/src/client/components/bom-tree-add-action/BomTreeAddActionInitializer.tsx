import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const BomTreeAddActionInitializer = (props) => {
  const schema = {
    'x-action': 'bomTreeAddAction',
    'x-component': 'Action',
    'x-designer': 'BomTreeAdd.Action.Design',
    title:'新增BOM',
    'x-component-props': {
      type:'primary',
      component: 'BomTreeAdd.Action',
      useAction: () => {
        return {
          run() {},
        };
      },
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
