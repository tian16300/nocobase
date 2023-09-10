import React, { useMemo } from 'react';
import { observer } from '@formily/react';
import { usePrjWorkProviderContext } from './PrjWorkPlanProvider';
import { CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Badge, Dropdown, Space, Table } from 'antd';
import { dayjs } from '@nocobase/utils';
import CountUp from 'react-countup';
import { Col, Row, Statistic, Card, Typography, Divider } from 'antd';
import { G2PlotRenderer, css } from '@nocobase/client';
import { Column } from '@antv/g2plot';
const { Title } = Typography;
const formatter = (value: number) => <CountUp end={value} separator="," />;

interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

function sum(arr, key) {
  var s = 0;
  for (var i = arr.length - 1; i >= 0; i--) {
    s += arr[i][key];
  }
  return s;
}
const countHours = (arr) => {
  let hours = 0,
    ccHours = 0,
    zsHours = 0;
  for (var i = arr.length - 1; i >= 0; i--) {
    const temp = arr[i];
    if (temp.isBusinessTrip) {
      ccHours += temp['hours'];
    } else {
      zsHours += temp['hours'];
    }
    hours += temp['hours'];
  }
  return {
    hours,
    ccHours,
    zsHours,
    count: arr.length,
    '工时(小时)': hours,
    '在司工时(小时)': zsHours,
    '出差工时(小时)': ccHours,
  };
};
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
export const PrjWorkStaticView = observer((props) => {
  const ctx = usePrjWorkProviderContext();

  const result = useMemo(() => {
    const loading = ctx?.service?.loading;
    if (loading) return [];
    return ctx.service.data.data;
  }, [ctx?.service?.loading, ctx?.service?.data?.data]);

  const all = countHours(result);

  const userMap: any = {};
  const reportMap: any = {};

  const userGroup = result.group((record) => {
    const userId = record.report.user.id;
    if (!userMap[userId]) userMap[userId] = record.report.user;
    return userId;
  });
  const firstData = [];

  Object.keys(userGroup).forEach((userId) => {
    const details = userGroup[userId];
    const record = {
      index: firstData.length + 1,
      userId: userId,
      userName: userMap[userId].nickname,
      成员: userMap[userId].nickname,
      ...countHours(details),
    };

    const reportGroup = details.group((record) => {
      const reportId = record.report.id;
      if (!reportMap[reportId]) reportMap[reportId] = record.report;
      return reportId;
    });
    userGroup[userId].reportGroup = reportGroup;
    const reports = [];
    Object.keys(reportGroup).forEach((reportId) => {
      const records = reportGroup[reportId];
      reportGroup[reportId] = records.map((item, index) => {
        return {
          index: index + 1,
          ...item,
        };
      });
      const report = reportMap[reportId];
      reports.push({
        index: reports.length + 1,
        userId,
        reportId: report.id,
        reportTitle: report.title,
        start: dayjs(report.start).format('YYYY-MM-DD'),
        end: dayjs(report.end).format('YYYY-MM-DD'),
        ...countHours(records),
      });
    });
    userGroup[userId].reports = reports;
    firstData.push(record);
  });

  const threeExpandedRowRender = (record, index) => {
    const columns: any = [
      { title: '序号', dataIndex: 'index', key: 'index' },
      { title: '工时(小时)', dataIndex: 'hours', key: 'hours', sorter: sortByKey('hours') },
      {
        title: '是否出差',
        dataIndex: 'isBusinessTrip',
        key: 'isBusinessTrip',
        sorter: sortByKey('isBusinessTrip', true),
        render: (value) => {
          if (value) {
            return <CheckOutlined style={{ color: '#52c41a' }} />;
          }
          return null;
        },
      },
      { title: '内容', dataIndex: 'content', key: 'content' },
      { title: '完成情况', dataIndex: 'complete', key: 'complete' },
    ];

    const data = userGroup[record.userId].reportGroup[record.reportId];
    return <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />;
  };

  const barData = [];
  const annotations = [];
  firstData.sort((a, b) => {
    return a.hours - b.hours;
  });

  firstData.forEach((record, index) => {
    barData.push({
      userId: record.userId,
      userName: record.userName,
      value: record.ccHours,
      type: '出差工时(小时)',
    });
    barData.push({
      userId: record.userId,
      userName: record.userName,
      value: record.zsHours,
      type: '在司工时(小时)',
    });
    const value = record.hours;
    annotations.push({
      type: 'text',
      position: [index, value],
      content: `${value}`,
      style: { textAlign: 'center', fontSize: 14, fill: 'rgba(0,0,0,0.85)' },
      offsetY: -10,
    });
  });
  const userGroupBar = {
    plot: Column,
    config: {
      isStack: true,
      xField: 'userId',
      yField: 'value',
      seriesField: 'type',
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'bottom', 'middle'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
        // content: (text, item) => {
        //   return item.userName;
        // }
      },
      minColumnWidth: 20,
      maxColumnWidth: 20,
      data: barData,
      height: 400,
      appendPadding: [24, 8, 12, 8],
      legend: {
        layout: 'horizontal',
        position: 'top-right',
        offsetY: 8,
      },
      meta: {
        userId: {
          formatter(value) {
            return userMap[value].nickname;
          },
        },
      },
      annotations,
    },
  };

  const sencondExpandedRowRender = (record, index) => {
    const columns: any = [
      { title: '序号', dataIndex: 'index', key: 'index', width: 70 },
      { title: '周报', dataIndex: 'reportTitle', key: 'reportTitle' },
      { title: '开始日期', dataIndex: 'start', key: 'start' },
      { title: '结束日期', dataIndex: 'end', key: 'end' },
      { title: '工时(小时)', dataIndex: 'hours', key: 'hours', sorter: sortByKey('hours') },
      { title: '在司工时(小时)', dataIndex: 'zsHours', key: 'zsHours', sorter: sortByKey('zsHours') },
      { title: '出差工时(小时)', dataIndex: 'ccHours', key: 'ccHours', sorter: sortByKey('ccHours') },
    ];

    const data = userGroup[record.userId].reports;
    return (
      <Table
        rowKey="reportId"
        // expandable={{ expandedRowRender: threeExpandedRowRender, defaultExpandedRowKeys: [] }}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 240 }}
        size="middle"
      />
    );
  };

  const columns: any = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 70 },
    { title: '成员', dataIndex: 'userName', key: 'userName', width: 120 },
    { title: '工时(小时)', dataIndex: 'hours', key: 'hours', sorter: sortByKey('hours') },
    { title: '在司工时(小时)', dataIndex: 'zsHours', key: 'zsHours', sorter: sortByKey('zsHours') },
    { title: '出差工时(小时)', dataIndex: 'ccHours', key: 'zsHours', sorter: sortByKey('zsHours') },
  ];

  return (
    <>
      <Divider orientation="left">
        <Title level={5}>工时统计</Title>
      </Divider>
      <Row gutter={16}>
        <Col flex="0 1  500px">
          <div
            className={css`
              padding: 20px;
              background-color: rgb(240, 242, 245);
              .ant-card .ant-card-body {
                display: flex;
                align-items: center;
                height: 160px;
              }
              .ant-statistic-content{
                  font-size: 32px;
                  font-weight: bold;
                  .ant-statistic-content-prefix{
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
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="总工时(小时)"
                    value={all.hours}
                    formatter={formatter}
                    // prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic title="登记次数" value={all.count} formatter={formatter} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic title="在司工时(小时)" value={all.zsHours} formatter={formatter} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic title="出差工时(小时)" value={all.ccHours} formatter={formatter} />
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
        <Col flex="1  1 600px">
          <Table
            columns={columns}
            expandable={{ expandedRowRender: sencondExpandedRowRender, defaultExpandedRowKeys: ['0'] }}
            rowKey="userId"
            dataSource={firstData}
            pagination={false}
            scroll={{ y: 376 - 47 }}
            size="middle"
          />
        </Col>
      </Row>
      <Divider orientation="left">
        <Title level={5}>各成员工时分布</Title>
      </Divider>
      <Row>
        <Col span={24}>
          <G2PlotRenderer {...userGroupBar} />
        </Col>
      </Row>
    </>
  );
});
