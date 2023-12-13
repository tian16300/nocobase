// 主要处理新建和编辑的场景

import React, { useEffect, useMemo, useState } from 'react';

import {
  FormBlockContext,
  FormProvider,
  IField,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaComponentProvider,
  css,
  useFormBlockContext,
  useSchemaOptionsContext,
} from '@nocobase/client';

import { useForm, useField, Schema } from '@formily/react';

import { useApprovalSettingContext } from '../AddProvalSetting';
import { uid } from '@nocobase/utils';
export const useApprovalFormBlockProps = () => {
  const field: IField = useField();
  const { form, workflow } = useApprovalSettingContext();
  const ctx = useFormBlockContext();
  useEffect(() => {
    if(workflow?.config){
      ctx.form?.setInitialValues(workflow.config);
    }
  }, [workflow?.config]);
  return {
    form:ctx.form
  };
};
export const SelectDataModel = () => {
  const { form, collection, setCollection, appends, setAppends, workflow } = useApprovalSettingContext();
  const [schema, setSchema] = useState<any>(
    new Schema({
      name: uid(),
      type: 'void',
      'x-decorator':'FormBlockProvider',
      'x-decorator-props':{
        collection:'workflows',
        resourceName:'workflows',
        action:'get',
        'params':{
          filterByTk: workflow?.id,
        }
      },
      properties: {
        form: {
          type: 'object',
          'x-component': 'FormV2',
          'x-component-props': {
             useProps:'{{ useApprovalFormBlockProps }}',
          },
          properties: {
            collection: {
              type: 'string',
              title: '选择模型',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'CollectionSelect',
         
            },
            appends: {
              type: 'array',
              title: '待使用关系数据',
              'x-decorator': 'FormItem',
              'x-component': 'AppendsTreeSelect',
              'x-component-props': {
                title: 'Preload associations',
                multiple: true,
                useCollection() {
                  const { values } = useForm();
                  setCollection(values?.collection);
                  setAppends(values?.appends);
                  return values?.collection;
                },
              },
              'x-reactions': [
                {
                  dependencies: ['collection'],
                  fulfill: {
                    state: {
                      visible: '{{!!$deps[0]}}',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    } as any),
  );

 
 
  return (
    <div
      className={css`
        width: 600px;
        margin: 0 auto;
        padding: 60px 40px;
      `}
    >
     {schema && <SchemaComponent schema={schema} scope={useApprovalFormBlockProps}  />}
     
    </div>
  );
};
