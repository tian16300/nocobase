import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const { Title } = Typography;

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStyles from './style';
import { DingdingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProForm, FooterToolbar } from '@ant-design/pro-components';
import { Descriptions, Input, Card, Typography, Button, Steps, Row, Col } from 'antd';
import { useAPIClient } from '@nocobase/client';
const ApprovalContext = createContext<any>({});

export const useApprovalContext = () => {
  return useContext(ApprovalContext);
};
export const ApprovalDetailPage = () => {
  const [workflow, setWorkflow] = useState<any>({ id: 108 });
  const [approval, setApproval] = useState<any>({
    id:1,
    status: '待审批',
    currentIndex: 1,
  });

  return (
    <ApprovalContext.Provider
      value={{
        workflow,
        approval,
      }}
    >
      <View />
    </ApprovalContext.Provider>
  );
};
const View = () => {
  const [tab, setTab] = useState('tab2');

  const contentList = {
    tab1: <p>content1</p>,
    tab2: <p>content2</p>,
  };
  return (
    <div
      style={{
        background: '#F5F7FA',
      }}
    >
      <PageContainer
        fixedHeader
        header={{
          title: '审批编号: APP-201908020001',
          breadcrumb: {
            items: [
              {
                path: '',
                title: '我的审批',
              },
              {
                path: '',
                title: '审批详情',
              },
            ],
          },
        }}
        content={
          <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
            <Descriptions.Item label="申请人">曲丽丽</Descriptions.Item>
            <Descriptions.Item label="关联表单">
              <a>421421</a>
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">2017-01-10</Descriptions.Item>
            <Descriptions.Item label="单据备注">备注信息</Descriptions.Item>
            <Descriptions.Item label="状态">
              <a>待审批</a>
            </Descriptions.Item>
          </Descriptions>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="流程进度" bordered={false} size="small">
              <ApprovalFlowSteps />
            </Card>
          </Col>
          <Col span={16}>
            <ApprovalFlowNodeDetail ></ApprovalFlowNodeDetail>
          </Col>
          <Col span={8}>
            <Card
              size="small"
              bordered={false}
              activeTabKey={tab}
              onTabChange={setTab}
              tabList={[
                {
                  tab: '审批记录',
                  key: 'tab1',
                },
                {
                  tab: '操作日志',
                  key: 'tab2',
                },
              ]}
            >
              {contentList[tab]}
            </Card>
          </Col>
          <Col span={24}>
            <Card title="审批意见" bordered={false} size="small"></Card>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

const ApprovalFlowSteps = () => {
  const { workflow, approval } = useApprovalContext();
  const [nodes, setNodes] = useState<any[]>([]);
  const currentIndex = useMemo(() => {
    return approval?.currentIndex || 0;
  }, [approval]);
  const api = useAPIClient();
  useEffect(() => {
    if (workflow?.id)
      api
        .resource('flow_nodes')
        .list({
          filter: {
            workflowId: workflow.id,
            type: 'approval',
          },
        })
        .then((res) => {
          setNodes(res.data?.data);
        });
  }, [workflow?.id]);
  const stepItems = useMemo(() => {
    const applyUser = {
      title: '提交申请',
      description: (
        <>
          <div>曲丽丽</div>
          <div>2017-01-10 12:00</div>
        </>
      ),
    };
    return [
      applyUser,
      ...nodes.map((node) => {
        return {
          title: node.title,
          description: (
            <>
              <div>
                周毛毛 <DingdingOutlined style={{ color: '#007fff' }} />
              </div>
              <div>
                <a>催一下</a>
              </div>
            </>
          ),
        };
      }),
      {
        title: '完成',
      },
    ];
  }, [nodes]);
  return <Steps size="small" progressDot current={currentIndex} items={stepItems} />;
};

const ApprovalFlowNodeDetail = () => {
  const { workflow, approval } = useApprovalContext();
  const api = useAPIClient();
  useEffect(() => {
    if (workflow?.id)
      api
        .resource('users_jobs')
        .list({
          filter: {
            workflowId: workflow.id,
            type: 'approval',
          },
        })
        .then((res) => {
          // setNodes(res.data?.data);
        });
  }, [approval?.id]);
  return (
    <Card title="详情" bordered={false} size="small">
      Card content
    </Card>
  );
};
