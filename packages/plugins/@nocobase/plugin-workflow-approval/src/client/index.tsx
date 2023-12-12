import { Plugin } from '@nocobase/client';
import { getApprovalAddPath, getApprovalDetailPath } from './hooks';
import { AddProvalSetting, ApprovalDetailPage } from './page';
import React from 'react';
import { ApprovalSchemaConfigSetting, useApprovalFormBlockProps, useApprovalSchemaSettingProps } from './page/components';

export class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addScopes({
      useApprovalFormBlockProps,
      useApprovalSchemaSettingProps
    })
    this.app.addComponents({
      ApprovalSchemaConfigSetting
    })
    this.app.router.add('admin.workflow.approval.id', {
      path: getApprovalDetailPath(':id'),
      element: <ApprovalDetailPage />,
    });
    this.app.router.add('admin.workflow.approval.add', {
      path: getApprovalAddPath(),
      Component: AddProvalSetting
    });
    this.app.addComponents({
      AddProvalSetting,
      ApprovalDetailPage
    });
    
  }
}

export default PluginWorkflowApprovalClient;
