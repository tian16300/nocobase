import { Plugin } from '@nocobase/client';
import { ApprovalListPage } from './components';

export class PluginApprovalWorkflowClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);   
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    // this.addPage();
  }
  addPage(){
    this.app.pluginSettingsManager.add('approval-workflow',{
      title: "审批设置", // 原 title
      icon: "teamoutlined", // 原 icon
      Component: ApprovalListPage,
      aclSnippet: 'pm.workflow.workflows'
    });
  }
}

export default PluginApprovalWorkflowClient;
