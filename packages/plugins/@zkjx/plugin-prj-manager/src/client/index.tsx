import { Plugin } from '@nocobase/client';
import { FormLayout } from '@formily/antd-v5';
import { DataSelectBlockProvider, PrjPlanCompareBlockProvider } from './provider';
import {
  DataSelect,
  PrjPlanCompare,
  PrjWorkPlan,
  PrjWorkStatic,
  useDataSelectBlockContext,
  useDataSelectTabsProps,
  useFormSelectBlockProps,
  useFormSelectOptionsProps,
  usePrjPlanCompareOptionsProps,
  usePrjPlanCompareTableBlockProps,
  usePrjWorkPlanProcessData,
  usePrjWorkPlanTableBlockProps,
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
    });
    this.app.addComponents({
      DataSelect,
      FormLayout,
      PrjWorkPlan,
      PrjWorkStatic,
      PrjPlanCompare,
    });
    this.app.addProvider(DataSelectBlockProvider);
    this.app.addProvider(PrjPlanCompareBlockProvider);
  }
}

export default PluginPrjManagerClient;
