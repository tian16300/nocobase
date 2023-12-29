import { useCollection, useRecord, useRequest } from '@nocobase/client';
import { createContext, useContext } from 'react';
import React from 'react';
import { useWorkflowContext } from './WorkflowBlockProvider';
const ApplyBlockContext = createContext<any>({ collection: null });
export const ApplyBlockProvider = (props) => {
  const collection = useCollection();
  const { workflow } = useWorkflowContext();
  const record = useRecord();
  const { currentApproval_id } = record;
  let apply = null;
  if (currentApproval_id) {
    const { data } = useRequest<{data:any}>({
      action: 'get',
      resource: 'approval_apply',
      params: {
        filterByTk: currentApproval_id,        
        appends: ['execution']
      },
    },{
      uid:`${collection.name}_apply`
    });
    apply = data?.data;
  }
  
  return  <InnerApplyBlockProvider {...props}  apply={apply} workflow={workflow} record={record}></InnerApplyBlockProvider>
};

const InnerApplyBlockProvider = (props) => {
  const { children, workflow, apply, record,  } = props;
  const collection = useCollection();
  // const record = useRecord();
  const { currentApproval_id } = record;
  let formActionType = null;
  /* 用户 操作  提交申请  撤销  再次提交申请 */
  if (!currentApproval_id) {
    /* 用户可操作提交申请  */
    formActionType = 1;
  } else if (apply && apply.jobIsEnd) {
    /* 审批结束 */
    formActionType = 3;
  } else if (apply && !apply.jobIsEnd) {
    /* 审批结束 */
    formActionType = 2;
  }
  return (
   
    <ApplyBlockContext.Provider value={{ collection, apply, workflow,  formActionType }}>
      {children}
    </ApplyBlockContext.Provider>
  );
};
export const useApplyBlockContext = () => {
  return useContext(ApplyBlockContext);
};
