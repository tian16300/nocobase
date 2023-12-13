// 主要处理新建和编辑的场景

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormLayout } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import {
  CardItem,
  CollectionProvider,
  DefaultValueProvider,
  FormActiveFieldsProvider,
  FormProvider,
  SchemaComponent,
  SchemaComponentContext,
  SchemaComponentOptions,
  SchemaComponentProvider,
  SchemaInitializerItemType,
  VariableScopeProvider,
  createDesignable,
  useDesignable,
  useFormActiveFields,
  useFormBlockContext,
  useProps,
  useSchemaComponentContext,
  useSchemaInitializerRender,
  useSchemaOptionsContext,
} from '@nocobase/client';

import { observer, useField, useFieldSchema, useForm, RecursionField, Schema } from '@formily/react';
import { useApprovalSettingContext } from '../AddProvalSetting';
import { lodash, uid } from '@nocobase/utils';
import { useFlowContext, useTrigger, useWorkflowVariableOptions } from '@nocobase/plugin-workflow/client';
import { Alert, Button, Modal, Space } from 'antd';
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
  const { initialSchema, setInitialSchema, workflow } = useApprovalSettingContext();
  const { components } = useSchemaOptionsContext();
  const scope = useWorkflowVariableOptions();
  const ctx = useContext(SchemaComponentContext);
  const upLevelActiveFields = useFormActiveFields();
  const [schema, setSchema] = useState<Schema>();

  useEffect(() => {
    setSchema(
      new Schema({
        properties: {
          grid: initialSchema,
        },
      }),
    );
  }, [initialSchema]);
  const form = useMemo(() => {
    // const initialValues = fieldSchema?.['x-action-settings']?.assignedValues?.values;
    const initialValues = {};
    return createForm({
      initialValues: lodash.cloneDeep(initialValues),
      values: lodash.cloneDeep(initialValues),
    });
  }, []);
  const nodeComponents = {};
 
  return (
    <div>
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
                <br />
                {schema && (
                  <SchemaComponentContext.Provider
                    value={{
                      ...ctx,
                      designable: !workflow.executed,
                      refresh() {
                        setInitialSchema(lodash.get(schema.toJSON(), 'properties.grid'));
                      },
                    }}
                  >
                    <SchemaComponent schema={schema} components={{
                      FormBlockProvider,
                      DetailsBlockProvider,
                      // NOTE: fake provider component
                      ManualActionStatusProvider(props) {
                        return props.children;
                      },
                      ActionBarProvider(props) {
                        return props.children;
                      },
                      // ManualActionDesigner,
                    }}
                    scope={{
                      useSubmit,
                      useDetailsBlockProps: useFormBlockContext,
                    }}
                    />
                  </SchemaComponentContext.Provider>
                )}
              </FormLayout>
            </FormProvider>
          </FormActiveFieldsProvider>
        </VariableScopeProvider>
      </DefaultValueProvider>
    </div>
  );
};
