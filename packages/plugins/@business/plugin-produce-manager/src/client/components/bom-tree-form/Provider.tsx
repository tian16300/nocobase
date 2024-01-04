import React, { createContext, useContext, useMemo, useState } from 'react';
import { CollectionProvider, TableBlockProvider, useRecord, useTableBlockContext } from '@nocobase/client';
import { RecursionField, useFieldSchema, observer, useField, connect, mapProps, mapReadPretty } from '@formily/react';
import { flattenTree } from '@nocobase/utils';

const BomTreeFormBlockContext = createContext<any>({});
export const BomTreeFormBlockProvider = (props) => {
  const { children, ...others } = props;
  return (
    // <CollectionProvider name='bom'>
    <TableBlockProvider {...others}>
      <InnerTreeFormBlockProvider {...props}></InnerTreeFormBlockProvider>
    </TableBlockProvider>
    // </CollectionProvider>
  );
};
const InnerTreeFormBlockProvider = (props) => {
  const ctx = useTableBlockContext();
  const field = useField();
  const [view, setView] = useState('table');
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formRecord, setFormRecord] = useState(null);
  const [countTableView, setCountTableView] = useState({
    view: 'table',
    action: 'list',
  });
  const [viewType, setViewType] = useState({
    view: 'table',
    action: 'list',
  });
  const [loading, setLoading] = useState(false);  
  const __parent = useRecord();
  const actionFieldSchema = useMemo(() => {
    const props = viewType.action =='create'?{
      isRecord: true,
    }:{}
    return {
      type: 'void',
      'x-action': viewType.action,
      'x-component-props':{
        ...props||{} 
      }
    }

  },[viewType.action]);
  const onSelect = (keys) => {
    setLoading(true);
    setTimeout(() => {
      if (keys && keys.length) {
        const data = flattenTree(ctx.service.data?.data||[],[]);
        const record = data.find(({id})=>{
          return id == keys[0]
        });
        setSelectedKey(keys[0]);
        setCurrentRecord({
          ...record,
          __parent,
          __collectionName:'bom'
        });
      
        if(['GZ','DY'].includes(record.type)){
          setViewType(countTableView)
        }else{
          // setView('form');
          setViewType({
            view: 'detail',
            action: 'update',
          })
        }
     
      } else {
        setSelectedKey([]);
        setCurrentRecord({
          __parent,
          __collectionName:'bom'
        });
        // setView('table');
      }
      setLoading(false);
    }, 500);
  };
  return (
    <BomTreeFormBlockContext.Provider
      value={{
        ...ctx,
        view,
        selectedKey,
        currentRecord,
        setView,
        field,
        onSelect,
        viewType,
        setViewType,
        loading, 
        setLoading,
        countTableView, 
        setCountTableView,
        actionFieldSchema,
        formRecord,
         setFormRecord
      }}
    >
      {props.children}
    </BomTreeFormBlockContext.Provider>
  );
};
export const useBomTreeFormBlockContext = () => {
  return useContext(BomTreeFormBlockContext);
};
