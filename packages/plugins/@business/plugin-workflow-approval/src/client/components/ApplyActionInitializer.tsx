import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const ApplyActionInitializer = (props) => {
  const schema = {
    title: '提交审核',
    name: 'approvalApply',
    'x-action': 'approval_apply:create',
    'x-designer': 'Action.Designer',
    'x-component': 'Apply.Action',
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    'x-component-props': {
      confirm: {
        title: 'Perform the {{title}}',
        content: 'Are you sure you want to perform the {{title}} action?',
      },
      useAction: "{{ useApprovalAction }}"
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
