import { css } from '@emotion/css';
import { Field } from '@formily/core';
import { observer, useField, useFieldSchema } from '@formily/react';
import {
  DatePicker,
  EllipsisWithTooltip,
  IField,
  Icon,
  useAPIClient,
  useBlockRequestContext,
  useGanttBlockContext,
  useRequest,
  useTableBlockContext,
  useTableSize,
  useToken,
} from '@nocobase/client';
import { default as classNames } from 'classnames';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  EditOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ZoomInOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Table, Tag, Dropdown, App, Row, Col, Button, Form, Input, Space } from 'antd';
import { useAuthTranslation } from '../../locale';
import { pick } from 'lodash';
import { useDataSelectBlockContext } from '..';
import template from 'lodash/template';
import { useNavigate } from 'react-router';
import { getValuesByPath } from '@nocobase/utils/client';
import type { FormInstance } from 'antd/es/form';
import { usePrjWorkPlanProviderContext } from './PrjWorkPlanProvider';
const EditableContext = React.createContext<FormInstance<any> | null>(null);
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
interface EditableRowProps {
  index: number;
}
const { RangePicker } = DatePicker;
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  editing?: boolean;
  handleSave: (record: any) => void;
  getPopupContainer?: () => HTMLDivElement;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editing,
  getPopupContainer,
  ...restProps
}) => {
  const form = useContext(EditableContext)!;
  
  
  // form.setFieldsValue({ [dataIndex]: [
  //   dayjs(record?.start).format('YYYY-MM-DD'),
  //   dayjs(record?.end).format('YYYY-MM-DD')
  // ] });

  let childNode = children;
  // if (editable && editing) {
  //   form.setFieldValue('range', [record.start ? dayjs(record.start) : null, record.end ? dayjs(record.end) : null]);
  // }
  
 

  if (editable) {
    const rangeValue = [record?.start, record?.end];
    form.setFieldValue(dataIndex, [record?.start, record?.end]);
    const [range,setRange] = useState(rangeValue);

    const setValue = (value) => {
      form.setFieldValue(dataIndex, value);
      setRange(value);
    };
    const save = async (value) => {
      try {
        const values = await form.validateFields();
        // const { range } = values;
        const [start,end] = range as string[];
        const {start: _start,end: _end, ...others} = record;
        handleSave({ ...others, start,end });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 必填`,
          },
        ]}
      >
        <Space.Compact size="small">
          <RangePicker
            getPopupContainer={getPopupContainer}
            format='YYYY-MM-DD'
            value={range}
            onChange={setValue}
          ></RangePicker>
          <Button type="primary" onClick={save}>
            确定
          </Button>
        </Space.Compact>
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
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
      prjStageVersionLink = '',
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
    const { editing, setEditing } = usePrjWorkPlanProviderContext();
    const containerRef = useRef<HTMLDivElement>();
    let navigate = useNavigate();
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
            fixed:true,
            width:50,
            onChange(selectedRowKeys: any[], selectedRows: any[]) {
              field.data = field.data || {};
              field.data.selectedRowKeys = selectedRowKeys;
              setSelectedRowKeys(selectedRowKeys);
              onRowSelectionChange?.(selectedRowKeys, selectedRows);
            },
            renderCell: (checked, record, index, originNode) => {
              const arr = record.__index.split('.');
              const arr1 = arr.map((value) => {
                return Number(value).valueOf() + 1;
              });
              const indexStr = arr1.join('.');
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
            const newRecord: any = {
              __collection: 'task',
              schemaName: 'createTask',
            };
            newRecord['prj'] = prjRecord;
            if (!isGroup) {
              //任务则赋值 项目 项目阶段 父任务
              newRecord.parent = {
                ...record,
              };
              newRecord.prjStage = record.prjStage;
            } else {
              newRecord[record.fieldCtx.name] = {
                ...pick(record, ['id', 'stage', 'nickname', 'label']),
              };
            }
            const onRecordClick = tableCtx?.field?.onRecordClick;
            if (typeof onRecordClick == 'function') {
              onRecordClick(newRecord, ctx, true);
            }
          },
        },
      ];
      /**
       * 项目阶段链接
       */
      if (record.__collection == 'prj_plan_latest') {
        const to = prjStageVersionLink;
        const compiled = template(to || '');
        const toHref = compiled({ record: record || {} });
        items.push({
          label: '历史计划',
          icon: <ZoomInOutlined />,
          key: '3',
          onClick: (event) => {
            navigate(toHref);
          },
        });
      }
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
    // const [editing, setEditing] = useState(false);
    const handleEdit = () => {
      setEditing(!editing);
    };
    const handleCancel = () => {
      setEditing(false);
    };
    const defaultColumns: any = [
      {
        title: () => {
          return (
            <Row>
              <Col span={18}>分组</Col>
              <Col
                span={6}
                className={css`
                  text-align: right;
                `}
              >
                {
                  <Button
                    size="small"
                    type={editing ? 'primary' : 'text'}
                    icon={<ColumnWidthOutlined />}
                    onClick={handleEdit}
                  ></Button>
                }
              </Col>
            </Row>
          );
        },
        width: 'auto',
        dataIndex: 'title',
        key: 'title',
        render: (v, record, index) => {
          const { fieldCtx } = record;
          const value = fieldCtx ? getValuesByPath(record, fieldCtx.title, '') : record.title;
          const menus = renderItems(record);
          return (
            <div className="ant-description-input">
              <EllipsisWithTooltip ellipsis>
                <Dropdown menu={{ items: menus }} trigger={['contextMenu']} getPopupContainer={getPopupContainer}>
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      const onRecordClick = tableCtx?.field?.onRecordClick;
                      if (typeof onRecordClick == 'function') {
                        onRecordClick(record, ctx);
                      }
                    }}
                  >
                    {value}
                  </a>
                </Dropdown>
              </EllipsisWithTooltip>
            </div>
          );
        },
      },
      {
        title: '时间范围',
        width: 360,
        dataIndex: 'range',
        key: 'range',
        editable: true,
      },
      {
        title: '负责人',
        width: 90,
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
        width: 90,
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
      // {
      //   title: '开始日期',
      //   width: 120,
      //   dataIndex: 'start',
      //   key: 'start',
      //   render: (v) => {
      //     return v ? dayjs(v).format('YYYY-MM-DD') : '';
      //   },
      // },
      // {
      //   title: '结束日期',
      //   width: 120,
      //   dataIndex: 'end',
      //   key: 'end',
      //   render: (v) => {
      //     return v ? dayjs(v).format('YYYY-MM-DD') : '';
      //   },
      // },
    ];
    const api = useAPIClient();
    const handleSave = (record) => {
      // const newData = [...dataSource];
      // const index = newData.findIndex((item) => row.key === item.key);
      // const item = newData[index];
      // newData.splice(index, 1, {
      //   ...item,
      //   ...row,
      // });
      /* 保存数据 */
      const { id, start, end, fieldCtx } = record;
      api
        .request({
          url: `${record.__collection}:update?filterByTk=${record.id}`,
          method: 'post',
          data: {
            id,
            start,
            end,
          },
        })
        .then((res) => {
          if (res.data) {
            /* 保存成功 */
            /* 刷新数据 */
            const { refresh } = fieldCtx.blockCtx.service;
            refresh();
          }
        });
    };
    const columns = defaultColumns
      .filter(({ editable }) => {
        return editing ? true : !editable;
      })
      .map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          textWrap: 'word-break',
          ellipsis: true,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            editing,
            handleSave,
            getPopupContainer,
          }),
        };
      });
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    return (
      <>
        <div
          ref={containerRef}
          className={css`
            height: 100%;
            overflow: hidden;
            max-width: 786px;
            min-width: 426px;
            .ant-table-wrapper {
              height: 100%;
              .ant-spin-nested-loading {
                height: 100%;
                .ant-spin-container {
                  height: 100%;
                  // display: flex;
                  // flex-direction: column;
                }
              }
            }
            .ant-table {
              // overflow-x: auto;
              overflow-y: hidden;
            }
            .ant-table-wrapper .ant-table-thead > tr > th,
            .ant-table-wrapper .ant-table-tbody > tr > th,
            .ant-table-wrapper .ant-table-tbody > tr > td,
            .ant-table-wrapper tfoot > tr > th,
            .ant-table-wrapper tfoot > tr > td {
              padding: 10px 16px;
            }
          `}
        >
          <Table
            ref={tableSizeRefCallback}
            rowKey={rowKey ?? defaultRowKey}
            components={components}
            dataSource={dataSource}
            {...others}
            {...restProps}
            pagination={false}
            onChange={(pagination, filters, sorter, extra) => {
              onTableChange?.(pagination, filters, sorter, extra);
            }}
            onRow={onRow}
            rowClassName={(record) => {
              return selectedRow.includes(record[rowKey]) ? highlightRow + ' editable-row' : 'editable-row';
            }}
            // tableLayout={'fixed'}
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
