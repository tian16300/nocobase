import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.19.0-alpha.6';

  async up() {
    // coding
    const { db } = this.context;
     const repository = db.getRepository('fields');
     const field = await repository.findOne({
       filter: {
         collectionName: 'approval_apply',
         name: 'status',
       },
     });
     if (field) {
      const { defaultValue, uiSchema, ...others } = field.options
      field.update({
        filter:{
          key: field.get('key')
        },
        values:{
          options:{
             ...others,
             uiSchema: {
              enum: [
                {
                  value: '-1',
                  label: '待审核',
                },
                {
                  value: '0',
                  label: '审批中',
                },
                {
                  value: '1',
                  label: '已通过',
                },
                {
                  value: '2',
                  label: '已拒绝',
                },
                {
                  value: '3',
                  label: '已撤销',
                },
                {
                  value: '4',
                  label: '审批完成',
                },
              ],
              type: 'string',
              'x-component': 'Select',
              title: '审批状态',
            }
          }
        }
      })
       
     }
  }
}
