import { useApprovalContext } from '../page';
import { useAPIClient, useFormBlockContext } from '@nocobase/client';

export const useRejectActionProps = () => {
  const { apply } = useApprovalContext();
  const { form } = useFormBlockContext();
  const api = useAPIClient();
  const status = '2';
  return {
    async onClick() {
      const formValues = form.values;
      formValues.approvalStatus = status;
      api
        .resource('approval_apply')
        .submit({
          filterByTk: apply.id,
          values: {
            status: status,
            result: {
              _: apply,
              form: formValues,
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
