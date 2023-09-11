import { FormGrid } from '@formily/antd-v5';
import { ISchema } from '@formily/react';
import React from 'react';
import { SchemaComponent, SchemaComponentOptions } from '@nocobase/client';
import { usePrjWorkPlanForm } from './hooks';
import { uid } from '@nocobase/utils';

export const PrjWorkPlanForm = (props: any) => {
  /**
   * 排序字段
   */
  const groupFields = [];
  /**
   * 分组字段
   */
  const sortFields = [];

  const schema: ISchema = {
    type: 'object',
    properties: {
      ['form_' + uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-component-props': {
          useProps: '{{usePrjWorkPlanForm}}',
        },
        properties: {
          ['form_grid_' + uid()]: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 4,
              minColumns: 4,
            },
            properties: {
              '[start, end]': {
                title: '日期范围',
                'x-decorator': 'FormItem',
                'x-decorator-props':{
                  gridSpan:3
                },
                'x-component': 'DatePicker.RangePicker',
                'x-component-props': {
                  showTime: false,
                },
                type: 'string',
              },
              'sort': {
                title: '排序',
                'x-decorator': 'FormItem',
                'x-decorator-props':{
                  gridSpan:1
                },
                'x-component': 'Select',
                'x-component-props': {
                  'multiple': false
                },
                enum: sortFields
              },
              'groupBy': {
                'title': '分组',
                'x-decorator': 'FormItem',
                'x-decorator-props':{
                  gridSpan:1
                },
                'x-component': 'Select',
                'x-component-props': {
                  'multiple': false
                },
                enum: groupFields

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
        usePrjWorkPlanForm,
      }}
      components={{ FormGrid }}
    >
      <SchemaComponent schema={schema} />
    </SchemaComponentOptions>
  );
};
