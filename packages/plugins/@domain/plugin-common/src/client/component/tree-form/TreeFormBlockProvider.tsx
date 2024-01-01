import React, { createContext, useContext } from 'react';
import { TableBlockProvider, useTableBlockContext } from '@nocobase/client';
const TreeFormBlockContext = createContext<any>({});
export const TreeFormBlockProvider = (props) => {
  return (
    <TableBlockProvider {...props}>
      <InnerTreeFormBlockProvider {...props}></InnerTreeFormBlockProvider>
    </TableBlockProvider>
  );
};
const InnerTreeFormBlockProvider = (props) => {
  const ctx = useTableBlockContext();
  return (
    <TreeFormBlockContext.Provider
      value={{
        ...ctx
      }}
    >
      {props.children}
    </TreeFormBlockContext.Provider>
  );
};
export const useTreeFormBlockContext = () => {
    return useContext(TreeFormBlockContext);
};