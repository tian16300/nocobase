import { Migration } from '@nocobase/server';
const cycleRecord = {
  title: '项目阶段',
  code: 'prj_cycle',
  items: [
    {
      label: '需求设计',
      value: '1',
      icon: null,
      color: 'processing',
    },
    {
      label: '方案设计',
      value: '2',
      icon: null,
      color: 'processing',
    },
    {
      label: '商务流程',
      value: '3',
      icon: null,
      color: 'processing',
    },
    {
      label: '细化设计',
      value: '4',
      icon: null,
      color: 'processing',
    },
    {
      label: '采购下单',
      value: '5',
      icon: null,
      color: 'processing',
    },
    {
      label: '厂内组装',
      value: '6',
      icon: null,
      color: 'processing',
    },
    {
      label: '厂内调试',
      value: '7',
      icon: null,
      color: 'processing',
    },
    {
      label: '出厂验收',
      value: '8',
      icon: null,
      color: 'processing',
    },
    {
      label: '物流',
      value: '9',
      icon: null,
      color: 'processing',
    },
    {
      label: '客方组装',
      value: '10',
      icon: null,
      color: 'processing',
    },
    {
      label: '客方调试',
      value: '11',
      icon: null,
      color: 'processing',
    },
    {
      label: '试运行',
      value: '12',
      icon: null,
      color: 'processing',
    },
    {
      label: '终验收',
      value: '13',
      icon: null,
      color: 'processing',
    },
  ],
};

const cycleStatusRecord = {
  title: '项目阶段状态',
  code: 'prj_cycle_status',
  items: [
    {
      label: '未开始',
      value: '1',
      icon: 'minuscircleoutlined',
      color: 'error',
    },
    {
      label: '进行中',
      value: '2',
      icon: 'clockcircleoutlined',
      color: 'warning',
    },
    {
      label: '已完成',
      value: '3',
      icon: 'checkcircleoutlined',
      color: 'success',
    },
    {
      label: '关闭',
      value: '4',
      icon: 'checkcircleoutlined',
      color: 'default',
    },
  ],
};
export default class AddDicItems0904 extends Migration {
  async up() {
    const rep = this.app.db.getRepository('dic');
    let result = await rep.findOne({
      filter: {
        code: 'prj_cycle',
      },
    });
    if (!result) {
      await rep.create({
        values: cycleRecord,
      });
    }

    result = await rep.findOne({
      filter: {
        code: 'prj_cycle_status',
      },
    });
    if (!result) {
      await rep.create({
        values: cycleStatusRecord,
      });
    }
  }

  async down() {}
}
