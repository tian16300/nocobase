import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<=0.19.0-alpha.4';

  async up() {
    // coding
    const { db } = this.context;
    const repo = db.getRepository('fields');
    const existed = await repo.findOne({
      filter: {
        name: 'num',
        collectionName: 'basic_wl_info',
      },
    });
    if (!existed) {
      await repo.create({
        values: {
          name: 'num',
          type: 'bigInt',
          collectionName: 'basic_wl_info',
          uiSchema: {
            type: 'number',
            'x-component': 'InputNumber',
            'x-component-props': {
              stringMode: true,
              step: '1',
            },
            'x-validator': 'integer',
            title: '需求数量',
          },
          interface: 'integer',
        },
      });
    }
  }
}
