import { useCollection, useRequest } from '@nocobase/client';
import { createContext, useContext } from 'react';
import React from 'react';
const WorkflowContext = createContext<any>({ collection: null });

export const WorkflowBlockProvider = (props) => {
  const collection = useCollection();
  const { data } = useRequest<{ data: any }>({
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
  return (
    <WorkflowContext.Provider value={{ workflow: data?.data?.[0] }}>{props.children}</WorkflowContext.Provider>
  );
};
export const useWorkflowContext = () => {
  return useContext(WorkflowContext);
};
