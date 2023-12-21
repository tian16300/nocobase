import { Plugin, SchemaInitializer, useSchemaInitializer } from '@nocobase/client';
import { getApprovalDetailPath,  getApprovalSettingListPath, getApprovalSettingPath } from './hooks';
import { AddProvalSetting, ApprovalDetailPage, ApprovalSettingListPage } from './page';
import React from 'react';
import { useApprovalFormBlockProps } from './page/components';
import WorkflowPlugin from '@nocobase/plugin-workflow';
import { Approval } from './nodes';
import CopyTo from './nodes/copyTo';
import { SettingOutlined } from '@ant-design/icons';
// import { ApplyAction, useApplyFormActionProps, useApprovalApplyFormBlockProps } from './blocks/ApplyAction';
import { createActionForm } from './blocks/schema/createActionForm';
import { Apply } from './blocks/apply-action';
import { ApplyActionInitializer } from './blocks/ApplyActionInitializer';
// export * from './providers';
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
      useApprovalFormBlockProps,
      // useApprovalApplyFormBlockProps,
      // useApplyFormActionProps,

    })
  }
  addComponents() {
    // this.app.addComponents({
    //   ApprovalSchemaConfigSetting
    // })
    this.app.addComponents({
      AddProvalSetting,
      ApprovalDetailPage,
      Apply,
      ApplyActionInitializer
    });
    /* 增加提交申请操作 */
    this.schemaInitializerManager.addItem(
      'UpdateFormActionInitializers', // 示例，已存在的 schema initializer
      'enableActions.approval', // 向 otherBlocks 分组内添加 custom
      {
        name:'approval',
        type: 'item',
        title:'提交申请',
        Component:'ApplyActionInitializer',
      },
    );
 

  }
  addRoutes(){
    /**
     * 审批设置 列表界面
     */
    this.app.pluginSettingsManager.add('approvalSetting', {
      title: '审批设置',
      icon: 'SettingOutlined',
      Component: ()=>{
        return <ApprovalSettingListPage app={this.app} />
     },
     aclSnippet: 'pm.workflow.workflows',
    });
    this.app.router.add('admin.workflow.approval.id', {
      path: getApprovalDetailPath(':id'),
      element: <ApprovalDetailPage />,
    });
    this.app.router.add('admin.workflow.approvalSetting.form', {
      path: getApprovalSettingPath(),
      Component: ()=>{
        return <AddProvalSetting app={this.app} />
      },
    });

  }
}

export default PluginWorkflowApprovalClient;
