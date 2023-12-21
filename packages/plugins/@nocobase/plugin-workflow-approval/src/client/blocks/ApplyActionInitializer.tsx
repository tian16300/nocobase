import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const ApplyActionInitializer = (props) => {
  const schema = {
    title:'提交申请',
    'x-designer': 'Apply.Action.Design',
    'x-component': 'Action',
    'x-acl-action-props': {
        skipScopeCheck: true,
      },
    'x-component-props': {
      component: 'Apply.Action',
      useAction: () => {
        return {
          run() {},
        };
      },
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
