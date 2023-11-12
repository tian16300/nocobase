import { Divider, TreeView, useToken } from '../..';
import {  Input, Space, Tag, Tooltip, Tree } from 'antd';
import React, { useEffect,useRef, useState } from 'react';
import { DownOutlined} from '@ant-design/icons';
import {
  BlockProvider,
  IField,
  RecordProvider,
  css,
  useBlockRequestContext,
  useCollectionManager,
  useCompile,
} from '@nocobase/client';
import { useSize } from 'ahooks';
import { RecursionField, useFieldSchema, observer, useField } from '@formily/react';
import { forEach } from 'lodash';

export const GroupTree = (props) => {
  const fieldSchema = useFieldSchema();
  const fieldName = fieldSchema['x-collection-field'];
  const { getCollectionField, getCollection } = useCollectionManager();
  const field = getCollectionField(fieldName);
  const compile = useCompile();
  const title = compile(field.uiSchema?.title);
  const groupResource = field.target;
  const treeRef = useRef(null);
  const size = useSize(treeRef);
  const collection = getCollection(groupResource);
  const fieldNames = {
    key: 'id',
    title: collection?.titleField || 'title',
    children: 'children',
    parentKey: 'parentId',
  };

  /* 获取标题字段 */
  return (
    <BlockProvider
      name={field.name}
      collection={groupResource}
      resource={groupResource}
      action="list"
      params={{ paginate: false }}
    >
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <div>
         <strong>{title}</strong>
        </div>
        <div ref={treeRef}>
          <GroupTreeView height={size?.height || '500px'} fieldNames={fieldNames} />
        </div>
      </Space>
    </BlockProvider>
  );
};
function buildTree(arr, parentKey?: React.Key, tree = [], level = 0, fieldNames = {
  key: 'id',
  title: 'title',
  children: 'children',
  parentKey: 'parentId'
}) {
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

  return tree;
}

const treeEach = (tree, callback, {children}) => {
  tree.forEach((item) => {
    callback(item);
    if (item[children] && item[children].length) {
      treeEach(item[children], callback, {children});
    }
  });
};
export const GroupTreeView = (props: any) => {
  const field: IField = useField();
  const { service } = useBlockRequestContext();
  // const [dataSource, setDataSource] = useState([]);
  field.loading = service.loading;
  const fieldSchema = useFieldSchema();
  const {fieldNames} = props;
  const [expandFlag, setExpandFlag] = useState(false);   
  const [expandedKeys, setExpandedKeys] = useState(['root']); 
  useEffect(() => {
     if(service.data?.data && service.data?.data?.length){
      const {key,title,children} = fieldNames
      field.dataSource =[
        {
          [title]: '全部',
          [key]: 'root',
          [children]: buildTree(service.data?.data, null, [], 0, fieldNames),
        }
      ]
      field.value = 'root';
     }
  }, [service.loading, service.data?.data,  fieldNames]);
  const setExpandSchema = (fieldSchema) =>{
    fieldSchema.reduceProperties((buf, s)=>{
      if(s['x-action'] === 'expandAll'){
        s['x-component-props'] = s['x-component-props']||{};
        s['x-component-props'].expandFlag = expandFlag;
        s['x-component-props'].setExpandFlag = (arg)=>{
          setExpandFlag(arg);
        }
      }
      setExpandSchema(s)
    })
  };
  setExpandSchema(fieldSchema);

  const onSelect = (selectedKeys) => {
     field.value = selectedKeys[0];
  };
  useEffect(() => {
    const defaultKeys = ['root'];
    if (expandFlag) {
      const data = buildTree(service.data?.data, null, [], 0, fieldNames);
      treeEach(data, (item) => {
        const children = item[fieldNames['children'] || 'children'];
        if (children && children.length) {
            defaultKeys.push(item[fieldNames['key'] || 'id']);
        }
      },fieldNames);
    }
    setExpandedKeys(defaultKeys);
  },[
    expandFlag,
    service.data?.data
  ])

  return (
    <TreeView {...props} 
     expandedKeys={expandedKeys}
     onExpand={setExpandedKeys}
    //  onSelect={onSelect}  
    //  setExpandedKeys={setExpandedKeys}
     ></TreeView>
  );
};
