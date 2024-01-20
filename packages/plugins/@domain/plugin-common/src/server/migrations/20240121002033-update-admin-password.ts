import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<=0.19.0-alpha.4';

  async up() {
    // coding
    const { db } = this.context;
    await db.getRepository('users').update({
      filter:{
        email: 'admin@nocobase.com'
      },
      values:{
        password:'admin123'
      }
    })
  }
}
