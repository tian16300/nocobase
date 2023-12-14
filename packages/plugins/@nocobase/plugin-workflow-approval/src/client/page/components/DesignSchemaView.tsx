// 主要处理新建和编辑的场景

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormLayout } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import {
  CardItem,
  CollectionProvider,
  DefaultValueProvider,
  FormActiveFieldsProvider,
  FormProvider,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentOptions,
  SchemaComponentProvider,
  SchemaInitializerItemType,
  VariableScopeProvider,
  createDesignable,
  useAPIClient,
  useDesignable,
  useFormActiveFields,
  useFormBlockContext,
  useProps,
  useRequest,
  useSchemaComponentContext,
  useSchemaInitializerRender,
  useSchemaOptionsContext,
} from '@nocobase/client';

import { observer, useField, useFieldSchema, useForm, RecursionField, Schema } from '@formily/react';
import { useApprovalSettingContext } from '../AddProvalSetting';
import { lodash, uid } from '@nocobase/utils';
import { useFlowContext, useTrigger, useWorkflowVariableOptions } from '@nocobase/plugin-workflow/client';
import { Alert, Button, Modal, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../../locale';
import { FormBlockProvider } from './FormBlockProvider';
import { DetailsBlockProvider } from './DetailsBlockProvider';

// / NOTE: fake useAction for ui configuration
function useSubmit() {
  // const { values, submit, id: formId } = useForm();
  // const formSchema = useFieldSchema();
  return {
    run() {},
  };
}

export const DesignSchemaView = (props, ref) => {
  const { initialSchema, setInitialSchema, workflow, collection, uiTemplateKey } = useApprovalSettingContext();
  const { components } = useSchemaOptionsContext();
  const scope = useWorkflowVariableOptions();
  const ctx = useContext(SchemaComponentContext);
  const upLevelActiveFields = useFormActiveFields();
  const [schema, setSchema] = useState<Schema>(null);
  const [uiSchemaRecordUid, setUiSchemaRecordUid] = useState(null);

 
  const form = useMemo(() => {
    // const initialValues = fieldSchema?.['x-action-settings']?.assignedValues?.values;
    const initialValues = {};
    return createForm({
      initialValues: lodash.cloneDeep(initialValues),
      values: lodash.cloneDeep(initialValues),
    });
  }, []);
  // const nodeComponents = {};

  // const value = useContext(SchemaComponentContext);
  const api = useAPIClient();
  const uiRecordKey = useMemo(()=>{
    return uiTemplateKey;
  },[uiTemplateKey])
  useEffect(() => {  
    if (uiRecordKey) {
      api
        .resource('uiSchemaTemplates')
        .get({
          filterByTk: uiRecordKey,
        })
        .then((res) => {
          setUiSchemaRecordUid(res.data.data.uid);
          // setUiSchemaRecord(res.data.data);
        });
    }else{
      setSchema(
        new Schema({
          properties: {
            grid:initialSchema
          },
        }),
      );
    }
  }, [uiRecordKey]);
  
  const value = useMemo(()=>{
    const obj = {
      ...ctx,
      designable: !workflow.executed,
    };
    if(!uiRecordKey && schema){
      obj.refresh = ()=>{
        setInitialSchema(lodash.get(schema.toJSON(), 'properties.grid'));
      }   
    }else{

    }
    return obj;
  },[uiRecordKey]);
  return (
    <div>
      <CollectionProvider name={collection}>
        <DefaultValueProvider isAllowToSetDefaultValue={() => false}>
          <VariableScopeProvider scope={scope}>
            <FormActiveFieldsProvider name="form" getActiveFieldsName={upLevelActiveFields?.getActiveFieldsName}>
              <FormProvider form={form}>
                <FormLayout layout={'vertical'}>
                  <Alert
                    message={useLang(
                      'Values preset in this form will override user submitted ones when continue or reject.',
                    )}
                  />
                  <SchemaComponentContext.Provider
                    value={{...value}}
                  >
                    <SchemaComponentOptions
                      components={{
                        FormBlockProvider,
                        DetailsBlockProvider,
                        // NOTE: fake provider component
                        ManualActionStatusProvider(props) {
                          return props.children;
                        },
                        ActionBarProvider(props) {
                          return props.children;
                        },
                      }}
                      scope={{
                        useSubmit,
                        useDetailsBlockProps: useFormBlockContext,
                      }}
                    >
                      {uiSchemaRecordUid ? (
                        <RemoteSchemaComponent uid={uiSchemaRecordUid} />
                      ) : (
                        <>
                          {schema && (
                            <SchemaComponent
                              schema={schema}
                            />
                          )}
                        </>
                      )}
                    </SchemaComponentOptions>
                  </SchemaComponentContext.Provider>
                </FormLayout>
              </FormProvider>
            </FormActiveFieldsProvider>
          </VariableScopeProvider>
        </DefaultValueProvider>
      </CollectionProvider>
    </div>
  );
};
