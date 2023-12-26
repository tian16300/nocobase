import { Migration } from '@nocobase/server';

export default class DropOtherMigration extends Migration {
  async up() {
    const collectionName = 't_93qg78j4pdu';
    const repo = this.context.db.getCollection(collectionName);
    if (repo) {
      const existed = await repo.existsInDb();
      if (existed) {
        await repo.removeFromDb();
        await this.context.db.sync();
      }
    }
  }
  async down() {}
}
