import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.6';

  async up() {
    // coding
    const { db } = this.context;
     const repository = db.getRepository('fields');
     const exist = await repository.findOne({
       filter: {
         collectionName: 'approval_apply',
         name: 'copyToUsers',
       },
     });
     if (!exist) {
       await repository.create({
        values: {
          foreignKey: 'approval_apply_id',
          otherKey: 'copy_user_id',
          name: 'copyToUsers',
          type: 'belongsToMany',
          collectionName:'approval_apply',
          uiSchema: {
            'x-component': 'AssociationField',
            'x-component-props': {
              multiple: true,
              fieldNames: {
                label: 'id',
                value: 'id',
              },
            },
            title: '抄送人',
          },
          interface: 'm2m',
          through: 'approval_copy_users_mid',
          target: 'users'
        }
       });
     }
  }
}
