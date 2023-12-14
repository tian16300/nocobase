import { SchemaComponent, SchemaComponentContext, usePlugin } from '@nocobase/client';
import { Card } from 'antd';
import React, { useContext } from 'react';
import { ExecutionLink } from './ExecutionLink';
import { ExecutionResourceProvider } from './ExecutionResourceProvider';
import { WorkflowLink } from './WorkflowLink';
import OpenDrawer from './components/OpenDrawer';
import { workflowSchema } from './schemas/workflows';
import { ExecutionStatusSelect } from './components/ExecutionStatusSelect';
import WorkflowPlugin from '.';
import { approvalWorkflows } from './schemas/approvalWorkflows';
import { useApprovalWorkflowFormActionProps } from './useApprovalWorkflowFormActionProps';

export function WorkflowPane({ isApproval }) {
  const schema = isApproval ? approvalWorkflows : workflowSchema;
  const ctx = useContext(SchemaComponentContext);
  const { getTriggersOptions } = usePlugin(WorkflowPlugin);
  return (
    <Card bordered={false}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            WorkflowLink,
            ExecutionResourceProvider,
            ExecutionLink,
            OpenDrawer,
            ExecutionStatusSelect,
          }}
          scope={{
            getTriggersOptions,
            useApprovalWorkflowFormActionProps,

          }}
        />
      </SchemaComponentContext.Provider>
    </Card>
  );
}
