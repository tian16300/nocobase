import { Plugin, SchemaInitializer, useCollection, useSchemaInitializer } from '@nocobase/client';
import { getApprovalDetailPath,  getApprovalSettingListPath, getApprovalSettingPath } from './hooks';
import { AddProvalSetting, ApprovalDetailPage, ApprovalSettingListPage } from './page';
import React from 'react';
import WorkflowPlugin from '@nocobase/plugin-workflow';
import { Approval } from './nodes';
import CopyTo from './nodes/copyTo';
import { Apply } from './blocks/apply-action';

import * as scopes from './scopes';
import * as components from './components';
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
    this.app.addScopes(scopes)
  }
  addComponents() {
    // this.app.addComponents({
    //   ApprovalSchemaConfigSetting
    // })
    this.app.addComponents({
      AddProvalSetting,
      ApprovalDetailPage,
      Apply,
      ...components
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
    /* 增加 我的审批 查看详情操作 */
    this.schemaInitializerManager.addItem(
      'TableActionColumnInitializers', // 示例，已存在的 schema initializer
      'actions.approvalView', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        title: '{{t("审批详情")}}',
        name:'approvalView',
        useVisible() {
          const collection = useCollection();
          return collection?.name === 'approval_apply';
        },
        Component: 'ApprovalViewActionInitializer',
      },
    );

     /* 增加 同意 拒绝 查看详情操作 */
     this.schemaInitializerManager.addItem(
      'FormActionInitializers', // 示例，已存在的 schema initializer
      'enableActions.agree', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        title: '{{t("同意")}}',
        name:'agree',
        useVisible() {
          const collection = useCollection();
          return collection?.name === 'approval_results';
        },
        Component: 'AgreeActionInitializer',
      },
    );
    this.schemaInitializerManager.addItem(
      'FormActionInitializers', // 示例，已存在的 schema initializer
      'enableActions.reject', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        title: '{{t("拒绝")}}',
        name:'reject',
        useVisible() {
          const collection = useCollection();
          return collection?.name === 'approval_results';
        },
        Component: 'RejectActionInitializer',
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
      path: getApprovalDetailPath(),
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
