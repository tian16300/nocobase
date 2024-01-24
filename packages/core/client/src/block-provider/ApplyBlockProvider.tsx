import { useA, useAPIClient, useCollection, useRecord, useRequest } from '@nocobase/client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useWorkflowContext } from './WorkflowBlockProvider';
const ApplyBlockContext = createContext<any>({ collection: null });
export const ApplyBlockProvider =  (props) => {
  const { workflow } = useWorkflowContext();
  const record = useRecord();
  const api = useAPIClient();
  let [apply, setApply] = useState<any>({});
  const params = useMemo(() => {
    return {
      filterByTk: record.currentApproval_id,
      appends: ['execution']
    };
  }, []);
  const service = useRequest<any>({
    resource: 'approval_apply',
    action: 'get',
    params: params
  }); 
  const { data, loading } = service;
  useEffect(() => {
    if(!loading && record.currentApproval_id && data?.data){
      setApply(data.data);
    }
  }, [loading, record?.currentApproval_id]);
  return (
    <InnerApplyBlockProvider {...props} apply={apply} setApply={setApply} service={service}  workflow={workflow}></InnerApplyBlockProvider>
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
