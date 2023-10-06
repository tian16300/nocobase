import { Migration } from '@nocobase/server';

export default class UpdateSystemSettingMigration extends Migration {
  async up() {
    const SystemSetting = this.context.db.getRepository('systemSettings');
    const setting = await SystemSetting.findOne();
    setting.set('logoId', 1);
    await setting.save();
  }
  async down() {}
}
