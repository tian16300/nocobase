import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const SaveBomApplyActionInitializer = (props) => {
  const schema = {
    title: '提交BOM审核',
    'x-action': 'saveBomApply',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      type: 'primary',
      htmlType: 'submit',
      useProps: '{{ useCreateActionProps }}',
    },
    'x-action-settings': {
      triggerWorkflows: [],
    },
  };
  return <ActionInitializer schema={schema} />;
};
