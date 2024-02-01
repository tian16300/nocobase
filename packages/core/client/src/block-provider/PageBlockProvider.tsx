import { useSize } from 'ahooks';
import React from 'react';
import { createContext, useContext } from 'react';

const PageBlockContext = createContext({});

export const usePageBlockContext = () => {
  return useContext(PageBlockContext);
};

export const PageBlockProvider = ({ children, value }) => {

   debugger;

  return <PageBlockContext.Provider value={value}>
      {children}
  </PageBlockContext.Provider>;
};
