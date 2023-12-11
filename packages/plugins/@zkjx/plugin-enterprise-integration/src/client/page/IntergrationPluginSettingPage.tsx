import {
  SchemaComponent,
  SystemSettingsProvider,
  useAPIClient,
  useActionContext,
  useRequest,
  useSystemSettings,
} from '@nocobase/client';
import React from 'react';
import { ISchema, useForm } from '@formily/react';
import { Card, message } from 'antd';
import { uid } from '@formily/shared';
import cloneDeep from 'lodash/cloneDeep';
import { useTranslation } from 'react-i18next';
import {pick} from 'lodash';
export const IntergrationPluginSettingPage = () => {
  return (
    <View />
  );
};

const useSaveSystemSettingsValues = () => {
  const form = useForm();
  const { mutate, data } = useSystemSettings();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      const obj = cloneDeep(form.values);
      const values = {
        ...data?.data,
        ...obj
      };
      mutate({
        data: values,
      });
      await api.request({
        url: 'systemSettings:update/1',
        method: 'post',
        data: values,
      });
      message.success(t('Saved successfully'));
    },
  };
};
const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useSystemSettingsAppConfigValues }}',
      },
      'x-component': 'div',
      type: 'void',
      title: '{{t("第三方应用设置")}}',
      properties: {
        "options.appConfig.type": {
          type: 'string',
          title: "{{t('应用类型')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          required: true,
          enum: [
            {
              label: '钉钉',
              value: 'dingding',
            },
            {
              label: '企业微信(未集成)',
              value: 'qywx',
            },
          ],
          default: 'dingding',
        },
        "options.appConfig.agentId": {
          type: 'string',
          title: "{{t('应用客户端(agentId)')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          required: true,
        },
        "options.appConfig.appKey": {
          type: 'string',
          title: "{{t('应用标识(appKey)')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          required: true,
        },
        "options.appConfig.appSecret": {
          type: 'string',
          title: "{{t('应用密钥(appSecret)')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          required: true,
        },
        footer1: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            layout: 'one-column',
          },
          properties: {
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
                useAction: '{{ useSaveSystemSettingsValues }}',
              },
            },
          },
        },
      },
    },
  },
};


const useSystemSettingsAppConfigValues = (options) => {
  const result = useSystemSettings();
  return useRequest(() => Promise.resolve(result.data), {
    ...options
  });
};
const View = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        scope={{ useSaveSystemSettingsValues, useSystemSettingsAppConfigValues }}
        schema={schema}
      />
    </Card>
  );
};
