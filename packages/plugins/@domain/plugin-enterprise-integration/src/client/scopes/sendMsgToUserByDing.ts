import { useAPIClient, useBlockRequestContext, useRecord } from '@nocobase/client';
import { message } from 'antd';
export const sendMsgToUserByDing = () => {
  const api = useAPIClient();
  // const { service } = useBlockRequestContext();
  const { dingUserId } = useRecord();
  return {
    confirm: {
      title: '工作通知',
      content: '确认发送消息给该用户？',
    },
    async onClick() {
      const url = 'notifications:sendMsgToUserByDing';
      if (dingUserId) {
        const res = await api.request({
          url,
          method: 'POST',
          data: {
            userIds: dingUserId,
            msg: {
              msgtype: 'action_card',
              action_card: {
                title: '系统发起的审批',
                markdown: 'BOM0001审批结果已通过',
                btn_orientation: '0',
                btn_json_list: [
                  {
                    title: '查看详情',
                    action_url: 'https://www.taobao.com',
                  },
                  {
                    title: '去审批',
                    action_url: 'https://www.tmall.com',
                  },
                ],
              },
            },
          },
        });
        if (res) {
          message.success(res.data?.data);
        }
      } else {
        message.warning('用户缺少钉钉用户号, 请到菜单 "企业信息>人员"同步钉钉用户ID');
      }
    },
  };
};
