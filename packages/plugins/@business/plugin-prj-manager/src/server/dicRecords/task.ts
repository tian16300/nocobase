export default [
  {
    title: '任务状态',
    code: 'task_status',
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
  },
];
