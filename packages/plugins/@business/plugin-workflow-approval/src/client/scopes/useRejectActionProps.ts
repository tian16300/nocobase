import { JOB_STATUS } from '@nocobase/plugin-workflow/client';
import { useApprovalContext } from '../page';
import { useAPIClient, useFormBlockContext } from '@nocobase/client';

export const useRejectActionProps = () => {
  const { apply } = useApprovalContext();
  const { form } = useFormBlockContext();
  const api = useAPIClient();
  const status = '2';
  return {
    async onClick() {
      const values = {
        ...form.values,
        userAction: JOB_STATUS.REJECTED
      }
      api
        .resource('approval_apply')
        .submit({
          filterByTk: apply.id,
          values: {
            status: status,
            result: {
              _: apply,
              form: values,
            },
          },
        })
        .then((res) => {
          /* 刷新界面 */
          if (res) window.location.reload();
        });
    },
  };
};
