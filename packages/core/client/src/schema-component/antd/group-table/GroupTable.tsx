import React from 'react';
import { Initializer } from './GoupTable.Initializer';
import { Provider } from './GroupTable.Decorator';
import { Designer } from './GroupTable.Designer';
import { CardItem } from '../card-item';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { css } from '@emotion/css';
import { useToken } from '..';
import { GroupTree, TableMain } from './components';
import { GroupTableGroupRecordActionBar } from './GroupTable.GroupRecordActionBar';
import { GroupTableGroupRecordActionDesigner } from './GroupTable.GroupRecordActionDesigner';
import { RecursionField, useFieldSchema } from '@formily/react';
import { GroupTreeDesigner } from './GroupTable.GroupTreeDesigner';
import { FilterBlockProvider } from '../../../filter-provider';
import { uid } from '@nocobase/utils';
export const GroupTable: any = (props) => {
  const { token } = useToken();
  const { useProps } = props;
  const { collection, group, pagination, fields, columnActions, ...others } = useProps?.();
  const fieldSchema = useFieldSchema();
  const hasApproval = true;
  const leftFlex = hasApproval ? 0.15 : 0.3;
  return (
    <ReflexContainer
      orientation="vertical"
      className={css`
        height: 600px;
        border: 1px solid ${token.colorBorder};
        .pane-container {
          height: 100%;
          > div,
          > div > .nb-fixed-block,
          > div > .nb-fixed-block > .ant-nb-card-item {
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
        &.reflex-container.vertical > .reflex-splitter {
          border-left-color: ${token.colorBorder};
          border-right-color: ${token.colorBorder};
        }
      `}
    >
      <ReflexElement className="left-tree" flex={leftFlex}>
        <div className={'pane-container'}>
          {/* <GroupTree name={`${collection}.${group}`} /> */}
          <RecursionField name={'tree'} schema={fieldSchema.properties.group} />
        </div>
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement className="main">
        <div className="pane-container">
          <RecursionField name={'table'} schema={fieldSchema.properties.table} />
          {/* <TableMain 
            collection={collection}
            resource={collection} 
            action='list'
            fields={fields}
            pagination={pagination}
            columnActions={columnActions}
            // params={{
            //   pageSize: pagination.pageSize || 10,
            //   page: pagination.page || 1
            // }}
            {...others}
          /> */}
        </div>
      </ReflexElement>
      {/* 有审批流程则显示 */}
      {hasApproval && <ReflexSplitter />}
      {hasApproval && (
        <ReflexElement className="middle" flex={0.15}>
          <div className={'pane-container'}>
            <RecursionField
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
                'x-uid': 'wl_info-approval-records'
              }}
            />
          </div>
        </ReflexElement>
      )}
    </ReflexContainer>
  );
};
GroupTable.Wrap = (props) => {
  return (
    <CardItem
      {...props}
      className={css`
        .ant-card-body {
          padding: 0;
        }
      `}
    >
      {props.children}
    </CardItem>
  );
};
GroupTable.Decorator = Provider;
GroupTable.Designer = Designer;
GroupTable.Initializer = Initializer;
GroupTable.GroupRecordActionBar = GroupTableGroupRecordActionBar;
GroupTable.GroupRecordActionDesigner = GroupTableGroupRecordActionDesigner;
GroupTable.GroupTree = GroupTree;
GroupTable.GroupTreeDesigner = GroupTreeDesigner;

GroupTable.filterGroup = (group, filter) => {};
