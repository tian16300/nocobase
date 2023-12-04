import {
  AssociationField,
  CollectionManagerContext,
  CollectionProvider,
  DetailsBlockProvider,
  FormBlockProvider,
  FormV2,
  IField,
  PluginManagerContext,
  ReadPrettyFormItemInitializers,
  RecordBlockInitializers,
  SchemaComponent,
  SchemaComponentContext,
  useDesignable,
  useFormBlockProps,
  useParamsFromRecord,
  useSourceIdFromParentRecord,
} from '@nocobase/client';
import { Card } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import { ExecutionLink } from './ExecutionLink';
import { ExecutionResourceProvider } from './ExecutionResourceProvider';
import { WorkflowLink } from './WorkflowLink';
import OpenDrawer from './components/OpenDrawer';
import expressionField from './interfaces/expression';
import { instructions } from './nodes';
import { workflowSchema } from './schemas/workflows';
import { getTriggersOptions, triggers } from './triggers';
import { ExecutionStatusSelect } from './components/ExecutionStatusSelect';
import { approvalWorkflows } from './schemas/approvalWorkflows';
import { useField, useFieldSchema, useFormEffects } from '@formily/react';

// registerField(expressionField.group, 'expression', expressionField);

export const WorkflowContext = React.createContext({});

export function useWorkflowContext() {
  return useContext(WorkflowContext);
}

export function WorkflowPane(props) {
  const ctx = useContext(SchemaComponentContext);
  return (
    <Card bordered={false}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={workflowSchema}
          components={{
            WorkflowLink,
            ExecutionResourceProvider,
            ExecutionLink,
            OpenDrawer,
            ExecutionStatusSelect,
          }}
          scope={{
            getTriggersOptions,
          }}
        />
      </SchemaComponentContext.Provider>
    </Card>
  );
}
const getUiTemplates = () => {
 const field = useField();
 const collectionName = useMemo(()=>{
  const cField = field.query('bussinessCollectionName').take() as IField;
  return cField?.value;
 },[]) ;

  return {
    fieldNames: {
      label: 'name',
      value: 'key',
    },
    service: {
      resource: 'uiSchemaTemplates',
      action: 'list',
      params:{
        paginate: false,
        filter:{
          collectionName: collectionName
        }
      }
    },
  }

}
/**
 * 审批流程
 * @returns 
 */
export const ApprovalWorkflow  = ()=>{
  const value = useContext(SchemaComponentContext);
  const {designable} =  useDesignable();
  return (
    <Card bordered={false}>
      {/* <CollectionProvider name='workflows'> */}
      <SchemaComponentContext.Provider value={{ ...value, designable  }}>
        <SchemaComponent
          schema={approvalWorkflows}
          components={{
            WorkflowLink,
            ExecutionResourceProvider,
            ExecutionLink,
            OpenDrawer,
            ExecutionStatusSelect,
            FormV2,
            FormBlockProvider,
            ReadPrettyFormItemInitializers,
            RecordBlockInitializers
           

          }}
          scope={{
            getTriggersOptions,
            useFormBlockProps,
            useParamsFromRecord,
            useSourceIdFromParentRecord,
            getUiTemplates
          }}
        />
      </SchemaComponentContext.Provider>
      {/* </CollectionProvider> */}
    </Card>
  );
}



export const WorkflowProvider = (props) => {
  const pmCtx = useContext(PluginManagerContext);
  const cmCtx = useContext(CollectionManagerContext);
  return (
    <PluginManagerContext.Provider
      value={{
        components: {
          ...pmCtx?.components,
        },
      }}
    >
      <CollectionManagerContext.Provider
        value={{
          ...cmCtx,
          interfaces: {
            ...cmCtx.interfaces,
            expression: expressionField,
          },
        }}
      >
        <WorkflowContext.Provider value={{ triggers, instructions }}>{props.children}</WorkflowContext.Provider>
      </CollectionManagerContext.Provider>
    </PluginManagerContext.Provider>
  );
};
