import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const { Title } = Typography;

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStyles from './style';
import { DingdingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProForm, FooterToolbar } from '@ant-design/pro-components';
import { Descriptions, Input, Card, Typography, Button, Steps, Row, Col, Spin, Tag, Space } from 'antd';
import {
  APIClientProvider,
  CollectionProvider,
  DefaultValueProvider,
  FormActiveFieldsProvider,
  FormProvider,
  RecordProvider,
  RemoteSchemaComponent,
  RemoteSelect,
  SchemaComponent,
  VariableScopeProvider,
  createDetailsBlockSchema,
  css,
  useAPIClient,
  useRequest,
  useSchemaComponentContext,
} from '@nocobase/client';
import { dayjs, uid } from '@nocobase/utils';
import { createDetailSchema } from './schema/detailSchema';
import { createApproveSchema } from './schema/approveSchema';

import { createForm } from '@formily/core';
const ApprovalContext = createContext<any>({});

export const useApprovalContext = () => {
  return useContext(ApprovalContext);
};
export const ApprovalDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [workflow, setWorkflow] = useState<any>(null);
  // const [approval, setApproval] = useState<any>({
  //   id:1,
  //   status: '待审批',
  //   currentIndex: 1,
  // });
  const api = useAPIClient();
  const [loading, setLoading] = useState(true);
  const [applyRelationData, setApplyRelationData] = useState<any>(null);
  const { data } = useRequest<any>({
    resource: 'approval_apply',
    action: 'get',
    params: {
      filterByTk: searchParams.get('id'),
      appends: ['applyUser', 'currentApprovalUsers', 'applyResults'],
    },
  });
  const apply = data?.data;

  useEffect(() => {
    if (apply?.workflowId && apply?.relatedCollection && apply?.related_data_id) {
      Promise.all([
        api
          .resource('workflows')
          .get({
            filterByTk: apply?.workflowId,
          })
          .then((res) => {
            apply.workflow = res.data?.data;
            setWorkflow(res.data?.data);
          }),
        api
          .resource(apply.relatedCollection)
          .get({
            filterByTk: apply?.related_data_id,
          })
          .then((res) => {
            setApplyRelationData(res.data?.data);
          }),
      ]).then(() => {
        setLoading(false);
      });
    }
  }, [apply?.workflowId, apply?.relatedCollection, apply?.related_data_id]);

  return (
    <ApprovalContext.Provider
      value={{
        workflow,
        apply,
        applyRelationData,
        loading,
      }}
    >
      <View data={apply} />
    </ApprovalContext.Provider>
  );
};
const View = (props: any) => {
  const data: any = props?.data;
  const [tab, setTab] = useState('tab2');
  const { components, scope } = useSchemaComponentContext();
  const { loading, apply, workflow } = useApprovalContext();

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
          title: '审批编号: ' + data?.code,
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
      >
        {loading ? (
          <Spin></Spin>
        ) : (
          <>
            <SchemaComponent
              schema={createDetailSchema({
                id: apply?.id,
              })}
              components={components}
              scope={scope}
            />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="流程进度" bordered={false} size="small">
                  <ApprovalFlowSteps />
                </Card>
              </Col>
              <Col span={16}>
                <ApprovalFlowNodeDetail></ApprovalFlowNodeDetail>
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
                <SchemaComponent schema={createApproveSchema()} components={components} scope={scope} />
              </Col>
            </Row>
          </>
        )}
      </PageContainer>
    </div>
  );
};

const ApprovalFlowSteps = () => {
  const { apply } = useApprovalContext();
  const [nodes, setNodes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const api = useAPIClient();
  useEffect(() => {
    if (apply?.workflowId)
      api
        .resource('flow_nodes')
        .list({
          filter: {
            workflowId: apply?.workflowId,
            type: 'approval',
          },
        })
        .then((res) => {
          const nodes = res.data?.data;
          const _currentIndex = nodes.findIndex((node) => node.id === apply.nodeId);
          setCurrentIndex(_currentIndex + 1);
          setNodes(nodes);
        });
  }, [apply?.workflowId]);
  const stepItems = useMemo(() => {
    const applyUser = {
      title: '提交申请',
      description: (
        <div
          className={css`
            margin-top: 6px;
          `}
        >
          <Space direction="vertical" size={'small'}>
            <div>
              <Tag color="default">{apply?.applyUser?.nickname}</Tag>
            </div>
            <div>
              <small>{dayjs(apply.createdAt).format('YYYY-MM-DD HH:mm:ss')}</small>
            </div>
          </Space>
        </div>
      ),
    };
    return [
      applyUser,
      ...nodes.map((node) => {
        return {
          title: node.title,
          description: (
            <>
              <ApprovalNodeUsers apply={apply}></ApprovalNodeUsers>
            </>
          ),
        };
      }),
      {
        title: '完成',
      },
    ];
  }, [nodes]);
  return <Steps size="small" current={currentIndex} progressDot labelPlacement="vertical" items={stepItems} />;
};

const ApprovalNodeUsers = ({ apply }) => {
  const { data } = useRequest<any>({
    resource: 'approval_apply',
    action: 'getNodeUsers',
    params: {
      filterByTk: apply?.id,
      values: {
        nodeId: apply?.nodeId,
        executionId: apply?.executionId,
      },
    },
  });

  const schema = {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'nickname',
            value: 'id',
          },
          service: {
            resource: 'users',
            action: 'list',
          },
          style: {
            width: '100%',
          },
        },
        'x-read-pretty': true,
      },
    },
  };
  const form = useMemo(() => {
    return createForm({
      // initialValues: value,
      // values: value,
    });
  }, []);
  return (
    <div
          className={css`
            margin-top: 6px;
          `}
        >
    <Space direction="vertical" size={'small'}>
      <div>
        {data?.data.map(({ nickname }) => {
          return <Tag color="default">{nickname}</Tag>;
        })}
      </div>
      <div>
        <DingdingOutlined style={{ color: '#007fff' }} />
        <a>催一下</a>
      </div>
      </Space>
      </div>
  );
};

const ApprovalFlowNodeDetail = () => {
  const { workflow, apply, applyRelationData } = useApprovalContext();
  const [uiSchemaRecordUid, setUiSchemaRecordUid] = useState(null);
  const api = useAPIClient();
  useEffect(() => {
    if (workflow && workflow?.uiTemplateKey)
      api
        .resource('uiSchemaTemplates')
        .get({
          filterByTk: workflow.uiTemplateKey,
        })
        .then((res) => {
          setUiSchemaRecordUid(res.data.data.uid);
        });
  }, [workflow?.uiTemplateKey]);
  const scope = [
    {
      $context: {
        data: applyRelationData,
      },
    },
  ];
  const form = useMemo(() => {
    return createForm({
      initialValues: applyRelationData,
      values: applyRelationData,
    });
  }, []);

  return (
    <Card title="详情" bordered={false} size="small">
      <RecordProvider record={applyRelationData}>
        <FormProvider form={form}>
          <RemoteSchemaComponent uid={uiSchemaRecordUid} />
        </FormProvider>
      </RecordProvider>
    </Card>
  );
};
