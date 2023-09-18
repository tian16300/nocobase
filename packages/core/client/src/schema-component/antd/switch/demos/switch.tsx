/**
 * title: 勾选
 */
import { FormItem } from '@formily/antd-v5';
import { Switch, SchemaComponent, SchemaComponentProvider } from '@nocobase/client';
import React from 'react';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'boolean',
      title: `编辑模式`,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-reactions': {
        target: 'read',
        fulfill: {
          state: {
            value: '{{$self.value}}',
          },
        },
      },
    },
    read: {
      type: 'boolean',
      title: `阅读模式`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Switch, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
