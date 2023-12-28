import { Button, Input, Space, Tag, Tooltip, Tree } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DownOutlined, MoreOutlined } from '@ant-design/icons';
import {
  BlockProvider,
  CardItem,
  IField,
  RecordProvider,
  css,
  findFilterTargets,
  mergeFilter,
  removeNullCondition,
  useBlockRequestContext,
  useCollectionManager,
  useCompile,
  useDesignable,
  useFilterBlock,
} from '@nocobase/client';
import { RecursionField, useFieldSchema, observer, useField } from '@formily/react';
import { TreeView } from '../..';
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

const treeEach = (tree, callback, { children }) => {
  tree.forEach((item) => {
    callback(item);
    if (item[children] && item[children].length) {
      treeEach(item[children], callback, { children });
    }
  });
};

const MemoTooltip = Tooltip || React.memo(Tooltip);
export const GroupTree = (props: any) => {
  const field: IField = useField();
  const { service } = useBlockRequestContext();
  // const [dataSource, setDataSource] = useState([]);
  field.loading = service.loading;
  const fieldSchema = useFieldSchema();
  const { getCollection } = useCollectionManager();
  const collection = getCollection(field.decoratorProps.resource);
  const fieldNames = {
    key: 'id',
    title: collection?.titleField || 'title',
    children: 'children',
    parentKey: 'parentId',
  };
  const [expandFlag, setExpandFlag] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  useEffect(() => {
    if (service.data?.data) {
      const { key, title, children } = fieldNames;
      field.dataSource = [
        {
          [title]: '全部',
          [key]: 'root',
          [children]: buildTree(service.data?.data, null, [], 0, fieldNames),
        },
      ];
      field.value = 'root';
    }
  }, [service.loading, service.data?.data, fieldNames]);
  const setExpandSchema = (fieldSchema) => {
    fieldSchema.reduceProperties((buf, s) => {
      if (s['x-action'] === 'expandAll') {
        s['x-component-props'] = s['x-component-props'] || {};
        s['x-component-props'].expandFlag = expandFlag;
        s['x-component-props'].setExpandFlag = (arg) => {
          setExpandFlag(arg);
        };
      }
      setExpandSchema(s);
    });
  };
  setExpandSchema(fieldSchema);
  const { getDataBlocks } = useFilterBlock();
  const onSelect = (selectedKeys) => {
    field.data = field.data || {};
    field.data.selectedRowKeys = selectedKeys;
    const { targets, uid } = findFilterTargets(fieldSchema);
    const dataBlocks = getDataBlocks();
    // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
    if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
      // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
      // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
      //  setSelectedRow((prev) => (prev.length ? [] : prev));
      return;
    }

    const value = selectedKeys;

    dataBlocks.forEach((block) => {
      const target = targets.find((target) => target.uid === block.uid);
      if (!target) return;

      const param = block.service.params?.[0] || {};
      // 保留原有的 filter
      const storedFilter = block.service.params?.[1]?.filters || {};

      if (!selectedKeys.length || selectedKeys?.[0] == 'root') {
        delete storedFilter[uid];
      } else {
        storedFilter[uid] = {
          $and: [
            {
              [target.field || fieldNames.key]: {
                [target.field ? '$in' : '$eq']: value,
              },
            },
          ],
        };
      }

      const mergedFilter = mergeFilter([
        ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
        block.defaultFilter,
      ]);

      return block.doFilter(
        {
          ...param,
          page: 1,
          filter: mergedFilter,
        },
        { filters: storedFilter },
      );
    });
  };
  useEffect(() => {
    const defaultKeys = ['root'];
    if (expandFlag) {
      const data = buildTree(service.data?.data, null, [], 0, fieldNames);
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
    setExpandedKeys(defaultKeys);
  }, [expandFlag, service.data?.data]);
  const { designable } = useDesignable();
  return (
    <CardItem
      {...props}
      // extra={
      //   <>
      //     {/* {designable && (
      //       <div>
      //         <RecursionField name={'actionBar'} schema={fieldSchema.properties.actions} />
      //       </div>
      //     )} */}
      //     <div
      //       className={css`
      //         display: flex;
      //         justify-content: space-between;
      //         align-items: flex-start;
      //       `}
      //     >
      //       {!designable && (
      //         <MemoTooltip
      //           placement="bottomRight"
      //           color={'#fff'}
      //           title={
      //             <>
      //               <RecursionField name={'actionBar'} schema={fieldSchema.properties.actions} />
      //             </>
      //           }
      //           trigger={['click']}
      //           overlayClassName={css`
      //             .ant-space {
      //               flex-direction: column !important;
      //               align-items: flex-start !important;
      //               .ant-btn {
      //                 border-color: 0 !important;
      //               }
      //             }
      //           `}
      //         >
      //           <Button icon={<MoreOutlined />} type="text"></Button>
      //         </MemoTooltip>
      //       )}
      //     </div>
      //   </>
      // }
      // headStyle = {{
      //   padding:'0 12px'
      // }}
    >
      <TreeView
        {...props}
        fieldNames={fieldNames}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={onSelect}
      ></TreeView>
    </CardItem>
  );
};
