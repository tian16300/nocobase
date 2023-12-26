import React from 'react';
import { ActionInitializer, useSchemaInitializerItem } from '@nocobase/client';

export const SyncAttenceActionInitializer = () => {
  const schema = {
    type: 'void',
    title: '{{ t("同步考勤") }}',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      type: 'primary',
      openMode: 'modal',
      openSize: 'small',
    },
    properties: {
      drawer1: {
        type: 'void',
        title: '同步月份考勤',
        'x-decorator': 'Form',
        'x-component': 'Action.Container',
        'x-component-props': {},
        properties: {
          start: {
            title: '选择开始时间',
            'x-decorator': 'FormItem',
            'x-component': 'DatePicker',
            'x-component-props': {
              dateFormat: 'YYYY-MM',
              showTime: false,
              gmt: true,
            },
          },
          f1: {
            type: 'void',
            'x-component': 'Action.Container.Footer',
            properties: {
              //   close1: {
              //     title: 'Close',
              //     'x-component': 'Action',
              //     'x-component-props': {
              //       useAction: '{{ useCloseAction }}',
              //     },
              //   },
              submit: {
                title: '提交',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ syncAttendceFromDingTalk }}',
                },
              },
            },
          },
        },
      },
    },
  };
  const itemConfig = useSchemaInitializerItem();
  return <ActionInitializer {...itemConfig} item={itemConfig} schema={schema} />;
};
