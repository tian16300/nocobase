import React from 'react';
import { ActionInitializer, useSchemaInitializerItem } from '@nocobase/client';

export const SyncUsersFromDingTalkActionInitializer = (props) => {
  const schema = {
    type: 'void',
    name: 'syncUsersFromDingTalk',
    'x-action': 'syncUsersFromDingTalk',
    title: '{{ t("钉钉同步员工") }}',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      type: 'default',
      useProps: '{{ syncUsersFromDingTalk }}'
    }
  };

  return <ActionInitializer {...props} schema={schema} />;
};
