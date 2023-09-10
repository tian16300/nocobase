import { FormGrid } from '@formily/antd-v5';
import { ISchema } from '@formily/react';
import React from 'react';
import { SchemaComponent, SchemaComponentOptions } from '@nocobase/client';
import { usePrjWorkStaticForm } from './hooks';
export const PrjWorkPlanForm = (props: any) => {
  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormV2',
        'x-component-props': {
          useProps: '{{usePrjWorkStaticForm}}',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 4,
              minColumns: 3,
            },
            properties: {
              '[start, end]': {
                title: '日期范围',
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker.RangePicker',
                'x-component-props': {
                  showTime: false,
                },
                type: 'string',
              }
            },
          },
        },
      },
    },
  };
  return (
    <SchemaComponentOptions
      scope={{
        usePrjWorkStaticForm,
      }}
      components={{ FormGrid }}
    >
      <SchemaComponent schema={schema} />
    </SchemaComponentOptions>
  );
};
