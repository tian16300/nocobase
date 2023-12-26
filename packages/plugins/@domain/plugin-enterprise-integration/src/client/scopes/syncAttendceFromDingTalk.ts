import { useAPIClient, useActionContext, useBlockRequestContext } from '@nocobase/client';
import { useForm } from '@formily/react';
import { useState } from 'react';
import { dayjs } from '@nocobase/utils';
import { Button, message, Space } from 'antd';

export const syncAttendceFromDingTalk = () => {
  const api = useAPIClient();
  const { service } = useBlockRequestContext();
  const form = useForm();
  const { setVisible } = useActionContext();
  const [loading, setLoading] = useState(false);
  return {
    loading,
    async run() {
      setLoading(true);
      form.submit((values) => {
        const start = dayjs(values.start).format('YYYY-MM-DD');
        api
          .resource('systemSettings')
          .syncAttendData({ start })
          .then((res) => {
            setLoading(false);
            if (res.status == 200 && res.data.data) {
              message.success('考勤数据同步成功');
              setVisible(false);
              service?.refresh();
              // if (res.data.data.success) {
              // message.success('考勤数据同步成功');
              // setVisible(false);
              // } else if (res.data.data.message) {
              // message.warning(res.data.data.message);
              // }
            }
          });
      });
    },
  };
};
