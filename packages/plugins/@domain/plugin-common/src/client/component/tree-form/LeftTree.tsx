import React, { useEffect, useRef, useState } from 'react';
import {
  CardItem,
  IField,
  useBlockRequestContext,
  useCollection,
  useCollectionManager
} from '@nocobase/client';
import { useFieldSchema, useField } from '@formily/react';
import { flattenTree } from '@nocobase/utils';
import { TreeView } from '..';
import { useTreeFormBlockContext } from './Provider';
// import { useTreeFormBlockContext } from './TreeFormMain';

function buildTree(
  arr,
  parentKey?: React.Key,
  tree = [],
  level = 0,
  fieldNames = {
    key: 'id',
    title: 'title',
    children: 'children',
    parentKey: 'parentId',
  },
) {
  if (arr && arr.length === 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][fieldNames.parentKey] === parentKey) {
        const children = buildTree(arr, arr[i][fieldNames.key], [], level + 1, fieldNames);
        if (children.length) {
          arr[i].children = children;
        }
        arr[i].level = level;
        tree.push(arr[i]);
      }
    }
  }

  return tree;
}

const treeEach = (tree, callback, { children }) => {
  tree.forEach((item) => {
    callback(item);
    if (item[children] && item[children].length) {
      treeEach(item[children], callback, { children });
    }
  });
};

export const LeftTree = (props: any) => {
  const { useProps } = props;
  // const {  onSelect } = useProps?.();
  const field: IField = useField();
  const blockCtx = useBlockRequestContext();
  const { service } = blockCtx;
  // const [dataSource, setDataSource] = useState([]);
  // field.loading = service.loading;
  const fieldSchema = useFieldSchema();
  const { getCollection } = useCollectionManager();
  const {  expandAll, setExpandAll, expandFlag, allIncludesChildren } = useTreeFormBlockContext();
  // formField.data = formField.data || {};
  // formField.data.blockCtx = blockCtx;
  const collection: any = useCollection();
  const fieldNames = {
    key: 'id',
    title: collection?.titleField || 'title',
    children: 'children',
    parentKey: 'parentId',
  };
  // const [expandFlag, setExpandFlag] = useState(false);
  const [expandedKeys, setExpandesKeys] = useState([]); 
  useEffect(() => {
    if (!service.loading) {
      field.data = field.data || {};
      // field.dataSource =[{
      //   [fieldNames.key]: 'root',
      //   [fieldNames.title]: '全部',
      //   [fieldNames.parentKey]: null,
      //   [fieldNames.children]: service.data?.data,
      // }];
      field.dataSource = service.data?.data;
      field.value = null;

      // const data = flattenTree(service.data?.data, []);
      // field.data.list = data;
      // field.value = 'root';
      
      
    }
  }, [service.loading, service.data?.data]);

  const setExpandSchema = (fieldSchema) => {
    fieldSchema.reduceProperties((buf, s) => {
      if (s['x-action'] === 'expandAll') {
        s['x-component-props'] = s['x-component-props'] || {};
        s['x-component-props'].expandFlag = expandAll;
        s['x-component-props'].setExpandFlag = (arg) => {
          setExpandAll(arg);
        };
      }
      setExpandSchema(s);
    });
  };
  
  setExpandSchema(fieldSchema);
  // const handleSelect = (selectedKeys) => {
  //   field.data = field.data || {};
  //   field.data.selectedRowKeys = selectedKeys;
  //   const value = selectedKeys;
  //   const row = field?.data?.list.find((item) => item[fieldNames.key] === selectedKeys?.[0]);
  //   // onSelect?.(value[0], row);
  // };
  useEffect(() => {
    const defaultKeys = [];
    const data = service.data?.data;
    if (expandAll && data && data.length) {
      treeEach(
        data,
        (item) => {
          const children = item[fieldNames['children'] || 'children'];
          if (children && children.length) {
            defaultKeys.push(item[fieldNames['key'] || 'id']);
          }
        },
        fieldNames,
      );
    }
    setExpandesKeys(defaultKeys);
  }, [expandAll, service.data?.data]);
  useEffect(() => {
    if (expandFlag) {
      setExpandesKeys(allIncludesChildren);
    } else {
      setExpandesKeys([]);
    }
  }, [expandFlag, allIncludesChildren]);


  return (
    <TreeView
    {...props}
    loading={service.loading}
    fieldNames={fieldNames}
    expandedKeys={expandedKeys}
    onExpand={setExpandesKeys}
    // onSelect={handleSelect}
  ></TreeView>
  );
};
