import { ActionInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';

export const SaveBomActionInitializer = () => {
  const schema = {
    title: '保存BOM',
    'x-action': 'saveBom',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      type: 'primary',
      htmlType: 'submit',
      useProps: '{{ useSaveBomActionProps }}',
    },
    'x-action-settings': {
      triggerWorkflows: [],
    },
  };
  return <ActionInitializer schema={schema} />;
};
