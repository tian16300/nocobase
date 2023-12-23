import { JOB_STATUS } from '@nocobase/plugin-workflow/client';
import { useApprovalContext } from '../page';
import { useAPIClient } from '@nocobase/client';
export const useAgreeActionProps = () => {
  const { apply } = useApprovalContext();
  const value = JOB_STATUS.RESOLVED;
  const jobId = apply.jobId;
  const api = useAPIClient();
  return {
    async onClick() {
      api
        .resource('approval_apply')
        .submit({
            filterByTk: apply.id,
            values: {
              result: {
                status: '3',
              },
            },
        })
        .then((res) => {
          console.log(res);
        });
    },
  };
};
