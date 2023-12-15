import { useCollection, useRecord, useRequest } from '@nocobase/client';
import { createContext, useContext } from 'react';
import React from 'react';
const ApplyBlockContext = createContext<any>({ collection: null });

export const ApplyBlockProvider = (props) => {
  const collection = useCollection();
  const record = useRecord();
  const { currentApproval_id } = record;
  const workflows = useRequest({
    action: 'list',
    resource: 'workflows',
    params: {
      filter: {
        bussinessCollectionName: collection.name,
        type: 'collection',
        isApproval: true,
        current: true,
      },
      pagination: false,
    },
  });
  let apply = null;
  if (currentApproval_id) {
    const { data } = useRequest({
      action: 'get',
      resource: 'approval_apply',
      params: {
        filterByTk: currentApproval_id,
      },
    });
    apply = data;
  }

  return <InnerApplyBlockProvider {...props} workflow={workflows.data?.[0]} apply={apply}></InnerApplyBlockProvider>;
};

const InnerApplyBlockProvider = (props) => {
  const { children, workflow, apply } = props;
  const collection = useCollection();
  const record = useRecord();
  const { currentApproval_id } = record;
  let formActionType = null;
  /* 用户 操作  提交申请  撤销  再次提交申请 */
  if (!currentApproval_id) {
    /* 用户可操作提交申请  */
    formActionType = '1';
  } else if (apply && apply.jobIsEnd) {
    /* 审批结束 */
    formActionType = '3';
  } else if (apply && !apply.jobIsEnd) {
    /* 审批结束 */
    formActionType = '2';
  }
  return (
    <ApplyBlockContext.Provider value={{ collection, apply, workflow, formActionType }}>
      {children}
    </ApplyBlockContext.Provider>
  );
};
export const useApplyBlockContext = () => {
  return useContext(ApplyBlockContext);
};
