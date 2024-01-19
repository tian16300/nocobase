import React from 'react';
import { Plugin, SchemaSettings, SchemaSettingsBlockTitleItem, SchemaSettingsDataTemplates, useCollection, useFormBlockContext, useSchemaInitializer } from '@nocobase/client';
import { TableOutlined } from '@ant-design/icons';
import * as comps from './component';
import * as scopes from './scopes';
export * from './component';
export * from './scopes';
export * from './hooks';
import * as items from './initializers/components';
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
    this.addSchemaInitials();
  }
  addComponents(){
    this.app.addComponents({
      ...comps,
      ...items as any,
    })
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

    
    this.app.schemaInitializerManager.addItem('SubTableActionInitializers','enableActions.fullScreenAction',{
      type:'item',
      title:'全屏',
      Component: 'FullScreenActionInitializer'
    })

    this.app.schemaInitializerManager.addItem('SubTableActionInitializers','enableActions.selectFromSourceAction',{
      type:'item',
      title:'选择来源',
      Component: 'SelectFromSourceActionInitializer'
    })




  }
  
}

export default PluginCommonClient;
