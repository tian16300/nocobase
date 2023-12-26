import { useForm } from '@formily/react';
import { useAPIClient } from '@nocobase/client';
import { message } from 'antd';
export function useTestSystemActionToken() {
  // TODO: Implement the function
  const form = useForm();
  const api = useAPIClient();
  return {
    async onClick() {
      const values = form.values;
      const { options } = values;
      const appConfig = options?.appConfig;
      /**
       * 获取 token 的接口
       */
      api
        .resource('systemSettings')
        .getAccessToken(appConfig)
        .then((res) => {
          if (res.status == 200) {
            message.success(res.data.data);
          }
        });
    },
  };
}
