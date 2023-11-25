import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { CardItem, useToken } from '..';
import { FormProvider, RecursionField, useField, useFieldSchema } from '@formily/react';
import { css } from '@emotion/css';
import { uid } from '@nocobase/utils';
import { LeftTree } from './LeftTree';
import { RecordProvider, useRecord } from '../../../record-provider';
import { Divider, Space } from 'antd';
import { useSize } from 'ahooks';
import { useDesignable } from '../../hooks';
import { IField } from '../../../collection-manager';
import { useBlockRequestContext } from '../../../block-provider';
import { createForm } from '@formily/core';
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
export const TreeFormMain = (props) => {
  const { token } = useToken();
  //   const { useProps } = props;
  //   const { collection, group, pagination, fields, columnActions, ...others } = useProps?.();
  const fieldSchema = useFieldSchema();
  const parent = useRecord();
  const [record,setRecord] = useState({});
  const hasApproval = true;
  const leftFlex = hasApproval ? 0.15 : 0.3;
  const boxRef = useRef(null);
  const queryFormRef = useRef(null);
  const size = useSize(boxRef);
  const designable = useDesignable();
  const { service} = useBlockRequestContext()
  const field:IField = useField();
  // const onSelect = (selectedKeys, info) => {
  //   const selectedKey = selectedKeys[selectedKeys.length - 1];
  //   const record = field?.data?.dataSource?.find((item) => item.id === selectedKey);
  //   setRecord(record);
  // }
  // useEffect(() => {
  //   if (field?.data?.selectedKeys?.length) {
  //     const selectedKeys = field?.data?.selectedKeys;
  //     const selectedKey = selectedKeys[selectedKeys.length - 1];
  //     const record = field?.data?.dataSource?.find((item) => item.id === selectedKey);
  //     setRecord(record);
  //   }
  // }, [ field?.data?.selectedKeys]);
  const updateForm = useMemo(() => {
    return createForm({
      effects(){}
    })
  }, []);
  useEffect(() => {
    if (field?.data?.selectedRowKeys?.length) {
      const selectedRowKeys = field?.data?.selectedRowKeys;
      const selectedKey = selectedRowKeys[selectedRowKeys.length - 1];
      const array = treeToArray(service?.data?.data||[],[])
      const recordValue = array?.find((item) => item.id === selectedKey);
      setRecord({
        ...recordValue,
        __parent:recordValue
      });
    }
  },[field?.value]);
  useEffect(()=>{
    console.log(updateForm.fields);

    
  },[JSON.stringify(record)]);
  return (
    <CardItem
      ref={boxRef}
      className={css`
        > .ant-card-body {
          padding: ${token.padding}px;
        }
      `}
    >
      <div
        className={
          `filterForm ` +
          css`
            .ant-card {
              box-shadow: none;
              margin-bottom: 0;
              .nb-action-bar {
                display: ${designable ? 'flex' : 'none!important'};
              }
              .ant-card-body {
                padding: 0;
              }
            }
          `
        }
        ref={queryFormRef}
      >
        <RecursionField name={'filterForm'} schema={fieldSchema.properties.filterForm} />
      </div>
      <ReflexContainer
        orientation="vertical"
        className={css`
          border: 1px solid ${token.colorBorder};
          height: calc(100% - 44px);
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
        <ReflexElement className="left-tree" flex={leftFlex}>
          <div className={'pane-container'}>
            <RecursionField name={'tree'} schema={fieldSchema.properties.tree} />
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
              {/* <RecordProvider record={record}  isMemo>
                <RecursionField name={'update-form'} schema={fieldSchema.properties.form.properties.update} />
              </RecordProvider> */}
              <RecursionField name={'create-form'} schema={fieldSchema.properties.form.properties.add} />
            </div>

            {/* <RecursionField name={'table'} schema={fieldSchema.properties.table} /> */}
          </div>
        </ReflexElement>
        {/* 有审批流程则显示 */}
        {hasApproval && <ReflexSplitter />}
        {hasApproval && (
          <ReflexElement className="middle" flex={0.15}>
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
    </CardItem>
  );
};
