import { ActionInitializer } from '@nocobase/client';
import React from 'react';

export const InitBomApplyActionInitializer = (props) => {
  const schema = {
    'x-action': 'initBomApplyAction',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    title:'一键初始化',
    'x-component-props': {
      type:'primary',
      useProps: '{{ useInitBomApplyActionProps }}'
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
