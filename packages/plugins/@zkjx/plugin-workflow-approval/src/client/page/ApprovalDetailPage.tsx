import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const { Title } = Typography;

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStyles from './style';
import { DingdingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProForm, FooterToolbar } from '@ant-design/pro-components';
import { Descriptions, Input, Card, Typography, Button, Steps, Row, Col, Spin } from 'antd';
import {
  CollectionProvider,
  DefaultValueProvider,
  FormActiveFieldsProvider,
  FormProvider,
  RecordProvider,
  RemoteSchemaComponent,
  SchemaComponent,
  VariableScopeProvider,
  createDetailsBlockSchema,
  useAPIClient,
  useRequest,
  useSchemaComponentContext,
} from '@nocobase/client';
import { dayjs } from '@nocobase/utils';
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
              <SchemaComponent
              schema={createApproveSchema()}
              components={components}
              scope={scope}
            />
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
  const currentIndex = useMemo(() => {
    return apply?.currentIndex || 0;
  }, [apply]);
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
          setNodes(res.data?.data);
        });
  }, [apply?.workflowId]);
  const stepItems = useMemo(() => {
    const applyUser = {
      title: '提交申请',
      description: (
        <>
          <div>{apply?.applyUser?.nickname}</div>
          <div>{dayjs(apply.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
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
