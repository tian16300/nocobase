import { useA, useAPIClient, useCollection, useRecord, useRequest } from '@nocobase/client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useWorkflowContext } from './WorkflowBlockProvider';
import { use } from 'i18next';
const ApplyBlockContext = createContext<any>({ collection: null });
export const ApplyBlockProvider =  (props) => {
  const collection = useCollection();
  const { workflow } = useWorkflowContext();
  const record = useRecord();
  const api = useAPIClient();
  let [apply, setApply] = useState<any>({});
  if (record && record.currentApproval_id) {
    api.resource('approval_apply').get({
      filterByTk: record.currentApproval_id,
      appends: ['execution'],
    }).then((res) => {
      if(res.status === 200){
        setApply(res.data.data);
      }
    });
  }
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
