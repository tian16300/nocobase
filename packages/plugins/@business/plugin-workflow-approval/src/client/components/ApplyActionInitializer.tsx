import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const ApplyActionInitializer = (props) => {
  const schema = {
    title:'提交申请',
    name:'approvalApply',
    'x-action': 'approval_apply:create',
    'x-designer': 'Action.Designer',
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
