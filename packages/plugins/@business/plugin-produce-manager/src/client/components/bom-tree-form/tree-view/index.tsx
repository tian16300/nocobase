import { Input, Spin, Tag, Tooltip, Tree } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IField, RecordProvider, css, useToken } from '@nocobase/client';
import { useSize } from 'ahooks';
import { RecursionField, useFieldSchema, observer, useField, connect, mapProps, mapReadPretty } from '@formily/react';
import { debounce } from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { useBomTreeFormBlockContext } from '../Provider';
// const { Search } = Input;
const MemoTooltip = Tooltip || React.memo(Tooltip);
const { CheckableTag } = Tag;

const treeEach = (tree, callback, { children }) => {
  tree.forEach((item) => {
    callback(item);
    if (item[children] && item[children].length) {
      treeEach(item[children], callback, { children });
    }
  });
};

export const TreeView = connect(
  (props: any = {}) => {
    const { onSelect, treeData = [], expandedKeys, loading = true, ...others } = props;
    const { fieldNames } = props;
    const { key, title, parentKey } = fieldNames;
    const field: IField = useField();
    const fieldSchema = useFieldSchema();
    const [selectedKeys, setSelectedKeys] = useState([field.value || []]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const { token } = useToken();
    const { height = '100%' } = props;
    const boxRef = useRef(null);
    const searchBoxRef = useRef(null);
    const boxSize = useSize(boxRef);
    const searchBoxSize = useSize(searchBoxRef);
    const [treeBoxHeight, setTreeBoxHeight] = useState(500);
    const treeCtx = useBomTreeFormBlockContext();
    useEffect(() => {
      if (boxSize?.height && searchBoxSize?.height) {
        setTreeBoxHeight(boxSize?.height - searchBoxSize?.height);
      }
    }, [boxSize?.height, searchBoxSize?.height]);

    const onSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newExpandedKeys = new Set(['root']);
      treeEach(
        treeData,
        (item) => {
          if ((item[title] as string).indexOf(value) > -1) {
            newExpandedKeys.add(item[parentKey]);
          }
        },
        fieldNames,
      );
      onExpand(Array.from(newExpandedKeys), true);
      setSearchValue(value);
    }, 300);
    const onExpand = (newExpandedKeys: React.Key[], autoExpandParent = false) => {
      if (typeof props.onExpand === 'function') {
        props.onExpand(newExpandedKeys);
      }
      setAutoExpandParent(autoExpandParent);
    };
    const handleSelect = (selectedKeys) => {
      if (typeof onSelect === 'function') {
        onSelect(selectedKeys);
      }
     
      if (typeof  treeCtx?.onSelect === 'function') {
        treeCtx?.onSelect(selectedKeys);
      }
      field.value = selectedKeys;
    
    };
    const toggelSelect = (key)=>{
      let newValue;
      if(selectedKeys.includes(key)){
        newValue = [];
      }else{
        newValue = [key];
      }
      handleSelect(newValue);
      setSelectedKeys(newValue);

    };

    return (
      <div
        ref={boxRef}
        className={css`
          height: ${height};
        `}
      >
        <div
          ref={searchBoxRef}
          className={css`
            padding: 6px 8px;
            .ant-input-affix-wrapper-borderless {
              border-bottom: 1px solid ${token.colorBorder};
              border-radius: 0;
            }
          `}
        >
          <Input bordered={false} style={{ marginBottom: 8 }} placeholder="搜索..." allowClear onChange={onSearch} />
        </div>
        {loading && (
          <div
            className={css`
              text-align: center;
            `}
          >
            <Spin />
          </div>
        )}
        {!loading && (
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            height={treeBoxHeight}
            fieldNames={fieldNames}
            selectable={false}
            onSelect={handleSelect}
            className={css`
              .ant-tree-node-content-wrapper: hover {
                background-color: transparent;
              }
              .ant-tree-list-holder {
                overflow-x: hidden;
              }
            `}
            titleRender={(item: any) => {
              return (
                <div
                  className={css`
                    position: relative;
                    .site-tree-search-value {
                      color: ${token.colorWarning};
                      font-weight: bold;
                    }
                    .ant-tag {
                      font-size: ${token.fontSize}px;
                    }
                  `}
                >
                  <MemoTooltip title={item[title] as any}>
                    <CheckableTag
                      key={item[key]}
                      checked={selectedKeys.includes(item[key])}
                      onChange={() => {
                        toggelSelect(item[key])
                      
                      }}
                    >
                      {item[title]?.indexOf(searchValue) > -1 ? (
                        <>
                          {item[title].substring(0, item[title].indexOf(searchValue))}
                          <span className="site-tree-search-value">{searchValue}</span>
                          {item[title].slice(item[title].indexOf(searchValue) + searchValue.length)}
                        </>
                      ) : (
                        <>{item[title] || '--'}</>
                      )}
                    </CheckableTag>
                  </MemoTooltip>
                  <span
                    className={css`
                      position: absolute;
                      top: 0;
                      margin-left: 30px;
                      text-wrap: nowrap;
                      .ant-space-horizontal {
                        gap: 0px !important;
                      }
                      .ant-btn,
                      .ant-btn.ant-btn-sm {
                        padding: 0 2px;
                      }
                    `}
                    hidden={!selectedKeys.includes(item[key])}
                  >
                    <RecordProvider record={item}>
                      <RecursionField name={'recordActionBar'} schema={fieldSchema.properties?.recordActions} />
                    </RecordProvider>
                  </span>
                </div>
              );
            }}
            treeData={treeData}
            showLine
            switcherIcon={<DownOutlined />}
            // onDragEnter={onDragEnter}
            // onDrop={onDrop}
            {...others}
          />
        )}
      </div>
    );
  },
  mapProps(
    {
      dataSource: 'treeData',
    },
    (props, field) => {
      return {
        ...props,
        loading: field?.['loading'] || field?.['validating'],
      };
    },
  ),
  mapReadPretty(
    observer((props) => {
      return <>ToDo</>;
    }),
  ),
);

TreeView.displayName = 'TreeView';
