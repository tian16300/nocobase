// 主要处理新建和编辑的场景

import React, { useEffect } from 'react';

import { SchemaComponent, SchemaComponentProvider, useFormBlockContext, useSchemaOptionsContext } from '@nocobase/client';

import { useForm } from '@formily/react';

import { useApprovalSettingContext } from '../AddProvalSetting';

export const SelectDataModel = (props) => {
  const {value} = props;
  const ctx = useFormBlockContext();
  const { scope, components } = useSchemaOptionsContext();
  const schema = {
    type: 'void',
    'x-componet': 'FormV2',
    'x-componet-props': {
      useProps: '{{ useFormBlockProps }}',
    },
    properties: {
      collection: {
        type: 'string',
        title: '选择模型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'CollectionSelect',
        'x-reactions': [
          {
            target: ['schemaConfig.form'],
            fullfill: {
              schema: {
                'x-decorator-props.resourceName': '{{ $self.value}}',
                'x-decorator-props.collection': '{{ $self.value}}',
                'x-acl-action': '{{$self.value+":create"}}',
              },
            },
          },
        ],
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
  };

  useEffect(()=>{
    ctx.form.setInitialValues(value);
  },[value]);
  return (
    <SchemaComponentProvider components={{ ...components }} scope={{ ...scope }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
