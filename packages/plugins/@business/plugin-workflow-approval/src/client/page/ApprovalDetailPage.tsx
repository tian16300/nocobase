import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { DingdingOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProForm, FooterToolbar } from '@ant-design/pro-components';
import { Descriptions, Input, Card, Typography, Button, Steps, Row, Col, Spin, Tag, Space, Timeline } from 'antd';
import {
  CollectionProvider,
  RecordProvider,
  SchemaComponent,
  SchemaComponentContext,
  css,
  useAPIClient,
  useCollectionManager,
  useCurrentUserContext,
  useDesignable,
  useFormBlockContext,
  useRequest,
  useSchemaComponentContext,
  useToken,
} from '@nocobase/client';

import { App, message } from 'antd';
import { dayjs, uid } from '@nocobase/utils';
import { createDetailSchema } from './schema/detailSchema';
import { createApproveSchema } from './schema/approveSchema';
import { UserOutlined } from '@ant-design/icons';
const ApprovalContext = createContext<any>({});

export const useApprovalContext = () => {
  return useContext(ApprovalContext);
};
export const ApprovalDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [workflow, setWorkflow] = useState<any>(null);
  const api = useAPIClient();
  const [loading, setLoading] = useState(true);
  const [applyRelationData, setApplyRelationData] = useState<any>(null);
  const [formIsVisible, setFormIsVisible] = useState<any>(false);
  const userContext = useCurrentUserContext();
  const currentUser = userContext?.data?.data;
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
    if (apply?.workflowKey && apply?.relatedCollection && apply?.related_data_id) {
      Promise.all([
        api
          .resource('workflows')
          .list({
            filter: {
              key: apply?.workflowKey,
              enabled: true,
              current: true,
            },
            appends: ['uiTemplate'],
          })
          .then((res) => {
            apply.workflow = res.data?.data?.[0];
            setWorkflow(res.data?.data?.[0]);
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
  }, [apply?.workflowKey, apply?.relatedCollection, apply?.related_data_id]);

  useEffect(() => {
    let visible = apply && !apply.jobIsEnd && apply.status == '0';
    if (apply?.currentApprovalUsers?.length) {
      const hasCurrentUser =
        apply?.currentApprovalUsers?.find(({ id }) => {
          return id == currentUser?.id;
        }).length > 0;
      visible = visible && hasCurrentUser;
    }

    setFormIsVisible(visible);
  }, [apply?.jobIsEnd, apply?.status]);

  return (
    <ApprovalContext.Provider
      value={{
        workflow,
        apply,
        applyRelationData,
        loading,
        formIsVisible,
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
  const { loading, apply, workflow, formIsVisible } = useApprovalContext();
  const token = useToken();
  /**
   *
   * @param props TODO 调整成表格
   * @returns
   */
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
    // return <Timeline pending={pending} reverse={true} items={items} />;
    return <>审批记录</>;
  };

  const contentList = {
    tab1: <ApprovalLogs />,
    tab2: <p>content2</p>,
  };
  const navigate = useNavigate();

  return (
    <PageContainer
      fixedHeader
      header={{
        // title: '审批编号: ' + data?.code,
        breadcrumb: {
          items: [
            {
              path: '',
              title: '返回',
              onClick() {
                navigate(-1);
              },
            },
            {
              path: '',
              title: '审批详情',
            },
          ],
        },
      }}
      className={css`
        height: 100%;
        .ant-pro-page-container-children-container,
        .ant-page-header-heading {
          padding-inline-start: 20px;
          padding-inline-end: 20px;
        }
        .ant-pro-page-container-warp-page-header {
          padding-inline-start: 0;
          padding-inline-end: 0;
          padding-block-start: 0;
          .ant-breadcrumb {
            padding: 0.5rem 20px;
            background: #ffffff;
            border-bottom: 1px solid #e0e0e0;
          }
        }
        .ant-pro-grid-content {
          height: calc(100% - 55px);
          overflow: auto;
        }
      `}
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
              {apply.id ? (
                <RecordProvider record={apply}>
                  <ApprovalFlowNodeDetail></ApprovalFlowNodeDetail>
                </RecordProvider>
              ) : (
                <></>
              )}
            </Col>
            <Col span={24}>
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
            {formIsVisible ? (
              <Col span={24}>
                <SchemaComponent schema={createApproveSchema()} components={components} scope={scope} />
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </>
      )}
    </PageContainer>
  );
};

const ApprovalFlowSteps = () => {
  const { apply, isComplete, workflow } = useApprovalContext();
  const [nodes, setNodes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const api = useAPIClient();
  useEffect(() => {
    if (workflow?.id)
      api
        .resource('flow_nodes')
        .list({
          filter: {
            workflowId: workflow.id,
          },
          sort: ['id'],
        })
        .then((res) => {
          const nodes = res.data?.data;
          const _currentIndex = nodes.findIndex((node) => node.id === apply.job?.nodeId);
          setNodes(nodes);
          setCurrentIndex(_currentIndex + 1);
          // if (isComplete) {
          //   //审批完成
          //   setCurrentIndex(nodes.length + 1);
          // } else {

          // }
        });
  }, [workflow?.id]);
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
  const { apply, workflow } = useApprovalContext();
  const { designable } = useDesignable();
  const value = useContext(SchemaComponentContext);

  const { data, loading } = useRequest<{
    data: any;
  }>({
    method: 'GET',
    url: `uiSchemas:getJsonSchema/${workflow?.uiTemplate?.uid}`,
  });
  if (loading) {
    return <Spin />;
  }
  const schema: any = {
    type: 'object',
    properties: {
      block: {
        type: 'void',
        'x-decorator': 'FormBlockProvider',
        'x-decorator-props': {
          collection: apply?.relatedCollection,
          resource: apply?.relatedCollection,
          // resourceOf: apply?.related_data_id,
          action: 'get',
          // useParams: '{{ useParamsFromRecord }}',
          params: {
            filterByTk: apply?.related_data_id,
          },
        },
        properties: {
          form: {
            type: 'void',
            'x-component': 'FormV2',
            'x-component-props': {
              useProps: '{{ useApprovalFormBlockProps }}',
            },
            properties: {
              grid: data.data,
            },
          },
        },
      },
    },
  };

  return (
    <Card title="详情">
      <CollectionProvider name={apply?.relatedCollection}>
        <RecordProvider record={{ ...apply.result, __collectionName: apply?.relatedCollection }}>
          <SchemaComponentContext.Provider value={{ ...value, designable: designable }}>
            <SchemaComponent schema={schema} scope={{ useApprovalFormBlockProps }} />
          </SchemaComponentContext.Provider>
        </RecordProvider>
      </CollectionProvider>
    </Card>
  );
};
const useApprovalFormBlockProps = () => {
  const ctx = useFormBlockContext();
  useEffect(() => {
    ctx.form.readPretty = true;
  }, []);

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(ctx.service?.data?.data);
    }
  }, [ctx?.service?.loading]);
  return {
    form: ctx.form,
  };
};
