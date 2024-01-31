import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.5';

  async up() {
    // coding
    const { db } = this.context;
    const repository = db.getRepository('fields');
    const model = await repository.findOne({
      filter: {
        collectionName: 'approval_results',
        name: 'userAction',
      },
    });
    if (model) {
      await repository.update({
        filter: {
          key: model.get('key'),
        },
        values: {
          options: {
            ...model.get('options'),
            uiSchema: {
              enum: [
                {
                  value: '0',
                  label: '申请',
                },
                {
                  value: '1',
                  label: '同意',
                },
                {
                  value: '2',
                  label: '拒绝',
                },
                {
                  value: '3',
                  label: '撤销',
                },
              ],
              type: 'string',
              'x-component': 'Select',
              title: '操作类型',
            },
          },
        },
      });
    }
  }
}
