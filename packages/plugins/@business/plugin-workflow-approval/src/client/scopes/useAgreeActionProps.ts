import { JOB_STATUS } from '@nocobase/plugin-workflow/client';
import { useApprovalContext } from '../page';
import {  useAPIClient, useFormBlockContext } from '@nocobase/client';
import { message } from 'antd';
export const useAgreeActionProps = () => {
  const { apply } = useApprovalContext();
  const {form} =  useFormBlockContext();
  const api = useAPIClient();
  const status = '1';
  return {
    async onClick() {
      const values = {
        ...form.values,
        userAction: JOB_STATUS.RESOLVED
      }
      api
        .resource('approval_apply')
        .submit({
            filterByTk: apply.id,
            values: {
              status: status,
              result: {
                _: apply,
                form: values
              }
            },
        })
        .then((res) => {
           /* 刷新界面 */
           if(res){
             message.success('审批成功');
             setTimeout(()=>{
              window.location.reload();
             },1000)

           }
          //  window.location.reload();
        });
    },
  };
};
