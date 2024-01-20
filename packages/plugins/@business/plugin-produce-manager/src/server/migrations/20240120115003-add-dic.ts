import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.1';
  async up() {
    // coding
    const { db } = this.context;
    const repo = db.getRepository('dic');
    const existed = await repo.findOne({
      filter: {
        code: 'bom_apply_type',
      },
    });
    if (!existed) {
      await repo.create({
        values: {
          code: 'bom_apply_type',
          title: 'BOM类型',
          items: [
            {
              label: '电气标准件',
              value: '电气标准件',
              color: 'default',
              icon: null,
              remark: null,
            },
            {
              label: '机械标准件',
              value: '机械标准件',
              color: 'default',
              icon: null,
              remark: null,
            },
            {
              label: '机械加工件',
              value: '机械加工件',
              color: 'default',
            },
          ],
        },
      });
    }
  }
}
