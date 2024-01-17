import { useA, useAPIClient, useCollection, useRecord, useRequest } from '@nocobase/client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useWorkflowContext } from './WorkflowBlockProvider';
const ApplyBlockContext = createContext<any>({ collection: null });
export const ApplyBlockProvider = (props) => {
  const collection = useCollection();
  const { workflow } = useWorkflowContext();
  const record = useRecord();
  let [apply, setApply] = useState<any>(null);
  const api = useAPIClient();

  if (record.currentApproval_id) {
    const { data } = useRequest<{ data: any }>(
      {
        action: 'get',
        resource: 'approval_apply',
        params: {
          filterByTk: record.currentApproval_id,
          appends: ['execution'],
        },
      },
      {
        uid: `${collection.name}_apply`,
      },
    );
    setApply(data?.data.data);
  }
  useEffect(() => {
    if (!record.currentApproval_id) {
      return;
    }
    api
      .resource('approval_apply')
      .get({
        filterByTk: record.currentApproval_id,
        appends: ['execution'],
      })
      .then((res) => {
        if (res.status == 200) {
          setApply(res.data.data);
        }
      });
  }, [record?.currentApproval_id]);
  return (
    <InnerApplyBlockProvider {...props} apply={apply} setApply={setApply} workflow={workflow}></InnerApplyBlockProvider>
  );
};

const InnerApplyBlockProvider = (props) => {
  const { children, workflow, apply, setApply, service } = props;
  const collection = useCollection();
  return (
    <ApplyBlockContext.Provider value={{ collection, apply, setApply, service, workflow }}>
      {children}
    </ApplyBlockContext.Provider>
  );
};
export const useApplyBlockContext = () => {
  return useContext(ApplyBlockContext);
};
