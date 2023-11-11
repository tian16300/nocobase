import React, { createContext, useContext, useState } from 'react';
import { BlockProvider } from '../../../block-provider';
import { useCollectionManager } from '../../../collection-manager';
interface GroupTableBlockResourceContextProps  {
    groupSelectedKeys?: string []; 
    setGroupSelectedKeys?: (arg:string []) => void;
};
const GroupTableBlockResourceContext = createContext<GroupTableBlockResourceContextProps>({});

export const Provider = (props) => {
  const { children, ...others } = props;
  const { collection, group } = props;
  const { getCollectionField } = useCollectionManager();
  const field = getCollectionField(`${collection}.${group}`);
  const [groupSelectedKeys, setGroupSelectedKeys] = useState(['root']);

  return (
   
      <GroupTableBlockResourceContext.Provider value={{ ...others,groupSelectedKeys, setGroupSelectedKeys }}>
        {children}
      </GroupTableBlockResourceContext.Provider>
  );
};

export const useGroupTableBlockResource = () => {
  return useContext(GroupTableBlockResourceContext);
};
export const useGroupTableProps = () => {
  const ctx = useGroupTableBlockResource();
  return {
    ...ctx,
  };
};
