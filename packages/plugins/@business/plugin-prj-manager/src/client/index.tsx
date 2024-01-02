import { Plugin, SchemaInitializer } from '@nocobase/client';
import { FormLayout } from '@formily/antd-v5';
import {
  BomPrjCost,
  DataItemSelect,
  DataSelect,
  PrjBomTree,
  PrjPlanCompare,
  PrjWorkPlan,
  PrjWorkStatic,
  useCreatePrjPlanActionProps,
  useDataItemSelectFormSelectBlockProps,
  useDataItemSelectFormSelectOptionsProps,
  useDataSelectBlockContext,
  useDataSelectTabsProps,
  useFormSelectBlockProps,
  useFormSelectOptionsProps,
  usePrjPlanCompareOptionsProps,
  usePrjPlanCompareTableBlockProps,
  usePrjTabsProps,
  usePrjWorkPlanProcessData,
  usePrjWorkPlanTableBlockProps,
  useSaveOtherPrjPlanActionProps,
  useSavePrjPlanActionProps,
} from './block';
import { prjRecordBlockInitializers } from './initializers';
import * as items from './initializers/items';
export class PluginPrjManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {
    
  }

  // You can get and modify the app instance here
  async load() {
    this.app.addScopes({
      useFormSelectBlockProps,
      useFormSelectOptionsProps,
      useDataSelectBlockContext,
      useDataSelectTabsProps,
      usePrjPlanCompareOptionsProps,
      usePrjPlanCompareTableBlockProps,
      usePrjWorkPlanProcessData,
      usePrjWorkPlanTableBlockProps,
      useCreatePrjPlanActionProps,
      useSaveOtherPrjPlanActionProps,
      useSavePrjPlanActionProps,
      useDataItemSelectFormSelectBlockProps,
      useDataItemSelectFormSelectOptionsProps,
      usePrjTabsProps

    });
    this.app.addComponents({
      DataItemSelect,
      DataSelect,
      FormLayout,
      PrjWorkPlan,
      PrjWorkStatic,
      PrjPlanCompare,
      BomPrjCost,
      PrjBomTree,
      ...items

    });
    this.addSchemaInitializers();
  }
  addSchemaInitializers(){
    const blockInitializers = this.app.schemaInitializerManager.get('BlockInitializers');    
    // blockInitializers?.add('dataBlocks.dataItemSelectBlock', {
    //   icon: 'CheckSquareOutlined',
    //   title: '下拉列表',
    //   Component: 'DataItemSelect.initializer'
    // });
    blockInitializers?.add('otherBlocks.dataSelectBlock', {
      icon: 'CheckSquareOutlined',
      title: '项目详情',
      Component: 'DataSelect.initializer'
    });
    blockInitializers?.add('otherBlocks.prjPlanCompareBlock', {
      icon: 'CheckSquareOutlined',
      title: '计划对比',
      Component: 'PrjPlanCompare.initializer'
    });
   this.app.schemaInitializerManager.add(prjRecordBlockInitializers);


  }
}

export default PluginPrjManagerClient;
