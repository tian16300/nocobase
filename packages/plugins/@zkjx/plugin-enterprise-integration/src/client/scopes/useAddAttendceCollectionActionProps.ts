import { useForm } from '@formily/react';
import { useAPIClient } from '@nocobase/client';
import { message } from 'antd';
export function useAddAttendceCollectionActionProps() {
  // TODO: Implement the function
  const api = useAPIClient();
  return {
    async onClick() {
      /**
       * 获取 token 的接口
       */
      api
        .resource('systemSettings')
        .addAttendCollection()
        .then((res) => {
          if (res.status == 200 && res.data.data) {
            if (res.data.data.success) {
              message.success('考勤表创建成功');
            }else if(res.data.data.message){
                message.warning(res.data.data.message); 
            }
          }
        });
    },
  };
}
