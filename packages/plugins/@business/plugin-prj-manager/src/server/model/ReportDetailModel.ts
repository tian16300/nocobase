import { Model } from '@nocobase/database';
export class ReportDetailModel extends Model {
  updateReportDetail(options: { reportId: number; taskId: number; belongsPrjKey: number }) {
    // reportId 为 null 时 则 移除 不为null 时 根据 taskId 更新 belongsPrjKey

    

  }
  syncPrjIdFromTaskId(){

  }

}
