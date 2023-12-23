// 主要处理新建和编辑的场景

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  PageContainer,
  FooterToolbar,
} from '@ant-design/pro-components';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input as AntdInput, Space, Divider, Steps, message, Card } from 'antd';
import { Schema } from '@formily/json-schema';
import {
  FormV2,
  SchemaComponent,
  FormItem,
  Input,
  CollectionSelect,
  AppendsTreeSelect,
  CollectionProvider,
  SchemaComponentOptions,
  FormBlockProvider,
  CardItem,
  formItemInitializers,
  useSourceIdFromParentRecord,
  useParamsFromRecord,
  useFormBlockProps,
  Grid,
  useDesignable,
  SchemaComponentProvider,
  useSchemaInitializerRender,
  useSchemaOptionsContext,
  createDesignable,
  SchemaComponentContext,
  useToken,
  css,
  FormBlockContext,
  RecordProvider,
  useSchemaComponentContext,
  useAPIClient,
  IField,
  useApp,
  useAppPluginLoad,
  useCollectionManager,
} from '@nocobase/client';
import { createForm, onFieldChange } from '@formily/core';
import { FormStep, FormButtonGroup } from '@formily/antd-v5';
import { FormProvider, FormConsumer, useForm } from '@formily/react';
import { uid } from '@nocobase/utils';
import { observer, useField, useFieldSchema } from '@formily/react';
import { DesignSchemaView, SelectDataModel } from './components';
import { config, createSchema } from './schema/config';
import { FlowCanvas } from './components/FlowCanvas';
import { set } from 'packages/core/actions/src/actions';
import { FlowContext } from '@nocobase/plugin-workflow/client';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
const ApprovalSettingContext = createContext<any>({});
type FormValue = {
  jobInfo: {
    name: string;
    type: number;
  };
  syncTableInfo: {
    timeRange: [Dayjs, Dayjs];
    title: string;
  };
};
const formValue: FormValue = {
  jobInfo: {
    name: 'normal job',
    type: 1,
  },
  syncTableInfo: {
    timeRange: [dayjs().subtract(1, 'm'), dayjs()],
    title: 'example table title',
  },
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formValue);
    }, time);
  });
};
const jobType = [
  {
    value: 1,
    label: '国企',
  },
  {
    value: 2,
    label: '私企',
  },
];

export const useSchemaConfigSettingProps = () => {
  const { values } = useForm();
  return {
    resourceName: values?.collection,
    collection: values?.collection,
  };
};

const steps = [
  {
    title: '选择数据模型',
  },
  {
    title: '显示设置',
  },
  {
    title: '流程设置',
  },
];

export const AddProvalSetting = (props) => {
  const { app } = props;
  const [searchParams] = useSearchParams();
  const [flowName, setFlowName] = useState('审批单名称');
  const [edit, setEdit] = useState(false);
  const currentIndex = searchParams.get('current') ? Number(searchParams.get('current')).valueOf() : 0;
  const [current, setCurrent] = useState(currentIndex);
  const [dn, setDn] = useState<any>(null);
  const [workflow, setWorkFlow] = useState<any>(null);
  const [collection, setCollection] = useState(null);
  const [appends, setAppends] = useState([]);
  const [isAllowNext, setIsAllowNext] = useState<any>(false);
  const [initialSchema, setInitialSchema] = useState<any>(null);
  const [uiTemplateKey, setUiTemplateKey] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const api = useAPIClient();
  const form = createForm({});
  const navigate = useNavigate();
  const nodes = [];
  const { getCollectionFields, refreshCM } = useCollectionManager();
  const _params = useMemo(() => {
    /* 提交申请 */
    return {
      enabled: false,
      ...workflow,
      title: flowName,
      bussinessCollectionName: collection,
      isApproval: true,
      type: 'collection',
      current: true,
      config: {
        appends: ['applyUserDept', 'applyUser', 'currentApprovalUsers', 'applyResults', 'images', 'files'],
        collection: 'approval_apply',
        changed: ['status'],
        condition: {
          $and: [
            {
              relatedCollection: {
                $eq: collection,
              },
            },
            {
              status: {
                $eq: '1',
              },
            },
          ],
        },
        mode: 3,
      },
    };
  }, [workflow, flowName, collection]);
  useEffect(() => {
    const filterByTk = searchParams.get('id');
    if (filterByTk) {
      api
        .resource('workflows')
        .get({
          filterByTk: filterByTk,
          appends: [
            'nodes',
            'revisions.id',
            'revisions.createdAt',
            'revisions.current',
            'revisions.executed',
            'revisions.enabled',
            'uiTemplate',
          ],
        })
        .then((res) => {
          const data = res.data?.data;
          setWorkFlow(data);
          setFlowName(data.title);
          setCollection(data.bussinessCollectionName);
          setUiTemplateKey(data?.uiTemplateKey);
        });
    }
  }, [searchParams.get('id')]);

  const addApprovalStatusField = async () => {
    const field = {
      foreignKey: 'currentApproval_id',
      onDelete: 'SET NULL',
      name: 'approvalStatus',
      type: 'belongsTo',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '审批状态',
      },
      interface: 'obo',
      target: 'approval_apply',
    };
    const existField = getCollectionFields(collection).find(({ name }) => {
      return name == field.name;
    });
    if (!existField) {
      const url = `/collections/${collection}/fields:create`;
      const res = await api.axios.post(url, field);
      refreshCM?.();
      console.log(res);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    if (!_params.id) {
      const res = await api.resource('workflows').create({
        values: {
          ..._params,
        },
      });
      addApprovalStatusField();
      setLoading(false);
      navigate(app.router.get('admin.workflow.approvalSetting.form').path + '?id=' + res.data?.data?.id);
      return res.data?.data;
    } else if (!_params.executed) {
      const res = await api.resource('workflows').update({
        filterByTk: _params.id,
        values: _params,
      });
      setLoading(false);
      return res.data?.data?.[0];
    } else {
      setLoading(false);
      return _params;
    }
  };

  useEffect(() => {
    if (current == 0 && collection) {
      setIsAllowNext(true);
    }
  }, [current, collection]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const vRef = useRef<any>({});
  vRef.current = {};
  const handleNext = async () => {
    if (current == 0) {
      const res = await handleSave();
      if (res) {
        setWorkFlow(res);
      }
      if (!uiTemplateKey) {
        setInitialSchema(createSchema(res.bussinessCollectionName));
      }
      setTimeout(() => {
        next();
      }, 1000);
    } else if (current == 1) {
      if (workflow?.id) {
        /* 保存区块模板 */

        if (!uiTemplateKey) {
          const uiSchemaJson = initialSchema;
          api
            .resource('uiSchemas')
            .create({
              values: uiSchemaJson,
            })
            .then((res) => {
              /* 保存 uitemplateKey */
              // api.resource('uiSchemas')
              api
                .resource('uiSchemaTemplates')
                .create({
                  values: {
                    name: flowName + '_' + '显示设置',
                    uid: res.data.data['x-uid'],
                    resourceName: collection,
                    collectionName: collection,
                    componentName: 'ReadPrettyFormItem',
                  },
                })
                .then((res) => {
                  const uiTemplate = res.data.data;
                  setUiTemplateKey(uiTemplate.key);
                  api
                    .resource('workflows')
                    .update({
                      filterByTk: workflow.id,
                      updateAssociationValues: ['uiTemplate'],
                      values: {
                        uiTemplateKey: uiTemplate.key,
                        uiTemplate: uiTemplate,
                      },
                    })
                    .then((res) => {
                      // setWorkFlow({
                      //   ...workflow,
                      //   uiTemplateKey: uiTemplate.key
                      // });
                    });
                });
            });
        }
        next();
      }
    }
  };
  // useEffect(() => {
  //   if (collection) {
  //     setInitialSchema(createSchema(collection));
  //   }
  // }, [collection]);
  return (
    <div
      style={{
        background: '#F5F7FA',
        height: '100%',
      }}
    >
      <PageContainer
        fixedHeader
        loading={loading}
        header={{
          title: (
            <>
              <Space>
                <Button
                  icon={<LeftOutlined />}
                  type="text"
                  onClick={() => {
                    navigate(-1);
                  }}
                ></Button>
                {edit ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '180px',
                    }}
                  >
                    <AntdInput
                      value={flowName}
                      onChange={async (e) => {
                        setFlowName(e.target.value);
                      }}
                      onBlur={() => {
                        setEdit(false);
                      }}
                    ></AntdInput>
                  </span>
                ) : (
                  <span>{flowName}</span>
                )}
                {!edit && (
                  <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={() => {
                      setEdit(true);
                    }}
                  ></Button>
                )}
              </Space>
            </>
          ),
          breadcrumb: {
            items: [
              {
                href: app.pluginSettingsManager.getRoutePath('approvalSetting'),
                title: (
                  <>
                    <SettingOutlined />
                    <span>审批设置</span>
                  </>
                ),
              },
              {
                title: '当前位置',
              },
            ],
          },
        }}
        className={css`
          height: 100%;
          .ant-pro-footer-bar {
            z-index: 2;
          }
        `}
      >
        <ApprovalSettingContext.Provider
          value={{
            form,
            collection,
            setCollection,
            appends,
            setAppends,
            workflow,
            initialSchema,
            setInitialSchema,
            uiTemplateKey,
            dn,
            setDn,
          }}
        >
          <FlowContext.Provider
            value={{
              workflow,
              nodes,
            }}
          >
            <Card
              className={css`
                height: 100%;
              `}
            >
              <div>
                <div
                  className={css`
                    width: 80%;
                    margin: 0 auto;
                  `}
                >
                  <Steps current={current} items={items} />
                </div>
              </div>
              <Divider></Divider>
              <div className={css``}>
                {current == 0 && <SelectDataModel />}
                {current == 1 && workflow?.id && <DesignSchemaView />}
                {current == 2 && workflow?.id && <FlowCanvas />}
              </div>
            </Card>
          </FlowContext.Provider>
        </ApprovalSettingContext.Provider>
        <FooterToolbar
          style={{
            zIndex: 2,
            lineHeight: '56px',
          }}
        >
          <div>
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={handleNext} disabled={!isAllowNext}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={async () => {
                  await handleSave();
                  message.success('已保存!');
                }}
              >
                保存
              </Button>
            )}
          </div>
        </FooterToolbar>
      </PageContainer>
    </div>
  );
};

export const useApprovalSettingContext = () => {
  return useContext(ApprovalSettingContext);
};
