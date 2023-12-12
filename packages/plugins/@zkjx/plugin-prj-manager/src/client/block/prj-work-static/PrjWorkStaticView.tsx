import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer, ISchema, RecursionField, useField, useFieldSchema } from '@formily/react';
import { usePrjWorkProviderContext } from './PrjWorkProvider';
import { createForm, Field } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Table, Tag } from 'antd';
import { dayjs, uid } from '@nocobase/utils';
import CountUp from 'react-countup';
import { Col, Row, Statistic, Card, Typography, Divider, Spin, Tooltip, Modal } from 'antd';
import {
  Action,
  ActionContextProvider,
  G2PlotRenderer,
  Icon,
  SchemaComponent,
  SchemaComponentProvider,
  TableV2,
  css,
  useActionContext,
} from '@nocobase/client';
import { Column } from '@antv/g2plot';
const { Title } = Typography;
const sortByKey = (key, isBool?) => {
  return (a, b) => {
    let c = a[key];
    let d = b[key];
    if (isBool) {
      c = c ? 1 : 0;
      d = d ? 1 : 0;
    }
    return c - d;
  };
};
const renderIndex = (val, record, index) => {
  return <span>{index + 1}</span>;
};

const transformHourToDays = (value) => {
  if (value == null) {
    value = 0;
  }
  if (typeof value == 'string') {
    value = Number(value).valueOf();
  }
  return Math.round((value * 1) / 8) / 1;
};
const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};
const useSubTableProps = () => {};
const SubTable = observer(
  (props) => {
    const field = useField<Field>();
    // const schema = useFieldSchema();
    // return <div>{props.children}</div>;
    const { valueType, recordList } = usePrjWorkProviderContext();
    const [all, setAll] = useState(null);

    useEffect(() => {
      const total = recordList.reduce((prev, curr) => {
        const hours = curr.hours;
        if (typeof hours == 'number') {
          return prev + hours;
        } else {
          return prev + 0;
        }
      }, 0);
      setAll(total);

    }, [valueType, recordList]);

    const columns: any = [
      { title: '序号', dataIndex: 'index', key: 'index', width: 50, render: renderIndex },
      {
        title: '成员',
        dataIndex: 'user',
        key: 'user',
        width: 100,
        render: (val, record) => {
          return <div>{val?.nickname}<br /> {record.totalHours} 小时<br /> {transformHourToDays(record.totalHours)} 天</div>;
        },
        onCell(record,index){
          return {rowSpan: record.rowSpan}
        }
      },
      { title: '工时(h)', dataIndex: 'hours', key: 'hours', width: 70 },
      {
        title: '天数(天)',
        dataIndex: 'hours',
        key: 'days',
        width: 70,
        render: (val) => {
          return transformHourToDays(val);
        },
      },
      {
        title: '来源',
        dataIndex: 'sourceFrom',
        key: 'sourceFrom',
        width: 90,
        render: (val, record) => {
          return (
            <Tag icon={<Icon type={val.icon} />} color={val.color}>
              {val.label}
            </Tag>
          );
        },
      },
    ];
    switch (valueType) {
      case 'all':
      case 'comp':
        columns.push(
          { title: '周报', dataIndex: 'reportTitle', key: 'reportTitle', width: 120 },
          { title: '内容', dataIndex: 'content', key: 'content' },
        );
        break;
      case 'trip':
        columns.push(
          { title: '周报', dataIndex: 'reportTitle', key: 'reportTitle', width: 120 },
          { title: '内容', dataIndex: 'content', key: 'content' },
          { title: '出差事由', dataIndex: 'business', key: 'business' },
        );
        break;
      case 'overTime':
        columns.push({ title: '加班原因', dataIndex: 'reason', key: 'reason' });
        break;
    }
    return (
      <div
        className={css`
          height: 600px;
        `}
      >
        <Table
          className={css`
            height: 100%;
            > .ant-spin-nested-loading,
            > .ant-spin-nested-loading > .ant-spin-container,
            > .ant-spin-nested-loading > .ant-spin-container > .ant-table,
            > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container {
              height: 100%;
            }
          `}
          columns={columns}
          rowKey="key"
          dataSource={recordList}
          pagination={false}
          scroll={{ y: 'calc(100% - 47px)' }}
          footer={() => {
            return all?(<div>合计 <strong>{all}</strong> 小时, <strong>{transformHourToDays(all)}</strong> 天</div>):<></>
          }}
          size="middle"
        />
      </div>
    );
  },
  { displayName: 'SubTable' },
);

const RecordDetail = (props) => {
  const RecordDetailWrap = observer(() => {
    const { fieldSchema } = useActionContext();
    const { valueType, recordList } = usePrjWorkProviderContext();

    const valueTypeNames = {
      all: '总工时明细',
      comp: '工时明细',
      trip: '出差明细',
      overTime: '加班明细',
    };
    let title = '明细';
    if (valueTypeNames[valueType]) {
      title = valueTypeNames[valueType];
    }

    fieldSchema.properties.drawer.title = title + ' (共' + recordList.length + '条)';

    const containerRef = useRef(null);
    return (
      <SchemaComponentProvider scope={{ useCloseAction, containerRef }} components={{ SubTable, Action }}>
        <SchemaComponent schema={fieldSchema} />
        <div ref={containerRef}></div>
      </SchemaComponentProvider>
    );
  });

  return <RecordDetailWrap />;
};

export const PrjWorkStaticView = observer((props) => {
  const ctx = usePrjWorkProviderContext();
  const { setVisible } = useActionContext();
  const chartWrapRef = useRef<HTMLDivElement>();
  const chartRef = useRef();
  const loading = ctx?.service?.loading;
  if (loading)
    return (
      <div
        className={css`
          height: 100%;
          .spin-container {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      >
        <div className="spin-container">
          <Spin size="large" />
        </div>
      </div>
    );

  const result = ctx?.service?.data?.data;
  const formatter = (item) => {
    item.value = item.value / item.unit;
    if (item.value1) {
      item.value1 = item.value1 / item.unit;
    }

    const text = item.tooltip(item);
    return (value) => {
      return value == null ? (
        '--'
      ) : (
        <Tooltip placement="top" title={text}>
          {value > 0 ? (
            <a
              onClick={() => {
                showDetails(item.key, item.detail, item.detail1);
              }}
            >
              <CountUp end={value} separator=","   decimals={1} />
            </a>
          ) : (
            value
          )}
        </Tooltip>
      );
    };
  };
  const showDetails = (key, detail, detail1) => {
   
    ctx.setValueType(key);
    const records = [...detail, ...(detail1 || [])];
    records.sort((a,b)=>{ return a.user.id - b.user.id});

    const userMap = new Map();
    records.forEach((record)=>{
      const userid = record.user.id;
      const rowSpan = userMap.get(userid);
      if(!rowSpan){
        /* 计算 rowSpan 首行设置 单元格 */
        const subList = records.filter(({user})=>{return userid == user.id});
        const value = subList.length;
        const total = subList.reduce((prev,curr)=>{
          const hours = curr.hours;
          if(typeof hours == 'number'){
            return prev + hours
          }else{
            return prev + 0
          }
          }, 0);
     
        userMap.set(userid, value);
        record.rowSpan = value;
        record.totalHours = total;
      }else{
        record.rowSpan = 0;
      }
    })
    ctx.setRecordList(records);

    setVisible(true);
  };

  const countShow = [
    {
      key: 'all',
      title: '总工时(小时)',
      value: result?.count?.all,
      unit: 1,
      tooltip: ({ title, value }) => {
        return [title, value].join(' ');
      },
      detail: result.report,
      detailTitle: '总工时明细',
    },
    {
      key: 'comp',
      title: '工时(小时)',
      value: result?.count?.comp,
      unit: 1,
      tooltip: ({ title, value }) => {
        return [title, value].join(' ');
      },
      detail: result.report.filter(({ isBusinessTrip }) => {
        return !isBusinessTrip;
      }),
      detailTitle: '工时明细',
    },
    {
      key: 'trip',
      title: '出差(天)',
      value: transformHourToDays(result?.count?.sysTrip),
      value1: transformHourToDays(result?.count?.dingTrip),
      unit: 1,
      tooltip: ({ title, value, value1 }) => {
        return (
          <>
            <div>系统来源 出差天数(天) {value}</div>
            <div>钉钉来源 出差天数(天) {value1}</div>
          </>
        );
      },
      detail: result.report.filter(({ isBusinessTrip }) => {
        return isBusinessTrip;
      }),
      detail1: result.trip,
      detailTitle: '出差明细',
    },
    {
      key: 'overTime',
      title: '加班(小时)',
      value: result?.count?.overtime,
      unit: 1,
      tooltip: ({ title, value }) => {
        return [title, value].join(' ');
      },
      detail: result.overtime,
      detailTitle: '加班明细',
    },
  ];
  const groupByUser = ({ report, trip, overtime }) => {
    const userSet = new Set();
    const userMap = new Map();
    //周报
    report.forEach((item) => {
      const userId = item.user.id;
      userSet.add(userId);
      userMap.set(userId, item.user);
    });
    //钉钉来源 trip
    trip.forEach((item) => {
      const userId = item.user.id;
      userSet.add(userId);
      userMap.set(userId, item.user);
    });
    //加班 钉钉
    overtime.forEach((item) => {
      const userId = item.user.id;
      userSet.add(userId);
      userMap.set(userId, item.user);
    });

    const sumHours = (list, filter?) => {
      let arr = list;
      if (typeof filter == 'function') {
        arr = list.filter(filter);
      }
      arr = arr.map(({ hours }) => {
        return hours;
      });
      return arr.length > 0
        ? arr.reduce(function (prev, curr, idx, arr) {
            return prev + curr;
          })
        : 0;
    };

    const list = [];
    const barData = [];
    const annotations = [];

    Array.from(userSet).forEach((id) => {
      const filters = {
        base: ({ user }) => {
          return id == user.id;
        },
        comp: ({ user, isBusinessTrip }) => {
          return id == user.id && !isBusinessTrip;
        },
        sysTrip: ({ user, isBusinessTrip }) => {
          return id == user.id && isBusinessTrip;
        },
      };
      const item = {
        key: uid(),
        ...userMap.get(id),
        all: sumHours(report, filters.base),
        all_detail: report.filter(filters.base),
        comp: sumHours(report, filters.comp),
        comp_detail: report.filter(filters.comp),
        trip: transformHourToDays(sumHours(report, filters.sysTrip)),
        trip1: transformHourToDays(sumHours(trip, filters.base)),
        trip_detail: report.filter(filters.sysTrip),
        trip_detail1: trip.filter(filters.base),
        overTime: sumHours(overtime, filters.base),
        overTime_detail: overtime.filter(filters.base),
      };

      list.push(item);
    });
    list.sort((a, b) => {
      return b.all - a.all;
    });
    list.forEach((item, index) => {
      const header =  countShow.slice(0,countShow.length);
      // header.reverse();
      header.forEach(({ key, title }, index) => {
        const user =  userMap.get(item.id)
        if(['all','comp','overTime'].includes(key))
        barData.push({
          user: user,
          name: user.nickname,
          userId: item.id,
          group: key == 'all'?'all':'other',
          type: title,
          value: item[key],
        });
      });
    });
    // barData.sort((a, b) => {return });
    

    return {
      userMap,
      list,
      barData,
      annotations,
    };
  };
  const { userMap, list, barData, annotations } = groupByUser(result);
  const userGroupBar = {
    plot: Column,
    config: {
      isStack: false,
      xField: 'name',
      yField: 'value',
      seriesField: 'type',
      isGroup: true,    
      // groupField:'group',
      label: {
        // 可手动配置 label 数据标签位置
        position: 'top', // 'top', 'bottom', 'middle'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
      minColumnWidth: 26,
      maxColumnWidth: 26,
      data: barData,
      // height: userGroupBarHeight,
      // autoFit: false,
      marginRatio: 0,
      // appendPadding: 10,
      dodgePadding: 4,
      // intervalPadding: 6,
      // appendPadding: [24, 8, 12, 8],
      // intervalPadding: 0,
      // dodgePadding: 0,
      legend: {
        layout: 'horizontal',
        position: 'top-right',
        offsetY: 8,
      },
      meta: {
        name: {
          formatter(value, index) {
            return value;
            // return userMap.get(value).nickname;
          },
        },
      }
    },
  };

  const _columns: any = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 70, render: renderIndex },
    { title: '成员', dataIndex: 'nickname', key: 'nickname', width: 120 },
    { title: '总工时(小时)', dataIndex: 'all', key: 'all', sorter: sortByKey('all') },
    { title: '工时(小时)', dataIndex: 'comp', key: 'comp', sorter: sortByKey('comp') },
    { title: '出差(天)', dataIndex: 'trip', key: 'trip', sorter: sortByKey('trip') },
    { title: '加班(小时)', dataIndex: 'overTime', key: 'overTime', sorter: sortByKey('overTime') },
  ];

  const columns = _columns.map((_column) => {
    const { title, dataIndex } = _column;
    const col = countShow.filter(({ key }) => {
      return dataIndex == key;
    })[0];
    const column = {
      ..._column,
    };
    if (col) {
      const renderCell = (value, record, index) => {
        value = value;
        let value1;

        if (dataIndex == 'trip') {
          value1 = record.trip1;
        }
        const text = col.tooltip({
          title,
          value,
          value1,
        });
        return value == null ? (
          '--'
        ) : (
          <Tooltip placement="top" title={text}>
            {value > 0 ? (
              <a
                onClick={() => {
                  showDetails(
                    col.key,
                    record[[dataIndex, 'detail'].join('_')],
                    record[[dataIndex, 'detail1'].join('_')],
                  );
                }}
              >
                <CountUp end={value} separator=","  decimals={1}/>
              </a>
            ) : (
              <CountUp end={value} separator="," decimals={1} />
            )}
          </Tooltip>
        );
      };
      column.render = renderCell;
    }
    return column;
  });
  return (
    <>
      <div
        className={css`
          height: 100%;
          .spin-container {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .g2plot-wrapper {
            height: calc(100% - 336px - 32px * 2);
            > div {
              height: 100%;
            }
          }
        `}
      >
        <Row gutter={16}>
          <Col flex="0 1  500px">
            <div
              className={css`
                padding: 20px;
                background-color: rgb(240, 242, 245);
                .ant-card .ant-card-body {
                  display: flex;
                  align-items: center;
                  height: 140px;
                }
                .ant-statistic-content {
                  font-size: 32px;
                  font-weight: bold;
                  .ant-statistic-content-prefix {
                    color: #cacaca;
                    width: 48px;
                    height: 48px;
                    display: inline-flex;
                    font-size: 24px;
                    justify-content: center;
                  }
                }
              `}
            >
              <Row gutter={[16, 16]}>
                {countShow.map((item) => {
                  return (
                    <Col span={12}>
                      <Card bordered={false}>
                        <Statistic
                          title={item.title}
                          value={item.value}
                          formatter={formatter(item)}
                          // prefix={<ClockCircleOutlined />}
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Col>
          <Col
            flex="1  1 600px"
            className={css`
              height: 336px;
              > div {
                height: 100%;
              }
            `}
          >
            <Table
              className={css`
                > .ant-spin-nested-loading,
                > .ant-spin-nested-loading > .ant-spin-container,
                > .ant-spin-nested-loading > .ant-spin-container > .ant-table,
                > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container {
                  height: 100%;
                }
              `}
              columns={columns}
              rowKey="key"
              dataSource={list}
              pagination={false}
              scroll={{ y: 'calc(100% - 47px)' }}
              size="middle"
            />
          </Col>
        </Row>
        <Divider orientation="left">
          <Title level={5}>各成员工时分布</Title>
        </Divider>
        <div className={'g2plot-wrapper ' + css``} ref={chartWrapRef}>
          {<G2PlotRenderer ref={chartRef}  {...userGroupBar} />}
        </div>
      </div>
      <RecordDetail></RecordDetail>
    </>
  );
});
