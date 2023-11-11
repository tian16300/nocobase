import { DataNode, TreeProps } from 'antd/es/tree';
import { Divider, useToken } from '../..';
import { Button, Dropdown, Input, MenuProps, Space, Tag, Tooltip, Tree } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DownOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  BlockProvider,
  RecordProvider,
  css,
  useBlockContext,
  useBlockRequestContext,
  useCollectionManager,
  useCompile,
} from '@nocobase/client';
import { useSize } from 'ahooks';
import { RecursionField, useFieldSchema, observer } from '@formily/react';
import { useGroupTableBlockResource } from '../GroupTable.Decorator';
import { cloneDeep } from 'lodash';

const { Search } = Input;
export const GroupTree = (props) => {
  const { name } = props;
  const { getCollectionField, getCollection } = useCollectionManager();
  const field = getCollectionField(name);
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
    parentKey: 'parentId'
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
          <Divider orientation="left">
            <strong>{title}</strong>
          </Divider>
        </div>
        <div ref={treeRef}>
          <GroupTreeView height={size?.height} fieldNames={fieldNames} />
        </div>
      </Space>
    </BlockProvider>
  );
};
const MemoTooltip = Tooltip || React.memo(Tooltip);
const { CheckableTag } = Tag;

export const GroupTreeView = (props: any) => {
  const onSelect = (selectedKeys) => {
    setGroupSelectedKeys(selectedKeys as string[]);
  };
  const { fieldNames } = props;
  const { key, title, children, parentKey } = fieldNames;
  const { service } = useBlockRequestContext();
  const { height } = props;
  const fieldSchema = useFieldSchema();
  const { groupSelectedKeys, setGroupSelectedKeys } = useGroupTableBlockResource();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['root']);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState([
    {
      [title]: '全部',
      [key]: 'root',
      children: []
    },
  ]);
  const { token } = useToken();
  
  function buildTree(arr, parentId?: React.Key, tree = [], level = 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parentId === parentId) {
        const children = buildTree(arr, arr[i][key], [], level+1);
        if (children.length) {
          arr[i].children = children;
        }
        arr[i].level = level;
        tree.push(arr[i]);
      }
    }

    return tree;
  }
  useEffect(() => {
    if (service.data?.data && service.data?.data?.length) {
      const children = [];
      setTreeData([
        {
          [title]: '全部',
          [key]: 'root',
          children: buildTree(service.data.data, null, children)
        }
      ]);
    }
  }, [service.data?.data]);
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = (service.data?.data as any[])
      .map((item) => {
        if ((item[title] as string).indexOf(value) > -1) {
          return item[parentKey];
        }
        return null;
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(Array.from(new Set(['root',...newExpandedKeys])));
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="搜索..." allowClear onChange={onSearch} />
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        //   height={height}
        height={500}
        treeData={treeData}
        fieldNames={fieldNames}
        selectable={false}
        className={css`
          .ant-tree-node-content-wrapper: hover {
            background-color: transparent;
          }
        `}
        titleRender={(item: any) => {
          return (
            <div
              className={css`
                position: relative;
                .site-tree-search-value {
                  color:${token.colorWarning};
                  font-weight: bold;
                }
              `}
            >
              <MemoTooltip title={item[title] as any}>
                <CheckableTag
                  key={item[key]}
                  
                  checked={groupSelectedKeys.includes(item[key])}
                  onChange={(checked) => {
                    onSelect([item[key]]);
                  }}
                >
                  {item[title].indexOf(searchValue) > -1 ? (
                    <>
                      {item[title].substring(0, item[title].indexOf(searchValue))}
                      <span className="site-tree-search-value">{searchValue}</span>
                      {item[title].slice(item[title].indexOf(searchValue) + searchValue.length)}
                    </>
                  ) : (
                    <>{item[title]}</>
                  )}
                </CheckableTag>
              </MemoTooltip>
              <span
                className={css`
                  position: absolute;
                  top: 0;
                  margin-left: 10px;
                  text-wrap: nowrap;
                  .ant-space-horizontal {
                    gap: 0px !important;
                  }
                  .ant-btn,
                  .ant-btn.ant-btn-sm {
                    padding: 0 2px;
                  }
                `}
                hidden={!groupSelectedKeys.includes(item[key])}
              >
                {item[key] == 0 ? (
                  <RecursionField name={'anctionBar'} schema={fieldSchema.properties.groupActions} />
                ) : (
                  <RecordProvider record={item}>
                    <RecursionField name={'recordAnctionBar'} schema={fieldSchema.properties.groupRecordActions} />
                  </RecordProvider>
                )}
              </span>
            </div>
          );
        }}
      />
    </>
  );
};
