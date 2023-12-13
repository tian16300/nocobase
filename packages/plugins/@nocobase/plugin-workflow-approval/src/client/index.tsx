import { Plugin } from '@nocobase/client';
import { getApprovalAddPath, getApprovalDetailPath } from './hooks';
import { AddProvalSetting, ApprovalDetailPage } from './page';
import React from 'react';
import { useApprovalFormBlockProps } from './page/components';
import WorkflowPlugin from '@nocobase/plugin-workflow';
import { Approval } from './nodes';
import CopyTo from './nodes/copyTo';

export class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addComponents();
    this.addScopes();
    this.addRoutes();
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    /* 审批处理 */
    const approvalInstruction = new Approval();
    workflow.instructions.register(approvalInstruction.type, approvalInstruction as any);
    // /* 抄送处理 */
    const copyTo = new CopyTo();
    workflow.instructions.register(copyTo.type, copyTo as any);
   
 
   
    
  }
  addScopes() {
    this.app.addScopes({
      useApprovalFormBlockProps
    })
  }
  addComponents() {
    // this.app.addComponents({
    //   ApprovalSchemaConfigSetting
    // })
    this.app.addComponents({
      AddProvalSetting,
      ApprovalDetailPage
    });
  }
  addRoutes(){
    this.app.router.add('admin.workflow.approval.id', {
      path: getApprovalDetailPath(':id'),
      element: <ApprovalDetailPage />,
    });
    this.app.router.add('admin.workflow.approval.add', {
      path: getApprovalAddPath(),
      Component: AddProvalSetting
    });
  }
}

export default PluginWorkflowApprovalClient;
