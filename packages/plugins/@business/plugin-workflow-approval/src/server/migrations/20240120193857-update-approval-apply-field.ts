import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<=0.19.0-alpha.4';

  async up() {
    // coding
    const { db} = this.context;
    const repo = db.getRepository('fields');
    const field = await repo.findOne({
      filter: {
        name: 'status',
        collectionName: 'approval_apply',
      },
    });
    if (field) {
      await repo.update({
        filter:{
          key:  field.get('key')
        },
        values: {
          "uiSchema": {
            "enum": [
                {
                    "value": "-1",
                    "label": "待提交"
                },
                {
                    "value": "0",
                    "label": "审批中"
                },
                {
                    "value": "1",
                    "label": "已通过"
                },
                {
                    "value": "2",
                    "label": "已拒绝"
                },
                {
                    "value": "3",
                    "label": "已撤销"
                },
                {
                    "value": "4",
                    "label": "审批完成"
                }
            ],
            "type": "string",
            "x-component": "Select",
            "title": "审批状态"
        },
        "defaultValue": "-1"
        }
      });
    }

  }
}
