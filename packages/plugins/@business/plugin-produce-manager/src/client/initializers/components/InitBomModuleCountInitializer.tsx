import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const InitBomModuleCountInitializer = (props) => {
  const schema = {
    'x-action': 'bomModuleCountAction',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-action-settings': {},
    title: '模块统计',
    'x-component-props': {
      type: 'default',
      confirm: {
        title: 'Perform the {{title}}',
        content: 'Are you sure you want to perform the {{title}} action?',
      },
      useAction: '{{ useInitBomModuleCountAction }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
