// 主要处理新建和编辑的场景

import React, { useEffect, useMemo, useState } from 'react';

import {
  CollectionProvider,
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
import { onFormValuesChange } from '@formily/core';
import { useForm, useField, Schema } from '@formily/react';

import { useApprovalSettingContext } from '../AddProvalSetting';
import { uid } from '@nocobase/utils';
export const useApprovalFormBlockProps = () => {
  const field: IField = useField();
  const { form, workflow,collection, setCollection } = useApprovalSettingContext();
  const ctx = useFormBlockContext();
  useEffect(() => {
    if (workflow?.config && ctx?.form) {
      ctx.form.setInitialValues({
        collection
      });
    }
  }, [workflow?.config]);
  useEffect(() => {
    const id = uid();
    ctx.form.addEffects(id, () => {
      onFormValuesChange((form)=>{
        const values = form.values;
       const {collection} = values;
       setCollection(collection);
      })
    });
    return () => {
      ctx.form.removeEffects(id);
    };
  }, []);
  return {
    form: ctx.form,
  };
};
const isCollectionDisabled = ()=>{
  const { workflow } = useApprovalSettingContext();
  const [disabled, setDisabled] = useState(false);
  useEffect(()=>{
    setDisabled(workflow?.id && workflow?.uiTemplateKey);
  },[workflow?.id, workflow?.uiTemplateKey])
  return {
    disabled
  };
};
export const SelectDataModel = () => {
  const { form,collection, workflow } = useApprovalSettingContext();
  const [schema, setSchema] = useState<any>(
    new Schema({
      name: uid(),
      type: 'void',
      properties: {
        [uid()]: {
          type: 'object',
          'x-decorator': 'FormBlockProvider',
          'x-decorator-props': {
            // collection: collection,
            isCusomeizeCreate: true,
          },
          'x-component': 'FormV2',
          'x-component-props': {
            useProps: '{{ useApprovalFormBlockProps  }}',
          },
          properties: {
            collection: {
              type: 'string',
              title: '选择模型',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'CollectionSelect',
              'x-component-props': {
                //  disabled: '{{isCollectionDisabled}}'
                 useProps:'{{isCollectionDisabled}}'
              }
            }
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
    
        {schema && <SchemaComponent schema={schema} scope={{useApprovalFormBlockProps, isCollectionDisabled}} />}
    
    </div>
  );
};
