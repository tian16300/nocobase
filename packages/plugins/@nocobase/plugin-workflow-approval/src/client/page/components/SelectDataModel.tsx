// 主要处理新建和编辑的场景

import React, { useEffect } from 'react';

import {
  FormProvider,
  IField,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaComponentProvider,
  css,
  useFormBlockContext,
  useSchemaOptionsContext,
} from '@nocobase/client';

import { useForm, useField } from '@formily/react';

import { useApprovalSettingContext } from '../AddProvalSetting';
export const useApprovalFormBlockProps = () => {
  const field: IField = useField();
  const { form, collection, setCollection, appends, setAppends } = useApprovalSettingContext();

  useEffect(() => {
    setCollection(field?.value);
  }, []);
  return {
    form,
    initialValues: {
      collection,
      appends
    },
  };
};
export const SelectDataModel = () => {
  const { form, collection, setCollection, appends, setAppends } = useApprovalSettingContext();
  const schema = {
    type: 'object',
    'x-component': 'FormV2',
    'x-component-props': {
      useProps: '{{ useApprovalFormBlockProps }}',
    },
    properties: {
      collection: {
        type: 'string',
        title: '选择模型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'CollectionSelect',
        default: collection,
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
          default:appends
        },
        'x-reactions': [
          {
            dependencies: ['collection'],
            fulfill: {
              state: {
                visible: '{{!!$deps[0]}}',
              },
            },
          }
        ],
      },
    },
  };
  return (
    <div className={css`
      width: 600px;
      margin: 0 auto;
      padding: 60px 40px;
    `}>
      <SchemaComponentOptions scope={{ useApprovalFormBlockProps }}>
        <SchemaComponent schema={schema} />
      </SchemaComponentOptions>
    </div>
  );
};
