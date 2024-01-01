import React, { createContext, useContext, useState } from 'react';
import { TableBlockProvider, useTableBlockContext } from '@nocobase/client';
import { RecursionField, useFieldSchema, observer, useField, connect, mapProps, mapReadPretty } from '@formily/react';

const TreeFormBlockContext = createContext<any>({});
export const TreeFormBlockProvider = (props) => {
  const { children, ...others } = props;
  return (
    <TableBlockProvider {...others}>
      <InnerTreeFormBlockProvider>{children}</InnerTreeFormBlockProvider>
    </TableBlockProvider>
  );
};
const InnerTreeFormBlockProvider = (props) => {
  const ctx = useTableBlockContext();
  const field = useField();
  const [view, setView] = useState('table');
  const [selectedKey, setSelectedKey] = useState(null);
  const onSelect = (keys) => {
    setView('loading');

    setTimeout(() => {
      if (keys && keys.length) {
        setSelectedKey(keys[0]);
        setView('form');
      } else {
        setView('table');
      }
    }, 500);
  };
  return (
    <TreeFormBlockContext.Provider
      value={{
        ...ctx,
        view,
        selectedKey,
        setView,
        field,
        onSelect
      }}
    >
      {props.children}
    </TreeFormBlockContext.Provider>
  );
};
export const useTreeFormBlockContext = () => {
  return useContext(TreeFormBlockContext);
};
