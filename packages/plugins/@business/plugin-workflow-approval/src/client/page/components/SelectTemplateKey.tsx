import {
  APIClientProvider,
  CollectionProvider,
  Form,
  FormItem,
  FormProvider,
  IField,
  RemoteSchemaComponent,
  RemoteSelect,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useDesignable,
} from '@nocobase/client';
import React, { useEffect, useMemo, useState } from 'react';
import { ISchema, observer, useForm, useField, Schema } from '@formily/react';
import { uid } from '@nocobase/utils';
import { useApprovalSettingContext } from '../AddProvalSetting';
import { message } from 'antd';

const TemplateView = observer(
  (props: any) => {
    const form = useForm();
    const { designable } = useDesignable();
    const [uid, setUid] = useState(null);

    const [collection, setCollection] = useState(null);
    const api = useAPIClient();
    const {workflow, setUiTemplateKey} = useApprovalSettingContext();
    useEffect( () => {
      if (form.values?.uiTemplateKey) {
       api.resource('workflows').update({
            filterByTk: workflow.id,
            values: form.values,
          }).then((res) => {
            message.success('保存成功');
          });
      }
    }, [form.values?.uiTemplateKey]);
    return (
      <CollectionProvider name={collection}>
        <SchemaComponentProvider designable={designable}>
          <div>{uid ? <RemoteSchemaComponent uid={uid} /> : <></>}</div>
        </SchemaComponentProvider>
      </CollectionProvider>
    );
  },
  { displayName: 'TemplateView' },
);

export const SelectTemplateKey = (props) => {
  const [schema, setSchema] = useState<Schema>(null);
  const {workflow } = useApprovalSettingContext();
  useEffect(()=>{
   const _schema = new Schema({
    type: 'object',
    name:uid(),
    properties: {
      uiTemplateKey: {
        type: 'string',
        title: '触发区块',
        'x-component': 'RemoteSelect',
        'x-decorator': 'FormItem',
        'x-component-props': {
          service: {
            resource: 'uiSchemaTemplates',
            action: 'list',
            params: {
              filter: {
                collectionName: props?.collection,
                componentName: 'ReadPrettyFormItem',
              },
            },
          },
          fieldNames: {
            label: 'name',
            value: 'key',
          },
        },
        default: workflow?.uiTemplateKey
      },
      uiTemplateView: {
        type: 'void',
        'x-component': 'TemplateView',
        'x-decorator': 'FormItem',
        'x-reactions': [
          {
            dependencies: ['.uiTemplateKey'],
            fulfill: {
              state: {
                value: '{{$deps[0]}}',
              },
            },
          },
        ],
      },
    },
  })
  setSchema(_schema);

  },[props?.collection]);
  return (
    <>
      <div>
        <SchemaComponent components={{ RemoteSelect, Form, FormItem, TemplateView }} schema={schema} />
      </div>
    </>
  );
};
