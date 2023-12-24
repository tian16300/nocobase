import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const { Title } = Typography;

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStyles from './style';
import { DingdingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProForm, FooterToolbar } from '@ant-design/pro-components';
import { Descriptions, Input, Card, Typography, Button, Steps, Row, Col, Spin, Tag, Space, Timeline } from 'antd';
import {
  APIClientProvider,
  Action,
  CollectionProvider,
  DefaultValueProvider,
  FormActiveFieldsProvider,
  FormProvider,
  RecordProvider,
  RemoteSchemaComponent,
  RemoteSelect,
  SchemaComponent,
  VariableScopeProvider,
  actionDesignerCss,
  createDetailsBlockSchema,
  css,
  useAPIClient,
  useCollection,
  useCollectionManager,
  useRequest,
  useSchemaComponentContext,
  useToken,
} from '@nocobase/client';

import { App, message } from 'antd';
import { dayjs, uid } from '@nocobase/utils';
import { createDetailSchema } from './schema/detailSchema';
import { createApproveSchema } from './schema/approveSchema';
import { UserOutlined } from '@ant-design/icons';
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
  const [isComplete, setIsComplete] = useState<any>(false);
  const { data } = useRequest<any>({
    resource: 'approval_apply',
    action: 'get',
    params: {
      filterByTk: searchParams.get('id'),
      appends: ['applyUser', 'currentApprovalUsers', 'applyResults', 'applyResults.approvalUser', 'execution'],
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

  useEffect(() => {
    if (apply?.execution?.status) {
      setIsComplete(true);
    }
  }, [apply?.execution?.status]);

  return (
    <ApprovalContext.Provider
      value={{
        workflow,
        apply,
        applyRelationData,
        loading,
        isComplete,
      }}
    >
      <View data={apply} />
    </ApprovalContext.Provider>
  );
};
const View = (props: any) => {
  const data: any = props?.data;
  const [tab, setTab] = useState('tab1');
  const { components, scope } = useSchemaComponentContext();
  const { loading, apply, workflow, isComplete } = useApprovalContext();
  const token = useToken();

  const ApprovalLogs = (props) => {
    const items =
      apply.applyResults?.map((applyResult) => {
        return {
          dot: <UserOutlined style={{ fontSize: '16px' }} />,
          children: (
            <>
              <p>
                <Space>
                  <a>{applyResult.approvalUser?.nickname}</a>
                  <span style={{ color: token.token.colorTextSecondary }}>
                    {dayjs(applyResult.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </Space>
              </p>
              <p>
                <Tag color={applyResult.approvalStatus == '1' ? '#87d068' : '#f50'}>
                  {applyResult.approvalStatus == '1' ? '通过' : '拒绝'}
                </Tag>
              </p>
              <p>{applyResult.approvalComments}</p>
            </>
          ),
        };
      }) || [];
    const pending = apply.execution?.status ? (
      false
    ) : (
      <>
        <p>
          <Space>
            {apply?.currentApprovalUsers?.map(({ nickname }) => {
              return <a>{nickname}</a>;
            })}
          </Space>
        </p>
        <p>审批中...</p>
      </>
    );
    return <Timeline pending={pending} reverse={true} items={items} />;
  };

  const contentList = {
    tab1: <ApprovalLogs />,
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
                  <div className={css``}>{contentList[tab]}</div>
                </Card>
              </Col>
              {isComplete ? (
                <></>
              ) : (
                <Col span={24}>
                  <SchemaComponent schema={createApproveSchema()} components={components} scope={scope} />
                </Col>
              )}
            </Row>
          </>
        )}
      </PageContainer>
    </div>
  );
};

const ApprovalFlowSteps = () => {
  const { apply, isComplete, workflow } = useApprovalContext();
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
          },
          sort: ['id'],
        })
        .then((res) => {
          const nodes = res.data?.data;
          const _currentIndex = nodes.findIndex((node) => node.id === apply.nodeId);
          setNodes(nodes);
          if (isComplete) {
            //审批完成
            setCurrentIndex(nodes.length + 1);
          } else {
            setCurrentIndex(_currentIndex + 1);
          }
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
              <ApprovalNodeUsers apply={apply} node={node} workflow={workflow}></ApprovalNodeUsers>
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

const ApprovalNodeUsers = ({ apply, node, workflow }) => {
  const { data } = useRequest<any>({
    resource: 'approval_apply',
    action: 'getNodeUsers',
    params: {
      filterByTk: apply?.id,
      values: {
        nodeId: node.id,
      },
    },
  });
  const { getCollectionField } = useCollectionManager();
  const statusField = getCollectionField('approval_apply.status') as any;
  const statusText = statusField.uiSchema?.enum?.find(({ value }) => {
    return value == apply.status;
  })?.label;
  const msg = {
    msgtype: 'text',
    text: {
      content: `${apply.applyUser.nickname}发起了${workflow.title}${
        !apply.isNewRecord ? statusText : ''
      },请到我的审批查看。`,
    },
  };
  const confirm = {
    title: '工作通知',
    content: '确认发送消息给该用户？',
  };
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
        {node.type == 'approval' ? <DingAction confirm={confirm} users={data?.data} msg={msg}></DingAction> : <></>}
      </Space>
    </div>
  );
};

const DingAction = (props) => {
  const { modal } = App.useApp();
  const api = useAPIClient();
  const { users, msg, confirm } = props;
  const handleOnclick = () => {
    if (confirm?.content) {
      modal.confirm({
        title: confirm.title,
        content: confirm.content,
        onOk,
      });
    } else {
      onOk();
    }
  };
  const dingUsers = users?.filter(({ dingUserId }) => {
    return dingUserId && dingUserId !== '';
  });
  const onOk = async () => {
    const url = 'notifications:sendMsgToUserByDing';
    if (dingUsers && dingUsers.length) {
      const res = await api.request({
        url,
        method: 'POST',
        data: {
          userIds: dingUsers
            .map(({ dingUserId }) => {
              return dingUserId;
            })
            .join(','),
          msg: msg,
        },
      });
      if (res.data?.data?.errmsg == 'ok') {
        message.success('发送成功');
      }
    } else {
      message.warning('用户缺少钉钉用户号, 请到菜单 "企业信息>人员"同步钉钉用户ID');
    }
  };

  return (
    <Button type="text" onClick={handleOnclick}>
      <DingdingOutlined style={{ color: '#007fff' }} />
      <a>催一下</a>
    </Button>
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
