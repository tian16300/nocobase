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
         collectionName: 'approval_apply',
         name: 'applyResults',
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
             onDelete: 'CASCADE'
           },
         },
       });
     }
  }
}
