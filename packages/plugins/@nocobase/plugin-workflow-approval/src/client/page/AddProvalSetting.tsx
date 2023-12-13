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
} from '@nocobase/client';
import { createForm, onFieldChange } from '@formily/core';
import { FormStep, FormButtonGroup } from '@formily/antd-v5';
import { FormProvider, FormConsumer, useForm } from '@formily/react';
import { uid } from '@nocobase/utils';
import { observer, useField, useFieldSchema,  } from '@formily/react';
import { DesignSchemaView, SelectDataModel } from './components';
import { config, createSchema } from './schema/config';
import { FlowCanvas } from './components/FlowCanvas';
import { set } from 'packages/core/actions/src/actions';

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

const schema = {
  type: 'object',
  'x-component': 'FormStep',
  properties: {
    step: {
      type: 'void',
      'x-component': 'FormStep',
      'x-component-props': {
        formStep: '{{formStep}}',
      },
      properties: {
        step1: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '选择表单',
          },
          properties: {
            collection: {
              type: 'string',
              title: '表单数据模型',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'CollectionSelect',
              'x-reactions': [
                {
                  target: ['schemaConfig.form'],
                  fullfill: {
                    schema: {
                      'x-decorator-props.resourceName': '{{ $self.value}}',
                      'x-decorator-props.collection': '{{ $self.value}}',
                      'x-acl-action': '{{$self.value+":create"}}',
                    },
                  },
                },
              ],
            },
            appends: {
              type: 'array',
              title: '待使用关系数据',
              'x-decorator': 'FormItem',
              'x-component': 'AppendsTreeSelect',
              'x-component-props': {
                title: 'Preload associations',
                multiple: true,
                useCollection() {
                  const { values } = useForm();
                  return values?.collection;
                },
              },
              'x-reactions': [
                {
                  dependencies: ['collection'],
                  fulfill: {
                    state: {
                      visible: '{{!!$deps[0]}}',
                    },
                  },
                },
              ],
            },
          },
        },
        step2: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '模板设置',
          },
          properties: {
            schemaConfig: {
              type: 'object',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'SchemaConfigSetting',
              'x-component-props': {
                useProps: '{{ useSchemaConfigSettingProps }}',
              },
              properties: {
                form: {
                  type: 'void',
                  'x-decorator': 'FormBlockProvider',
                  'x-decorator-props': {
                    resourceName: '',
                    collection: '',
                  },
                  'x-acl-action': ``,
                  'x-component': 'FormV2',
                  'x-component-props': {
                    useProps: '{{ useFormBlockProps }}',
                  },
                  properties: {
                    grid: {
                      type: 'void',
                      'x-component': 'Grid',
                      'x-initializer': 'FormItemInitializers',
                      properties: {},
                    },
                  },
                },
              },
            },
          },
        },
        step3: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '流程设置',
          },
          properties: {
            ccc: {
              type: 'string',
              title: 'AAA',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
};
const AddBlockButton = observer(() => {
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
  return render();
});
const SchemaConfigSettingDesign = (props) => {
  return (
    <div>
      {props.children}
      <AddBlockButton />
    </div>
  );
};
const SchemaConfigSetting = (_props) => {
  const { useProps, ...others } = _props;
  const props = { ...useProps(), ...others } as any;
  const { collection } = props;
  return (
    <CardItem>
      <CollectionProvider name={collection}>
        {props.children}
        <AddBlockButton />
      </CollectionProvider>
    </CardItem>
  );
};
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
    title: '模板设置',
  },
  {
    title: '流程设置',
    content: 'First-content',
  },
  {
    title: '完成',
    content: 'First-content',
  },
];

export const AddProvalSetting = () => {
  const [flowName, setFlowName] = useState('流程名称');
  const [edit, setEdit] = useState(false);
 
  const { token } = useToken();
  const [current, setCurrent] = useState(2);
  const [dn, setDn] = useState<any>(null);
  const [record,setRecord] = useState<any>({
    "options": {},
    "id": 94,
    "createdAt": "2023-12-13T11:19:16.156Z",
    "updatedAt": "2023-12-13T11:19:16.156Z",
    "key": "xmif7z2wamo",
    "title": "流程名称测试",
    "enabled": false,
    "description": null,
    "type": "form",
    "useTransaction": null,
    "executed": 0,
    "allExecuted": 0,
    "current": true,
    "bussinessCollectionName": "bom",
    "isApproval": true,
    "uiTemplateKey": null
});
  const [schemaJSON, setSchemaJSON] = useState<any>(null);
  const [collection, setCollection] = useState('bom');  
  const [appends, setAppends] = useState([]);
  const [created, setCreated] = useState<any>(true);
  const api = useAPIClient();
  const form = createForm({
   
  });
  const handleSave = async () => {
    const data = {      
      ...record,
      title: flowName,
      bussinessCollectionName: collection,
      isApproval: true,      
      enabled: false,
      type: 'form',
      current: true,
      config:{
        collection: collection,
        appends: appends
      },
    };
    if(!data.id){
     const res =  await api.resource('workflows').create({
        values: data
      });
    }else{
      const res =  await api.resource('workflows').update({
        filterByTk: data.id,
        values: data
      });
    }
  };

  const schema = useMemo(() => {
    if (!schemaJSON) {
      return null;
    } else {
      return new Schema(schemaJSON);
    }
  }, [schemaJSON]);
  useEffect(() => {
    if (collection) {
      const json = createSchema(collection);
      setSchemaJSON(json);
    }
  }, [collection]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const vRef = useRef<any>({});
  vRef.current = {};
  const handleNext = async () => {
    if (current == 0) {
      // const values = form.values;
      // setDataModel(values);
      /**
       * 1. 选择数据模型
       */
      // 创建 workflow 数据模型
      /**
       * 保存数据
       */
      await handleSave();
     
    } else if (current == 1) {
      if(schema){
        setSchemaJSON(schema.toJSON());
      }     
    }
    next();
  };
  return (
    <div
      style={{
        background: '#F5F7FA',
        height: '100%',
      }}
    >
      <PageContainer
        fixedHeader
        header={{
          title: (
            <>
              <Space>
                <Button icon={<LeftOutlined />} type="text"></Button>
                {edit ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '180px',
                    }}
                  >
                    <AntdInput
                      value={flowName}
                      onChange={(e) => {
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
          breadcrumb: {},
        }}
        className={css`
          height: 100%;
          .ant-pro-footer-bar {
            z-index: 2;
          }
        `}
      >
        <ApprovalSettingContext.Provider value={{ form, collection, setCollection,appends, setAppends, schema, dn, setDn }}>
          <Card
            className={css`
              height: 100%;
            `}
          >
            <Steps current={current} items={items} />
            <Divider></Divider>
            <div className={css``}>
              {current == 0 && <SelectDataModel />}
              {current == 1 && <DesignSchemaView ref={vRef} />}
              {current == 2 && <FlowCanvas />}
            </div>
          </Card>
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
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                已完成
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
