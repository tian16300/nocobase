import { createForm } from '@formily/core';
import { RecursionField, Schema, useField, useFieldSchema } from '@formily/react';
import { Spin } from 'antd';
import _, { isEmpty, pick } from 'lodash';
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useCollection } from '../collection-manager';
import { RecordProvider, useRecord } from '../record-provider';
import { useActionContext, useDesignable } from '../schema-component';
import { Templates as DataTemplateSelect } from '../schema-component/antd/form-v2/Templates';
import { BlockProvider, useBlockRequestContext, useFilterByTk, useParamsFromRecord } from './BlockProvider';
import { getValuesByPath } from '@nocobase/utils/client';
import { FormActiveFieldsProvider } from './hooks';
import { TemplateBlockProvider } from './TemplateBlockProvider';

export const FormBlockContext = createContext<any>({});

const InternalFormBlockProvider = (props) => {
  const { action, readPretty, params, association } = props;
  const field = useField();
  const form = useMemo(
    () =>
      createForm({
        readPretty,
      }),
    [readPretty],
  );
  const { resource, service, updateAssociationValues } = useBlockRequestContext();
  const formBlockRef = useRef();
  const record = useRecord();
  const formBlockValue = useMemo(() => {
    return {
      params,
      action,
      form,
      // update 表示是表单编辑区块，create 表示是表单新增区块
      type: action === 'get' ? 'update' : 'create',
      field,
      service,
      resource,
      updateAssociationValues,
      formBlockRef,
    };
  }, [action, field, form, params, resource, service, updateAssociationValues]);

  if (service.loading && Object.keys(form?.initialValues)?.length === 0 && action) {
    return <Spin />;
  }
  let content = (
    <div ref={formBlockRef}>
      <RenderChildrenWithDataTemplates form={form} />
    </div>
  );
  if (readPretty) {
    content = (
      <RecordProvider parent={isEmpty(record?.__parent) ? record : record?.__parent} record={service?.data?.data}>
        {content}
      </RecordProvider>
    );
  } else if (
    formBlockValue.type === 'create' &&
    // 关系表单区块的 record 应该是空的，因为其是一个创建数据的表单；
    !_.isEmpty(_.omit(record, ['__parent', '__collectionName'])) &&
    // association 不为空，说明是关系区块
    association
  ) {
    content = (
      <RecordProvider parent={record} record={{}}>
        {content}
      </RecordProvider>
    );
  }

  return <FormBlockContext.Provider value={formBlockValue}>{content}</FormBlockContext.Provider>;
};

/**
 * 获取表单区块的类型：update 表示是表单编辑区块，create 表示是表单新增区块
 * @returns
 */
export const useFormBlockType = () => {
  const ctx = useFormBlockContext() || {};
  return { type: ctx.type } as { type: 'update' | 'create' };
};

export const useIsDetailBlock = () => {
  const ctx = useActionContext();
  return !(ctx?.fieldSchema?.['x-acl-action'] === 'create' || ctx?.fieldSchema?.['x-action'] === 'create');
};

export const FormBlockProvider = (props) => {
  const record = useRecord();
  const { collection, isCusomeizeCreate } = props;
  const { __collection } = record;
  const currentCollection = useCollection();
  const { designable } = useDesignable();
  const isDetailBlock = useIsDetailBlock();
  let detailFlag = false;
  if (isDetailBlock) {
    detailFlag = true;
    if (!designable && __collection) {
      detailFlag = __collection === collection;
    }
  }
  const createFlag =
    (currentCollection.name === (collection?.name || collection) && !isDetailBlock) || !currentCollection.name;
  /* */
  const params = { ...props.params };
  return (
    (detailFlag || createFlag || isCusomeizeCreate) && (
      <TemplateBlockProvider>
        <BlockProvider name={props.name || 'form'} {...props} block={'form'}>
          <FormActiveFieldsProvider name="form">
            <InternalFormBlockProvider {...props} />
          </FormActiveFieldsProvider>
        </BlockProvider>
      </TemplateBlockProvider>
    )
  );
};

export const useFormBlockContext = () => {
  return useContext(FormBlockContext);
};

export const useFormBlockProps = () => {
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema: actionFieldSchema } = useActionContext();
  const fieldSchema = actionFieldSchema?actionFieldSchema: useFieldSchema();
  const addChild = fieldSchema?.['x-component-props']?.addChild;
  const inheritsKeys = fieldSchema?.['x-component-props']?.inheritsKeys||[];
  const { type } = useFormBlockType()
 

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(ctx.service?.data?.data);
    }
  }, [ctx?.service?.loading]);
  useEffect(() => {
    if(type == 'update')
    ctx?.service?.run();
  }, [JSON.stringify(record), type]);
  useEffect(() => {
    if(type == 'create'){
      if (addChild) {
      ctx.form?.query('parent').take((field) => {
        // field.readPretty = true;
        field.value = new Proxy({ ...record }, {});
      });
    }
    if (inheritsKeys) {
      inheritsKeys.forEach(key => {
        ctx.form?.query(key).take((field) => {
          const value = record[key];
          if(value && typeof value == 'object'){
            // field.readPretty = true;
            field.value = new Proxy({ ...value }, {});
          }
        });
      });
    }

    }
    
  },[JSON.stringify(record), type, addChild, inheritsKeys]);
  return {
    form: ctx.form
  };
};

const RenderChildrenWithDataTemplates = ({ form }) => {
  const FieldSchema = useFieldSchema();
  const { findComponent } = useDesignable();
  const field = useField();
  const Component = findComponent(field.component?.[0]) || React.Fragment;
  return (
    <Component {...field.componentProps}>
      <DataTemplateSelect style={{ marginBottom: 18 }} form={form} />
      <RecursionField schema={FieldSchema} onlyRenderProperties />
    </Component>
  );
};

export const findFormBlock = (schema: Schema) => {
  while (schema) {
    if (schema['x-decorator'] === 'FormBlockProvider') {
      return schema;
    }
    schema = schema.parent;
  }
  return null;
};
