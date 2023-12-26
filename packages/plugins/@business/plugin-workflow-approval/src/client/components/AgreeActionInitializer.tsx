import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const AgreeActionInitializer = (props) => {
  const schema = {
    title:'同意',
    name:'agree',
    'x-action': 'approval_apply:agree',
    'x-designer': 'Action.Designer',
    'x-component': 'Action',
    'x-acl-action-props': {
        skipScopeCheck: true,
      },
    'x-component-props': {
      'useProps': '{{ useAgreeActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
