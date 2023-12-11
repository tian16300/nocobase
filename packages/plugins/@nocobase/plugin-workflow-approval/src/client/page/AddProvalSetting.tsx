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
import React, { useEffect, useRef, useState } from 'react';
import { LeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input as AntdInput, Space } from 'antd';
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
} from '@nocobase/client';
import { createForm } from '@formily/core';
import { FormStep, FormButtonGroup } from '@formily/antd-v5';
import { FormProvider, FormConsumer, useForm } from '@formily/react';
import { uid } from '@nocobase/utils';
import { observer, useField, useFieldSchema } from '@formily/react';
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
    collection: values?.collection
  };
};
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
        <SchemaComponentProvider
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
        </SchemaComponentProvider>
      </PageContainer>
    </div>
  );
};
