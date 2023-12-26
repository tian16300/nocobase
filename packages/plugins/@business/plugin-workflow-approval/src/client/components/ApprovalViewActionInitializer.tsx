import React from 'react';
import { ActionInitializer, BlockInitializer, useSchemaInitializerItem } from '@nocobase/client';

export const ApprovalViewActionInitializer = (props) => {
  const schema = {
    type: 'void',
    title: '{{ t("查看详情") }}',
    'x-action': 'view',
    name:'approvalView',
    'x-component': 'Action.Link',
    'x-designer': 'Action.Designer',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      useProps:'{{ useApprovalViewActionProps }}'
    }
  };
  return <ActionInitializer {...props} schema={schema} />;
};
