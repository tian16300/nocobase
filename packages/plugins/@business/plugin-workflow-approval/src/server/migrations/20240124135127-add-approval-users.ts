import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.4';

  async up() {
    // coding
    const { db } = this.context;
    const repository = db.getRepository('fields');
    const model = await repository.findOne({
      filter:{
        collectionName:'approval_apply',
        name:'currentApprovalUsers'
      }
    });
    if(model.interface !=='m2m'){
      await repository.destroy({
        filter:{
          key: model.get('key')
        }
      });
      await repository.create({
        values:{
          foreignKey: 'approval_apply_id',
          otherKey: 'approval_user_id',
          name: 'currentApprovalUsers',
          type: 'belongsToMany',
          uiSchema: {
            'x-component': 'AssociationField',
            'x-component-props': {
              multiple: true,
              fieldNames: {
                label: 'nickname',
                value: 'id'
              },
            },
            title: '当前审批人',
          },
          interface: 'm2m',
          through: 'approval_users_mid',
          target: 'users'
        }
      });
    }
  }
}
