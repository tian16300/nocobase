import React, { createContext, useContext, useState } from 'react';
import {  useField } from '@formily/react';
import { useCollectionManager } from '../collection-manager';
import { useTableBlockProps } from './TableBlockProvider';
interface GroupTableBlockResourceContextProps {
  groupSelectedKeys?: string[];
  setGroupSelectedKeys?: (arg: string[]) => void;
  field?: any;
}
const GroupTableBlockResourceContext = createContext<GroupTableBlockResourceContextProps>({});

export const GroupTableProvider = (props) => {
  const { children, ...others } = props;
  const { collection, group } = props;
  const { getCollectionField } = useCollectionManager();
  const [groupSelectedKeys, setGroupSelectedKeys] = useState(['root']);
  const field = useField();

  return (
    <GroupTableBlockResourceContext.Provider value={{ ...others, field, groupSelectedKeys, setGroupSelectedKeys }}>
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
export const useGroupTableBlockProps = () => {
  const ctx = useTableBlockProps();
  return {
    ...ctx,
  };
};

export const filterByGroup = (groupValue) => {};
