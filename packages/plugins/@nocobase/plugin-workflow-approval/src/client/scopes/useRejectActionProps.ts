import { JOB_STATUS } from "@nocobase/plugin-workflow/client";

export const  useRejectActionProps = ()=> {

     const value = JOB_STATUS.REJECTED
    return {
        async onClick() {
          

        }
    };
}