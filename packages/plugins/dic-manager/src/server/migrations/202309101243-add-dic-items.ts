import { Migration } from '@nocobase/server';
const record = 
{
    "title": "项目阶段状态",
    "code": "prj_cycle_status",
    "items": [
        {
            "label": "未开始",
            "value": "1",
            "icon": "minuscircleoutlined",
            "color": "error"
        },
        {
            "label": "进行中",
            "value": "2",
            "icon": "clockcircleoutlined",
            "color": "warning"
        },
        {
            "label": "已完成",
            "value": "3",
            "icon": "checkcircleoutlined",
            "color": "success"
        },
        {
            "label": "关闭",
            "value": "4",
            "icon": "checkcircleoutlined",
            "color": "default"
        }
    ]
};
export default class AddDicItems0910  extends Migration {
  async up() {
    const rep = this.app.db.getRepository('dic');
    const isExist = await rep.findOne({
      filter: {
        code: 'prj_cycle_status'
      },
    });
    if(isExist) 
    return;
    await rep.create({
       values: record
    });

  }

  async down() {}
}
