import React from 'react';
import { Plugin, useSchemaInitializer } from '@nocobase/client';
import { TableOutlined } from '@ant-design/icons';
import * as comps from './component';
import * as scopes from './scopes';
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
      'BlockInitializers', // 示例，已存在的 schema initializer
      'dataBlocks.groupTable', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        name:'groupTable',
        title:'分组表格',
        Component:'GroupTable.Initializer'
      },
    );
  }
}

export default PluginCommonClient;
