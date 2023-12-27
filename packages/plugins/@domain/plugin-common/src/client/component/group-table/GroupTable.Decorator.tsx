import { FixedBlockWrapper, useCollectionManager, useTableBlockProps } from '@nocobase/client';
import React, { createContext, useContext, useState } from 'react';
interface GroupTableBlockResourceContextProps {
  groupSelectedKeys?: string[];
  setGroupSelectedKeys?: (arg: string[]) => void;
}
const GroupTableBlockResourceContext = createContext<GroupTableBlockResourceContextProps>({});

export const Provider = (props) => {
  const { children, ...others } = props;
  const { collection, group } = props;
  const { getCollectionField } = useCollectionManager();
  const field = getCollectionField(`${collection}.${group}`);
  const [groupSelectedKeys, setGroupSelectedKeys] = useState(['root']);

  return (
    <FixedBlockWrapper>
      <GroupTableBlockResourceContext.Provider value={{ ...others, groupSelectedKeys, setGroupSelectedKeys }}>
        {children}
      </GroupTableBlockResourceContext.Provider>
    </FixedBlockWrapper>
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
