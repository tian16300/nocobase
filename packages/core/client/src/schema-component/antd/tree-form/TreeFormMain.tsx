import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { CardItem, FixedBlockWrapper, removeNullCondition, useFixedBlock, useToken } from '..';
import { FormProvider, RecursionField, useField, useFieldSchema } from '@formily/react';
import { css } from '@emotion/css';
import { uid } from '@nocobase/utils';
import { LeftTree } from './LeftTree';
import { RecordProvider, useRecord } from '../../../record-provider';
import { Divider, Space, Spin } from 'antd';
import { useSize } from 'ahooks';
import { useDesignable } from '../../hooks';
import { CollectionProvider, IField, useCollectionManager } from '../../../collection-manager';
import { mergeFilter, useBlockRequestContext } from '../../../block-provider';
import { createForm } from '@formily/core';
import { default as cls } from 'classnames';
import { set } from 'lodash';
import { transformToFilter, useFilterBlock } from '@nocobase/client';
interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
}
function treeToArray(tree: TreeNode[], result: TreeNode[] = []): TreeNode[] {
  for (const node of tree) {
    result.push(node);
    if (node.children) {
      treeToArray(node.children, result);
    }
  }
  return result;
}
const TreeFormBlockContext = createContext<any>({});
export const TreeFormMain = (props) => {
  const { token } = useToken();
  const { useProps } = props;
  const _props = useProps?.() || {};
  const {
    collection,
    selectedRowKeys,
    leftFlex: _leftFlex = 0.3,
    rightFlex: _rightFlex = 0.3,
  } = { ...props, ..._props } as any;
  const fieldSchema = useFieldSchema();
  const parent = useRecord();
  const hasApproval = true;
  // const leftFlex = hasApproval ? 0.15 : 0.3;
  const boxRef = useRef(null);
  const queryFormRef = useRef(null);
  const size = useSize(boxRef);
  const { service } = useBlockRequestContext();
  const field: IField = useField();
  const [refreshAction, setRefreshAction] = useState(false);
  

  const [userAction, setUserAction] = useState('create');
  const { height } = useFixedBlock();
  const otherHeight = field?.decoratorProps?.otherHeight;
  const isFixed = field?.decoratorProps?.isFixed ? field?.decoratorProps?.isFixed : false;
  const vHeight = otherHeight ? `calc(100vh - ${height} - ${otherHeight})` : `calc(100vh - ${height})`;
  const [blockCtx, setBlockCtx] = useState(null);
  const [expandAll, setExpandAll] = useState(true);
  const { getCollectionJoinField } = useCollectionManager();
  const [filterFormLoaded, setFilterFormLoaded] = useState(true);
  const treeSchema = fieldSchema.properties.tree;
  // const [treeSchema, setTreeSchema] = useState(null);
  const _filterFormSchema = fieldSchema.properties.filterForm;
  const { getDataBlocks } = useFilterBlock();
  const [treeBlock, setTreeBlock] = useState(null);
  const [loadingFormBlock, setLoadingFormBlock] = useState(false);


  const doFilterParams = (formValues, fieldSchema, treeSchema) => {
    if (formValues && fieldSchema && treeSchema) {
      const param = treeSchema['x-decorator-props']['params'] || {};
      // 保留原有的 filter
      const storedFilter = {};
      storedFilter['form'] = removeNullCondition(
        transformToFilter(formValues, fieldSchema, getCollectionJoinField, collection),
      );
      const mergedFilter = mergeFilter([...Object.values(storedFilter).map((filter) => removeNullCondition(filter))]);
      return {
        ...param,
        filter: mergedFilter,
      };
    }
    return null;
  };

  const doFilterByBlock = () => {
    if (!treeSchema) {
      return;
    }
    const block = field.data?.blockCtx;
    if (!block) {
      return;
    }

    const filterFormValues = field.data?.filterFormValues;
    const filterFormSchema = field.data?.filterFormSchema;
    const param = block.service.params?.[0] || {};
    // 保留原有的 filter
    const storedFilter = block.service.params?.[1]?.filters || {};
    storedFilter[fieldSchema['x-uid']] = removeNullCondition(
      transformToFilter(filterFormValues, filterFormSchema, getCollectionJoinField, collection),
    );
    const mergedFilter = mergeFilter([...Object.values(storedFilter).map((filter) => removeNullCondition(filter))]);
    block.service.run(
      {
        ...param,
        filter: mergedFilter,
      },
      { filters: storedFilter },
    );
  };
  useEffect(() => {
    if (!filterFormLoaded) {
      const filterFormValues = field.data?.filterFormValues;
      const filterFormSchema = field.data?.filterFormSchema;
      const params = doFilterParams(filterFormValues, filterFormSchema, treeSchema);
      if (treeSchema && params) {
        treeSchema['x-decorator-props']['params'] = params;
      }
      setLoadingFormBlock(true);
    } 
  }, [treeSchema, field]);
  const prjRecord = {};

  const [record, setRecord] = useState(null);
  useEffect(() => {
   setLoadingFormBlock(false);
    if (record?.id) {
      setUserAction('update');
    } else {
      setUserAction('create');
    }
    setTimeout(() => {
      setLoadingFormBlock(true);
    },1000);
  }, [record?.id]);
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [leftFlex, setLeftFlex] = useState(_leftFlex);
  const [rightFlex, setRightFlex] = useState(_rightFlex);
  const { designable, dn } = useDesignable();
  const onStopResize = ({ component }, key) => {
    const flex = component.props.flex;
    if (designable) {
      const compProps = fieldSchema['x-component-props'] || {};
      set(compProps, key, flex);
      const schema: any = {
        ['x-uid']: fieldSchema['x-uid'],
      };
      schema['x-component-props'] = compProps;
      dn.emit('patch', {
        schema,
      });
    } else {
      switch (key) {
        case 'leftFlex':
          setLeftFlex(flex);
          break;
        case 'rightFlex':
          setRightFlex(flex);
          break;
      }
    }
  };

  return (
    <CardItem
      ref={boxRef}
      className={css`
        > .ant-card-body {
          padding: ${token.padding}px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      `}
      style={{
        height: isFixed ? vHeight : undefined,
      }}
    >
      <CollectionProvider name={collection}>
        <TreeFormBlockContext.Provider
          value={{
            userAction,
            setUserAction,
            record,
            setRecord,
            collection,
            refreshAction,
            setRefreshAction,
            expandedKeys,
            setExpandedKeys,
            blockCtx,
            setBlockCtx,
            expandAll,
            setExpandAll,
            doFilterByBlock,
            treeBlock,
            treeSchema,
            field,
            filterFormLoaded,
            setFilterFormLoaded,
          }}
        >
          <div
            className={cls(
              `filterForm `,
              css`
                .ant-card {
                  box-shadow: none;
                  margin-bottom: 0;
                  .nb-action-bar {
                    display: ${designable ? 'flex' : 'none!important'};
                  }
                  .ant-card-body {
                    // padding: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                  }
                }
              `,
              !designable
                ? css`
                    .ant-nb-card-item {
                      height: 44px;
                      overflow: hidden;
                    }
                  `
                : '',
            )}
            ref={queryFormRef}
          >
            <RecursionField name={'filterForm'} schema={fieldSchema.properties.filterForm} />
          </div>

          <ReflexContainer
            orientation="vertical"
            className={css`
              border: 1px solid ${token.colorBorder};
              height: 100%;
              .pane-container:not(.multi-rows) {
                height: 100%;
                & > div:not(.multi-rows) {
                  height: 100%;
                  & > .nb-fixed-block,
                  & > .nb-fixed-block > .ant-nb-card-item {
                    height: 100%;
                  }
                  .ant-card {
                    box-shadow: none;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    .ant-card-body {
                      padding: ${token.padding}px;
                      flex-grow: 1;
                      display: flex;
                      flex-direction: column;
                      overflow: auto;
                      .nb-action-bar + div {
                        flex-grow: 1;
                      }
                    }
                  }
                }
              }
              &.reflex-container.vertical > .reflex-splitter {
                border-left-color: ${token.colorBorder};
                border-right-color: ${token.colorBorder};
              }
            `}
          >
            <ReflexElement
              className="left-tree"
              flex={leftFlex}
              onStopResize={(arg) => {
                onStopResize(arg, 'leftFlex');
              }}
            >
              <div className={'pane-container'}>
                {filterFormLoaded ? <RecursionField name={'tree'} schema={treeSchema} /> : <Spin />}
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement className={'main'}>
              <div
                ref={boxRef}
                className={
                  'pane-container multi-rows ' +
                  css`
                    padding: 10px;
                    .form-container {
                      // overflow-x: hidden;
                      .ant-formily-layout {
                        width: 100%;
                        overflow-x: hidden;
                      }
                    }
                    .ant-card {
                      box-shadow: none;
                      margin-bottom: 0;
                    }
                  `
                }
              >
                <div
                  className={css`
                    margin-bottom: 8px;
                  `}
                >
                  <RecursionField name={'actions'} schema={fieldSchema.properties.actions} />
                </div>
                <div className="form-container">
                  {loadingFormBlock ? (
                    <RecordProvider record={prjRecord}>
                      <RecordProvider record={record}>
                        {['create', 'createAndAddChild'].includes(userAction) && (
                          <RecursionField name={'create-form'} schema={fieldSchema.properties.form.properties.add} />
                        )}
                        {userAction == 'update'  && (
                          <RecursionField name={'update-form'} schema={fieldSchema.properties.form.properties.update} />
                        )}
                      </RecordProvider>
                    </RecordProvider>
                  ) : (
                    <Spin />
                  )}
                </div>
              </div>
            </ReflexElement>
            {/* 有审批流程则显示 */}
            {hasApproval && <ReflexSplitter />}
            {hasApproval && (
              <ReflexElement
                className="middle"
                flex={rightFlex}
                onStopResize={(arg) => {
                  onStopResize(arg, 'rightFlex');
                }}
              >
                <div className={'pane-container'}>
                  {/* <RecursionField
              name={'approveRecords'}
              schema={{
                // type: 'void',
                // "x-acl-action": "wl_info:view",
                // 'x-decorator': 'ApprovalTimeline.Provider',
                // 'x-component': 'CardItem',
                // 'x-component-props': {
                //   title: '审批记录',
                //   className: 'pane-container-card',
                // },
                // 'x-designer': 'ApprovalTimeline.Designer',
                // properties: {
                //   [uid()]: {
                //     type: 'array',
                //     title: '审批记录',
                //     'x-component': 'ApprovalTimeline',

                //   },
                // },
                type: 'void',
                'x-component': 'CardItem',
                'x-component-props': {
                  title: '审批记录',
                  className: 'pane-container-card',
                },
                'x-acl-action': 'wl_info:view',
                'x-decorator': 'GridCard.Decorator',
                'x-decorator-props': {
                  resource: 'wl_info',
                  collection: 'wl_info',
                  readPretty: true,
                  action: 'list',
                  params: {
                    pageSize: 12,
                  },
                  runWhenParamsChanged: true,
                  rowKey: 'id',
                },

                'x-designer': 'GridCard.Designer',
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'BlockItem',
                    'x-component-props': {
                      useProps: '{{ useGridCardBlockItemProps }}',
                    },
                    properties: {
                      actionBar: {
                        version: '2.0',
                        type: 'void',
                        'x-initializer': 'GridCardActionInitializers',
                        'x-component': 'ActionBar',
                        'x-component-props': {
                          style: {
                            marginBottom: 'var(--nb-spacing)',
                          },
                        },
                      },
                      list: {
                        version: '2.0',
                        type: 'array',
                        'x-component': 'ApprovalTimeline',
                        'x-component-props': {
                          useProps: '{{ useGridCardBlockProps }}',
                        },
                        properties: {
                          item: {
                            version: '2.0',
                            type: 'object',
                            'x-component': 'GridCard.Item',
                            'x-read-pretty': true,
                            'x-component-props': {
                              useProps: '{{ useGridCardItemProps }}',
                            },
                            properties: {
                              grid: {
                                version: '2.0',
                                type: 'void',
                                'x-component': 'Grid',
                                'x-initializer': 'ReadPrettyFormItemInitializers',
                                'x-initializer-props': {
                                  useProps: '{{ useGridCardItemInitializerProps }}',
                                },
                              },
                              actionBar: {
                                version: '2.0',
                                type: 'void',
                                'x-align': 'left',
                                'x-initializer': 'GridCardItemActionInitializers',
                                'x-component': 'ActionBar',
                                'x-component-props': {
                                  useProps: '{{ useGridCardActionBarProps }}',
                                  layout: 'one-column',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                'x-uid': 'wl_info-approval-records',
              }}
            /> */}
                </div>
              </ReflexElement>
            )}
          </ReflexContainer>
        </TreeFormBlockContext.Provider>
      </CollectionProvider>
    </CardItem>
  );
};

export const useTreeFormBlockContext = () => {
  return useContext(TreeFormBlockContext);
};
