// 主要处理新建和编辑的场景

import React, { useEffect } from 'react';

import { FormProvider, IField, SchemaComponent, SchemaComponentProvider, useFormBlockContext, useSchemaOptionsContext } from '@nocobase/client';

import { useForm, useField } from '@formily/react';

import { useApprovalSettingContext } from '../AddProvalSetting';
export const useApprovalFormBlockProps = ()=>{
  const field: IField = useField();
  const {form,dataModel, setDataModel} = useApprovalSettingContext();

  useEffect(()=>{
    setDataModel(field?.value);
    
    console.log('useApprovalFormBlockProps 变化', field.value);

  },[])
  return {
    form,
    initialValues: dataModel
  };
}
export const SelectDataModel = () => {
  const schema = {
    type: 'object',
    'x-component': 'FormV2',
    'x-component-props': {
      useProps: '{{ useApprovalFormBlockProps }}'
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

  // useEffect(()=>{
  //   form.setInitialValues(value);
  // },[value]);
  return (
   
    <SchemaComponent schema={schema} />
  );
};
