import { Plugin } from '@nocobase/client';
import { FormLayout } from '@formily/antd-v5';
import { DataItemSelectBlockProvider, DataSelectBlockProvider, PrjPlanCompareBlockProvider } from './provider';
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
  usePrjWorkPlanProcessData,
  usePrjWorkPlanTableBlockProps,
  useSaveOtherPrjPlanActionProps,
  useSavePrjPlanActionProps,
} from './block';

export class PluginPrjManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

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
      useDataItemSelectFormSelectOptionsProps

    });
    this.app.addComponents({
      DataItemSelect,
      DataSelect,
      FormLayout,
      PrjWorkPlan,
      PrjWorkStatic,
      PrjPlanCompare,
      BomPrjCost,
      PrjBomTree

    });
    this.app.addProviders([DataSelectBlockProvider, PrjPlanCompareBlockProvider,DataItemSelectBlockProvider]);
  }
}

export default PluginPrjManagerClient;
