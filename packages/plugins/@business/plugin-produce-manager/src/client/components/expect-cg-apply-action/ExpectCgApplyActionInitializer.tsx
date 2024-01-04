import { ActionInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';

export const ExpectCgApplyActionInitializer = (props) => {
  const schema = {
    type: 'void',
    'x-action': 'create',
    'x-acl-action': 'create',
    title: "提交采购需求",
    'x-designer': 'ExpectCgApply.Action.Designer',
    'x-component': 'Action',
    'x-component-props': {
      openMode: 'drawer',
      type: 'primary',
      component: 'ExpectCgApply.Action',
      icon: 'PlusOutlined',
      openSize: 'large',
      isRecord: true,
      useAction: () => {
        return {
          run() {},
        };
      },
    }, 
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    properties: {
      drawer: {
        type: 'void',
        title: '{{ t("Add record") }}',
        'x-component': 'Action.Container',
        'x-component-props': {
          className: 'nb-action-popup',
        },
        properties: {
          tabs: {
            type: 'void',
            'x-component': 'Tabs',
            'x-component-props': {},
            'x-initializer': 'TabPaneInitializersForCreateFormBlock',
            properties: {
              tab1: {
                type: 'void',
                title: '{{t("Add new")}}',
                'x-component': 'Tabs.TabPane',
                'x-designer': 'Tabs.Designer',
                'x-component-props': {},
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'CreateFormBlockInitializers',
                    properties: {},
                  },
                }
              },
            }
          },
        },
      }
     
    },
  };
 
  const itemConfig = useSchemaInitializerItem();
  return <ActionInitializer {...itemConfig} item={itemConfig} schema={schema} />;
};
