import { css } from '@emotion/css';
import { Field } from '@formily/core';
import {  observer, useField } from '@formily/react';
import {
  EllipsisWithTooltip,
  IField,
  Icon,
  useBlockRequestContext,
  useGanttBlockContext,
  useRequest,
  useTableBlockContext,
  useTableSize,
  useToken,
} from '@nocobase/client';
import { default as classNames } from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Table, Tag, Dropdown, App } from 'antd';
import { useAuthTranslation } from '../../locale';
import { pick } from 'lodash';
import { uid } from '@nocobase/utils';
import { useDataSelectBlockContext } from '..';

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
    const { expandFlag, allIncludesChildren } = tableCtx;
    const [expandedKeys, setExpandesKeys] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>(field?.data?.selectedRowKeys || []);
    const [selectedRow, setSelectedRow] = useState([]);
    const dataSource = field?.value?.slice?.()?.filter?.(Boolean) || [];
    const isRowSelect = rowSelection?.type !== 'none';
    const blockCtx = useBlockRequestContext();
    const { t } = useAuthTranslation();
    const { modal } = App.useApp();
    const { record: prjRecord } = useDataSelectBlockContext();
    let onRow = null,
      highlightRow = '';

    if (onClickRow) {
      onRow = (record) => {
        return {
          onClick: (e) => {
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
            width: 70,
            onChange(selectedRowKeys: any[], selectedRows: any[]) {
              field.data = field.data || {};
              field.data.selectedRowKeys = selectedRowKeys;
              setSelectedRowKeys(selectedRowKeys);
              onRowSelectionChange?.(selectedRowKeys, selectedRows);
            },
            renderCell: (checked, record, index, originNode) => {
              const arr = record.__index.split('.');
              const arr1 = arr.map((value)=>{
                return Number(value).valueOf() + 1;
              });
              const  indexStr = arr1.join('.');
              return (
                <div
                  className={classNames(
                    checked ? 'checked' : null,
                    css`
                      position: relative;
                      display: flex;
                      align-items: center;
                      justify-content: space-evenly;
                      padding-right: 8px;
                      width: 100%;
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
                        justify-content: flex-start;
                        width: 100%;
                      `,
                    )}
                  >
                    <div className="nb-table-index">{indexStr}</div>
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
    const renderItems = (record) => {
      const isGroup = record.isGroup;
      const addChildLabel = isGroup ? '添加任务' : '添加子任务';
     
      const items: MenuProps['items'] = [
        {
          label: '编辑',
          icon: <EditOutlined />,
          key: '1',
          onClick: () => {
            const onRecordClick = tableCtx?.field?.onRecordClick;
            if (typeof onRecordClick == 'function') {
              onRecordClick(record, ctx);
            }
          },
        },
        {
          label: addChildLabel,
          key: '2',
          icon: <PlusCircleOutlined />,
          onClick: () => {
            const newRecord:any = {
              __collection:'task'
            };
            newRecord['prj'] = prjRecord;
            if(!isGroup){
              //任务则赋值 项目 项目阶段 父任务
              newRecord.parent = {
                ...record
              }
              newRecord.prjStage = record.prjStage
            }else{
              newRecord[record.fieldCtx.name] = {
                ...pick(record,['id','stage','nickname', 'label'])
              }
            }
            const onRecordClick = tableCtx?.field?.onRecordClick;
            if (typeof onRecordClick == 'function') {
              onRecordClick(newRecord, ctx, true);
            }
          },
        },
      ];
      /**
       * 任务 允许删除
       */
      if (!isGroup) {
        items.push({
          label: '删除',
          icon: <DeleteOutlined />,
          key: '3',
          onClick: () => {
            const { resource, service } = blockCtx;
            const onOk = async () => {
              await resource.destroy({
                filterByTk: record.id,
              });
              await service?.refresh();
            };
            const confirm = {
              title: t('Delete record'),
              content: t('Are you sure you want to delete it?'),
            };
            if (confirm) {
              modal.confirm({
                ...confirm,
                onOk,
              });
            }
          },
        });
      }

      return items;
    };
    const columns: any = [
      {
        title: '分组',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        render: (v, record, index) => {
          const menus = renderItems(record);
          return (
            <div className="ant-description-input">
              <EllipsisWithTooltip ellipsis>
                <Dropdown menu={{ items: menus }} trigger={['contextMenu']}>
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      const onRecordClick = tableCtx?.field?.onRecordClick;
                      if (typeof onRecordClick == 'function') {
                        onRecordClick(record, ctx);
                      }
                    }}
                  >
                    {t(v)}
                  </a>
                </Dropdown>
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
          return v ? (
            <Tag icon={<Icon type={v.icon} />} color={v.color}>
              {v.label}
            </Tag>
          ) : (
            ''
          );
        },
      },
      {
        title: '开始日期',
        width: 120,
        dataIndex: 'start',
        key: 'start',
        render: (v) => {
          return v ? dayjs(v).format('YYYY-MM-DD') : '';
        },
      },
      {
        title: '结束日期',
        width: 120,
        dataIndex: 'end',
        key: 'end',
        render: (v) => {
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
            onRow={onRow}
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
