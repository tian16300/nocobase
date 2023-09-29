import { css } from '@emotion/css';
import { ArrayField, Field } from '@formily/core';
import { RecursionField, Schema, observer, useField, useFieldSchema } from '@formily/react';
import {
  AssociationField,
  CollectionField,
  CollectionProvider,
  EllipsisWithTooltip,
  FormProvider,
  IField,
  RecordIndexProvider,
  RecordLink,
  RecordProvider,
  SchemaComponent,
  SchemaComponentOptions,
  WithoutTableFieldResource,
  useCollectionManager,
  useCompile,
  useGanttBlockContext,
  useRecord,
  useRequest,
  useSchemaInitializer,
  useTableBlockContext,
  useTableSize,
  useToken,
} from '@nocobase/client';
import { uid } from '@nocobase/utils';
import { getValuesByPath } from '@nocobase/utils/client';
import { default as classNames } from 'classnames';
import dayjs from 'dayjs';
import { findIndex } from 'lodash';
import getValueByPath from 'packages/plugins/@nocobase/plugin-theme-editor/src/client/antd-token-previewer/utils/getValueByPath';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { Input, Space, Tag, theme, Tooltip } from 'antd';
import { Button, Space, Table, Tag } from 'antd';
const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.endsWith('.Column') > -1;
};

export const components = {
  body: {
    row: (props) => {
      return <tr {...props} />;
    },
    cell: (props) => (
      <td
        {...props}
        className={classNames(
          props.className,
          css`
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `,
        )}
      />
    ),
  },
};

const useDef = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return [selectedRowKeys, setSelectedRowKeys];
};

const useDefDataSource = (options, props) => {
  const field = useField<Field>();
  return useRequest(() => {
    return Promise.resolve({
      data: field.value,
    });
  }, options);
};

const groupColumns = [
  {
    dataIndex: 'name',
    key: 'name',
  },
];

type CategorizeKey = 'primaryAndForeignKey' | 'relation' | 'systemInfo' | 'basic';
const CategorizeKeyNameMap = new Map<CategorizeKey, string>([
  ['primaryAndForeignKey', 'PK & FK fields'],
  ['relation', 'Association fields'],
  ['systemInfo', 'System fields'],
  ['basic', 'General fields'],
]);

interface CategorizeDataItem {
  key: CategorizeKey;
  name: string;
  data: Array<any>;
}
const PrjStageRecordViewer = (props) => {
  const { getCollectionField } = useCollectionManager();
  const fieldSchema = useFieldSchema();
  const { record } = props;
  const resourceName = 'task';
  const isGroup = record.isGroup;
  const groupField = record.groupType;
  const fieldName = 'status';
  const collectionFieldName = [resourceName, fieldName].join('.');
  const def = record[fieldName];
  const collectionField = getCollectionField(collectionFieldName);
  const schema = {
    type: 'string',
    'x-collection-field': collectionFieldName,
    'x-component': 'CollectionField',
    'x-component-props': {
      ellipsis: true,
      size: 'small',
      fieldNames: {
        label: 'label',
        value: 'id',
      },
      service: {
        params: {
          sort: 'id',
        },
      },
      mode: 'Select',
    },
    'x-decorator': null,
    'x-decorator-props': {
      labelStyle: {
        display: 'none',
      },
    },
    default: def,
  };
  return (
    <>
      {!isGroup && collectionField && (
        <CollectionProvider name={collectionField?.target ?? collectionField?.targetCollection}>
          <RecordProvider record={record[record.fieldName]}>
            <RecordProvider record={record}>
              <WithoutTableFieldResource.Provider value={true}>
                <FormProvider>
                  <RecursionField schema={schema} name={record.groupType} />
                </FormProvider>
              </WithoutTableFieldResource.Provider>
            </RecordProvider>
          </RecordProvider>
        </CollectionProvider>
      )}
    </>
  );
};
const TaskRecordViewer = (props) => {
  const fieldSchema = useFieldSchema();
  const { record } = props;
  const schema = {
    type: 'string',
    'x-collection-field': 'task.prjStage',
    'x-component': 'CollectionField',
    'x-component-props': {
      ellipsis: true,
      size: 'small',
      fieldNames: {
        label: 'stage.label',
        value: 'id',
      },
      service: {
        params: {
          appends: 'stage',
          sort: 'id',
        },
      },
      mode: 'Select',
    },
    'x-decorator': null,
    'x-decorator-props': {
      labelStyle: {
        display: 'none',
      },
    },
    default: record['prjStage'],
  };
  return (
    <>
      <CollectionProvider name={'prj_plan'}>
        <RecordProvider record={record['prjStage']}>
          <RecordProvider record={record}>
            <WithoutTableFieldResource.Provider value={true}>
              <FormProvider>
                <RecursionField schema={schema} name={'prjStage'} />
              </FormProvider>
            </WithoutTableFieldResource.Provider>
          </RecordProvider>
        </RecordProvider>
      </CollectionProvider>
    </>
  );
};
export const PrjWorkPlanTable: React.FC<any> = observer(
  (props) => {
    const { token } = useToken();
    const { pagination: pagination1, useProps, onChange, ...others1 } = props;
    const { pagination: pagination2, onClickRow, ...others2 } = useProps?.() || {};
    const {
      dragSort = false,
      showIndex = true,
      onRowSelectionChange,
      onChange: onTableChange,
      rowSelection,
      rowKey,
      required,
      onExpand,
      ...others
    } = { ...others1, ...others2 } as any;
    const field: IField = useField();

    const tableCtx = useTableBlockContext();
    const ctx = useGanttBlockContext();
    // const onRecordClick = useMemo(() => {
    //   return tableCtx.field.onRecordClick;
    // }, []);
    const fieldSchema = useFieldSchema();
    const { expandFlag, allIncludesChildren } = tableCtx;
    const [expandedKeys, setExpandesKeys] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>(field?.data?.selectedRowKeys || []);
    const [selectedRow, setSelectedRow] = useState([]);
    const dataSource = field?.value?.slice?.()?.filter?.(Boolean) || [];
    const isRowSelect = rowSelection?.type !== 'none';
    const compile = useCompile();
    let onRow = null,
      highlightRow = '';

    if (onClickRow) {
      onRow = (record) => {
        return {
          onClick: (e) => {
            // if (isPortalInBody(e.target)) {
            //   return;
            // }
            onClickRow(record, setSelectedRow, selectedRow);
          },
        };
      };
      highlightRow = css`
        & > td {
          background-color: ${token.controlItemBgActiveHover} !important;
        }
        &:hover > td {
          background-color: ${token.controlItemBgActiveHover} !important;
        }
      `;
    }

    useEffect(() => {
      if (expandFlag) {
        setExpandesKeys(allIncludesChildren);
      } else {
        setExpandesKeys([]);
      }
    }, [expandFlag, allIncludesChildren]);
    const defaultRowKey = (record: any) => {
      return field.value?.indexOf?.(record);
    };

    const getRowKey = (record: any) => {
      if (typeof rowKey === 'string') {
        return record[rowKey]?.toString();
      } else {
        return (rowKey ?? defaultRowKey)(record)?.toString();
      }
    };
    const restProps = {
      rowSelection: rowSelection
        ? {
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys: any[], selectedRows: any[]) {
              field.data = field.data || {};
              field.data.selectedRowKeys = selectedRowKeys;
              setSelectedRowKeys(selectedRowKeys);
              onRowSelectionChange?.(selectedRowKeys, selectedRows);
            },
            renderCell: (checked, record, index, originNode) => {
              // if (!dragSort && !showIndex) {
              //   return originNode;
              // }
              // const current = props?.pagination?.current;
              // const pageSize = props?.pagination?.pageSize || 20;
              // if (current) {
              //   index = index + (current - 1) * pageSize + 1;
              // } else {
              //   index = index + 1;
              // }
              // if (record.__index) {
              //   index = extractIndex(record.__index);
              // }
              return (
                <div
                  className={classNames(
                    checked ? 'checked' : null,
                    css`
                      position: relative;
                      display: flex;
                      float: left;
                      align-items: center;
                      justify-content: space-evenly;
                      padding-right: 8px;
                      .nb-table-index {
                        opacity: 0;
                      }
                      &:not(.checked) {
                        .nb-table-index {
                          opacity: 1;
                        }
                      }
                    `,
                    {
                      [css`
                        &:hover {
                          .nb-table-index {
                            opacity: 0;
                          }
                          .nb-origin-node {
                            display: block;
                          }
                        }
                      `]: isRowSelect,
                    },
                  )}
                >
                  <div
                    className={classNames(
                      checked ? 'checked' : null,
                      css`
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: space-evenly;
                      `,
                    )}
                  >
                    {/* {showIndex && <TableIndex index={index} />} */}
                  </div>
                  {isRowSelect && (
                    <div
                      className={classNames(
                        'nb-origin-node',
                        checked ? 'checked' : null,
                        css`
                          position: absolute;
                          right: 50%;
                          transform: translateX(50%);
                          &:not(.checked) {
                            display: none;
                          }
                        `,
                      )}
                    >
                      {originNode}
                    </div>
                  )}
                </div>
              );
            },
            ...rowSelection,
          }
        : undefined,
    };
    const { height: tableHeight, tableSizeRefCallback } = useTableSize();
    const scroll = useMemo(() => {
      return {
        x: 'max-content',
        y: tableHeight,
      };
    }, [tableHeight]);
    const columns: any = [
      // {
      //   title: '序号',
      //   width: 100,
      //   dataIndex: '__index',
      //   key: '__index',
      //   render:(v, record,index)=>{
      //     return v;
      //   }
      // },
      {
        title: '分组',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        render: (v, record, index) => {
          return (
            <div
              className="ant-description-input"
              // className={css`
              //   display:inline-block;
              //   .ant-btn {
              //     padding: 0;
              //     margin-top: -6px;
              //     text-align: left;
              //     height: 21px;
              //     line-height:21px;
              //     width:
              //     // > span {
              //     //   display: block;
              //     //   overflow: hidden;
              //     //   overflow-wrap: break-word;
              //     //   text-overflow: ellipsis;
              //     //   white-space: nowrap;
              //     //   word-break: break-all;
              //     // }
              //   }
              // `}
            >
              {/* <Button
                type="link"
                size="middle"
                onClick={() => {
                  const onRecordClick = tableCtx?.field?.onRecordClick;
                  if (typeof onRecordClick == 'function') {
                    onRecordClick(record, ctx);
                  }
                }}
              >
              
              </Button> */}
              <EllipsisWithTooltip ellipsis>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    const onRecordClick = tableCtx?.field?.onRecordClick;
                    if (typeof onRecordClick == 'function') {
                      onRecordClick(record, ctx);
                    }
                  }}
                >
                  {compile(v)}
                </a>
              </EllipsisWithTooltip>
            </div>
          );
        },
      },
      {
        title: '负责人',
        width: 100,
        dataIndex: 'user',
        key: 'user',
        render: (v, record, index) => {
          const collection = record.__collection;
          return collection == 'task' && v ? (
            <EllipsisWithTooltip ellipsis>
              <Tag>
                <a>{v.nickname}</a>
              </Tag>
            </EllipsisWithTooltip>
          ) : (
            ''
          );
        },
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        key: 'status',
        render: (v, record, index) => {
          // const collection = record.__collection;
          return v?.label;
        },
      },
      {
        title: '开始日期',
        width: 120,
        dataIndex: 'start',
        key: 'start',
        render: (v, record, index) => {
          const collection = record.__collection;
          return v ? dayjs(v).format('YYYY-MM-DD') : '';
        },
      },
      {
        title: '结束日期',
        width: 120,
        dataIndex: 'end',
        key: 'end',
        render: (v, record, index) => {
          return v ? dayjs(v).format('YYYY-MM-DD') : '';
        },
      },
    ];
    return (
      <>
        <div
          className={css`
            height: 100%;
            overflow: hidden;
            .ant-table-wrapper {
              height: 100%;
              .ant-spin-nested-loading {
                height: 100%;
                .ant-spin-container {
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                }
              }
            }
            .ant-table {
              overflow-x: auto;
              overflow-y: hidden;
            }
          `}
        >
          <Table
            ref={tableSizeRefCallback}
            rowKey={rowKey ?? defaultRowKey}
            dataSource={dataSource}
            {...others}
            {...restProps}
            pagination={false}
            onChange={(pagination, filters, sorter, extra) => {
              onTableChange?.(pagination, filters, sorter, extra);
            }}
            // onRow={onRow}
            rowClassName={(record) => (selectedRow.includes(record[rowKey]) ? highlightRow : '')}
            tableLayout={'auto'}
            scroll={scroll}
            columns={columns}
            expandable={{
              onExpand: (flag, record) => {
                const newKeys = flag
                  ? [...expandedKeys, record[rowKey]]
                  : expandedKeys.filter((i) => record[rowKey] !== i);
                setExpandesKeys(newKeys);
                onExpand?.(flag, record);
              },
              expandedRowKeys: expandedKeys,
            }}
          />
        </div>
      </>
    );
  },
  { displayName: 'PrjWorkPlanTable' },
);
