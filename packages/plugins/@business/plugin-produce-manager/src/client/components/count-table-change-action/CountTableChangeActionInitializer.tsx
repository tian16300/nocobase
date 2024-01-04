import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const CountTableChangeActionInitializer = (props) => {
  const schema = {
    'x-action': 'countTableChangeAction',
    'x-component': 'Action',
    'x-designer': 'CountTableChange.Action.Design',
    'x-component-props': {
      table: "明细",
      countTable: "统计",
      iconTable: 'nodeexpandoutlined',
      iconCountTable: 'nodecollapseoutlined',
      component: 'CountTableChange.Action',
      useAction: () => {
        return {
          run() {},
        };
      },
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
