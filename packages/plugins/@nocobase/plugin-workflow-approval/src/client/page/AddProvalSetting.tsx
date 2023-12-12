// 主要处理新建和编辑的场景

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  PageContainer,
} from '@ant-design/pro-components';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, {  createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input as AntdInput, Space, Steps, message, Card } from 'antd';
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
} from '@nocobase/client';
import { createForm } from '@formily/core';
import { FormStep, FormButtonGroup } from '@formily/antd-v5';
import { FormProvider, FormConsumer, useForm } from '@formily/react';
import { uid } from '@nocobase/utils';
import { observer, useField, useFieldSchema } from '@formily/react';
import { DesignSchemaView, SelectDataModel } from './components';

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
  //   const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  //   useEffect(() => {
  //     waitTime(1000).then(() => {
  //       // 编辑场景下需要使用formMapRef循环设置formData
  //       formMapRef?.current?.forEach((formInstanceRef) => {
  //         formInstanceRef?.current?.setFieldsValue(formValue);
  //       });
  //     });
  //   }, []);
  const [flowName, setFlowName] = useState('流程名称');
  const [edit, setEdit] = useState(false);
  const form = createForm();
  const formStep = FormStep.createFormStep();
  const { scope, components } = useSchemaOptionsContext();
  const { designable } = useDesignable();
  const [schemaConfig, setSchemaConfig] = useState(null);
  const { token } = useToken();
  const [current, setCurrent] = useState(0);

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
  const record = new Proxy({},{});
  const [dataModel, SetDataModel] = useState(null);
  const handleNext = ()=>{
    if(current == 0){
      SetDataModel(form.values);
    }
    next();
    
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
                      size="large"
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
      >
        <ApprovalSettingContext.Provider value={{ form }}>
          {/* <SchemaComponentProvider
          components={{ ...components, SchemaConfigSetting, FormStep, AddBlockButton }}
          scope={{ ...scope, formStep, useSchemaConfigSettingProps }}
          designable={designable}
         
        >
          <SchemaComponent schema={schema} />
          <FormConsumer>
            {() => (
              <FormButtonGroup>
                <Button
                  disabled={!formStep.allowBack}
                  onClick={() => {
                    formStep.back();
                  }}
                >
                  上一步
                </Button>
                <Button
                  disabled={!formStep.allowNext}
                  onClick={() => {
                    保存上面的信息
                    formStep.next();
                  }}
                >
                  下一步
                </Button>
                <Button
                  disabled={formStep.allowNext}
                  onClick={() => {
                    formStep.submit(console.log);
                  }}
                >
                  提交
                </Button>
              </FormButtonGroup>
            )}
          </FormConsumer>
        </SchemaComponentProvider> */}
          {/* <FormProvider form={form}> */}
          <FormBlockContext.Provider value={{form}} >
            <RecordProvider record={record}>
            <Steps current={current} items={items} />
            {/* <div style={contentStyle}>{steps[current].content}</div> */}
            <Card
              className={css`
                margin-top: 16px;
              `}
            >
            
              { current == 0 &&  <SelectDataModel value={dataModel}   />}
              { current == 1 && <DesignSchemaView />}
            </Card>
            <div style={{ marginTop: 24 }}>
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
            </RecordProvider>
            </FormBlockContext.Provider>
          {/* </FormProvider> */}
        </ApprovalSettingContext.Provider>
      </PageContainer>
    </div>
  );
};

export const useApprovalSettingContext = () => {
  return useContext(ApprovalSettingContext);
};
