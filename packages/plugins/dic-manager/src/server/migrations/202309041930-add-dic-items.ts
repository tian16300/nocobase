import { Migration } from '@nocobase/server';
const record = 
{
    "title": "项目阶段",
    "code": "prj_cycle",
    "items": [
        {
            "label": "需求设计",
            "value": "1",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "方案设计",
            "value": "2",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "商务流程",
            "value": "3",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "细化设计",
            "value": "4",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "采购下单",
            "value": "5",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "厂内组装",
            "value": "6",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "厂内调试",
            "value": "7",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "出厂验收",
            "value": "8",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "物流",
            "value": "9",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "客方组装",
            "value": "10",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "客方调试",
            "value": "11",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "试运行",
            "value": "12",
            "icon": null,
            "color": "processing"
        },
        {
            "label": "终验收",
            "value": "13",
            "icon": null,
            "color": "processing"
        }
    ]
};
export default class extends Migration {
  async up() {
    const rep = this.app.db.getRepository('dic');
    const isExist = await rep.findOne({
      filter: {
        code: 'prj_cycle'
      },
    });
    if(isExist) 
    return;
    await rep.create({
       values: record
    });


    // await this.app.db.getRepository('roles').update({
    //   filter: {
    //     $or: [{ allowConfigure: true }, { name: 'root' }],
    //   },
    //   values: {
    //     snippets: ['ui.*', 'pm', 'pm.*'],
    //     allowConfigure: false,
    //   },
    // });

  }

  async down() {}
}
