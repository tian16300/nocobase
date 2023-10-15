import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PrjPlanCompareProvider } from './PrjPlanCompareProvider';
import {
  CardItem,
  EllipsisWithTooltip,
  Gantt,
  IField,
  Icon,
  SchemaInitializer,
  css,
  useBlockRequestContext,
  useGanttBlockContext,
  useTableBlockContext,
  useTableSize,
  useToken,
} from '@nocobase/client';
import { observer, useField } from '@formily/react';
import { createPrjPlanCompare } from '../../utils';
import { TableOutlined } from '@ant-design/icons';
import { Table, Spin, App, Tag, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useAuthTranslation } from '../../locale';
import { default as classNames } from 'classnames';
import { dayjs } from '@nocobase/utils';
import { ZoomInOutlined } from '@ant-design/icons';
export const PrjPlanCompare = () => {
  return <></>;
};
PrjPlanCompare.Wrap = ({ children }) => {
  const { service } = useBlockRequestContext();
  const ctx = useGanttBlockContext();
  const loading = service?.loading || ctx.service?.loading;
  return (
    <CardItem
      bodyStyle={{
        height: '100%',
      }}
      className={css`
        .gantt-view-form .ant-formily-layout [data-testid='prj-item'] .ant-formily-item-control {
          width: 200px;
        }
      `}
    >
      {loading ? (
        <div
          className={css`
            height: 100%;
            justify-content: center;
            display: flex;
            align-items: center;
          `}
        >
          <Spin />
        </div>
      ) : (
        children
      )}
    </CardItem>
  );
};

PrjPlanCompare.Designer = Gantt.Designer;
PrjPlanCompare.Decorator = PrjPlanCompareProvider;

PrjPlanCompare.initializer = (props) => {
  const { insert } = props;
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<TableOutlined />}
      onClick={() => {
        const s = createPrjPlanCompare();
        insert(s);
      }}
    />
  );
};

PrjPlanCompare.Table = observer((props: any) => {
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
  // const { record: prjRecord } = useDataSelectBlockContext();
  const containerRef = useRef<HTMLDivElement>();
  const getPopupContainer = () => {
    return containerRef.current;
  };
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
            const indexStr = index + 1;
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
                      justify-content: center;
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
  // const dtRender = (v) => {
  //   const date = dayjs(v);
  //   const formatStr = 'YYYY-MM-DD';
  //   return date.isValid() ? date.format(formatStr) : '';
  // };
  // const getDays = (start, end) => {
  //   var x = dayjs(start, { utc: false });
  //   var y = dayjs(end, { utc: false });
  //   if (x.isValid() && y.isValid()) {
  //     var duration = dayjs.duration(y.diff(x));
  //     const value = duration.as('days');
  //     return Math.round(value * 10) / 10 + '天';
  //   }
  //   return '';
  // };
  const renderItems = (params) => {
    const record1 = params.data[0];
    const record2 = params.data[1];

    const items: MenuProps['items'] = [
      {
        label: '当前版本',
        icon: <ZoomInOutlined />,
        key: '1',
        onClick: () => {
          const onRecordClick = tableCtx?.field?.onRecordClick;
          if (typeof onRecordClick == 'function') {
            onRecordClick(record1, ctx);
          }
        },
      },
      {
        label: '对比版本',
        key: '2',
        icon: <ZoomInOutlined />,
        onClick: () => {
          const onRecordClick = tableCtx?.field?.onRecordClick;
          if (typeof onRecordClick == 'function') {
            onRecordClick(record2, ctx);
          }
        },
      },
    ];

    return items;
  };
  const columns: any = [
    {
      title: '里程碑',
      dataIndex: 'title',
      key: 'title',
      render: (v, record, index) => {
        const menus = renderItems(record);
        return (
          <div className="ant-description-input">
            <EllipsisWithTooltip ellipsis>
              <Dropdown menu={{ items: menus }} trigger={['contextMenu']} getPopupContainer={getPopupContainer}>
                <Tag
                  color={record.hasDiff.isDiff ? '#f50' : 'default'}
                  onClick={() => {
                    const onRecordClick = tableCtx?.field?.onRecordClick;
                    if (typeof onRecordClick == 'function') {
                      onRecordClick(record.data[0], ctx);
                    }
                  }}
                >
                  {t(v)}
                </Tag>
              </Dropdown>
            </EllipsisWithTooltip>
          </div>
        );
      },
    },
    // {
    //   title: '当前版本',

    //   children: [
    //     {
    //       title: '开始',
    //       dataIndex: 'start',
    //       key: 'start',
    //       render: dtRender,
    //     },
    //     {
    //       title: '结束',
    //       dataIndex: 'end',
    //       key: 'end',
    //       render: dtRender,
    //     },
    //     {
    //       title: '工期',
    //       width: 80,
    //       render:(text, record)=>{
    //         const {start, end} = record;
    //         return getDays(start, end);
    //       }
    //     },
    //   ],
    // },
    // {
    //   title: '对比版本',
    //   children: [
    //     {
    //       title: '开始',
    //       dataIndex: 'comp',
    //       key: 'comp.start',
    //       render: (v)=>{
    //         return dtRender(v.start)
    //       },
    //     },
    //     {
    //       title: '结束',
    //       dataIndex: 'comp',
    //       key: 'comp.end',
    //       render: (v)=>{
    //         return dtRender(v.end)
    //       }
    //     },
    //     {
    //       title: '工期',
    //       width: 80,
    //       render:(v, record)=>{
    //         const {start, end} = record.comp;
    //         return getDays(start, end);
    //       }
    //     },
    //   ],
    // },
  ];
  return (
    <>
      <div
        ref={containerRef}
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
          .ant-table-wrapper .ant-table.ant-table-bordered > .ant-table-container {
            border-inline-start-width: 0;
            border-top-width: 0;
          }
        `}
      >
        <Table
          ref={tableSizeRefCallback}
          rowKey={rowKey ?? defaultRowKey}
          dataSource={dataSource}
          {...others}
          {...restProps}
          bordered
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
});
