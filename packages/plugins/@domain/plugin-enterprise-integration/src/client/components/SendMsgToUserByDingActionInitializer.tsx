import React from 'react';
import { ActionInitializer, BlockInitializer, useSchemaInitializerItem } from '@nocobase/client';

export const SendMsgToUserByDingActionInitializer = (props) => {
  const schema = {
    type: 'void',
    title: '{{ t("发送消息") }}',
    'x-action': 'sendMsgToUserByDing',
    name:'sendMsgToUserByDing',
    'x-component': 'Action.Link',
    'x-designer': 'Action.Designer',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      useProps:'{{ sendMsgToUserByDing }}'
    }
  };
  return <ActionInitializer {...props} schema={schema} />;
};
