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
import { FlowContext } from '@nocobase/plugin-workflow/client';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
    title: '选择数据模型'
  },
  {
    title: '显示设置'
  },
  {
    title: '流程设置'
  },
];

export const AddProvalSetting = (props) => {
  const {app} = props;
  const params = useParams<any>();
  
  const [searchParams] = useSearchParams();
  const [flowName, setFlowName] = useState('审批单名称');
  const [edit, setEdit] = useState(false);
 
  const { token } = useToken();
  const [current, setCurrent] = useState(0);
  const [dn, setDn] = useState<any>(null);
  const [workflow, setWorkFlow] = useState<any>(null);
  
  const [collection, setCollection] = useState(null);  
  const [appends, setAppends] = useState([]);
  const [isAllowNext, setIsAllowNext] = useState<any>(false);
  const [initialSchema, setInitialSchema] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const api = useAPIClient();
  const form = createForm({});  
  const navigate = useNavigate();
  const nodes = [];
  const _params = useMemo(()=>{
    return {      
      ...workflow,
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
    }
  },[workflow,flowName,collection, appends  ]);
  useEffect(()=>{
    const filterByTk =  searchParams.get('id');
    if(filterByTk){
      api.resource('workflows').get({
        filterByTk: filterByTk,
        appends: ['nodes', 'revisions.id', 'revisions.createdAt', 'revisions.current', 'revisions.executed', 'revisions.enabled']
      }).then((res)=>{
        const data = res.data?.data;
        setWorkFlow(data);
        setFlowName(data.title);
        setCollection(data.bussinessCollectionName);
        setAppends(data.config?.appends);
      })
    }
  },[searchParams.get('id')]);
  const handleSave = async () => {  
    setLoading(true);
    if(!_params.id){
     const res =   await api.resource('workflows').create({
        values: _params
      });
      navigate(app.router.get('admin.workflow.approval.form').path+'?id='+res.data?.data?.id);
      return res.data?.data;
    }else{
      const res =  await api.resource('workflows').update({
        filterByTk: _params.id,
        values: _params
      });
      return res.data?.data?.[0];
    }
  };

  useEffect(()=>{
    if(current == 0 && collection){
      setIsAllowNext(true);
    }
  },[
    current,
    collection
  ]);

 

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
      // const values = form.values;
      // setDataModel(values);
      /**
       * 1. 选择数据模型
       */
      // 创建 workflow 数据模型
      /**
       * 保存数据
       */
      const res = await handleSave();
      setWorkFlow(res);
      if(!initialSchema){
        setInitialSchema(createSchema(res.bussinessCollectionName));    
      } 
      setTimeout(()=>{
        setLoading(false);
        next();
      }, 1000)
      
    
     
    } else if (current == 1) {
      if(workflow?.id){
        next();
      }      
    }
   
  };
  useEffect(()=>{
    if(collection){
      setInitialSchema(createSchema(collection));  
    }
  },[collection]);
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
        <ApprovalSettingContext.Provider value={{ form, collection, setCollection,  appends,  setAppends,  workflow, initialSchema, setInitialSchema, dn, setDn }}>
        <FlowContext.Provider  value={{
           workflow,
            nodes

        }
          
        }>
          <Card
            className={css`
              height: 100%;
            `}
          >
            <div>
              <div className={css`width:80%; margin:0 auto;`}><Steps current={current} items={items} /></div>
            </div>
            <Divider></Divider>
            <div className={css``}>
              {current == 0 && <SelectDataModel />}
              {current == 1 && workflow?.id && <DesignSchemaView />}
              {current == 2 && <FlowCanvas />}
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
              <Button type="primary" onClick={() => message.success('已配置完成!')}>
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
