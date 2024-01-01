import React from 'react';
import { Plugin, SchemaSettings, SchemaSettingsBlockTitleItem, SchemaSettingsDataTemplates, useCollection, useFormBlockContext, useSchemaInitializer } from '@nocobase/client';
import { TableOutlined } from '@ant-design/icons';
import * as comps from './component';
import * as scopes from './scopes';
// import { treeFormActionInitializers } from './component';
export class PluginCommonClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    // 增加分组table 链接
    this.addScopes();
    this.addComponents();
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.addSchemaInitials();
  }
  addComponents(){
    this.app.addComponents(comps)
  }
  addScopes(){
    this.app.addScopes(scopes)
  }
  async addSchemaInitials(){
    this.schemaInitializerManager.addItem(
      'BlockInitializers', 
      'dataBlocks.groupTable', 
      {
        type: 'item',
        name:'groupTable',
        title:'分组表格',
        Component:'GroupTable.Initializer'
      },
    );
    /* 树表单 */
    this.schemaInitializerManager.addItem(
      'BlockInitializers', 
      'dataBlocks.treeForm', 
      {
        type: 'item',
        name:'treeForm',
        title:'树表单',
        Component:'TreeForm.Initializer'
      },
    );
   
    this.schemaSettingsManager.add(new SchemaSettings({
      name:'TreeFormContentSettings',
      items:[]
    }));
    // const tableActionInitializers = this.app.schemaInitializerManager.get('TableActionInitializers');
    // tableActionInitializers?.add('enableActions.addNew', initializerData);


  }
  
}

export default PluginCommonClient;
