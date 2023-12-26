import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const RejectActionInitializer = (props) => {
  const schema = {
    title:'拒绝',
    name:'reject',
    'x-action': 'approval_apply:reject',
    'x-designer': 'Action.Designer',
    'x-component': 'Action',
    'x-acl-action-props': {
        skipScopeCheck: true,
      },
    'x-component-props': {
      'useProps': '{{ useRejectActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
