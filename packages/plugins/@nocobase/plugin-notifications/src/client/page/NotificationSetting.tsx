import React from 'react';

import {
  SchemaComponent,
  SystemSettingsProvider,
  useAPIClient,
  useActionContext,
  useRequest,
  useSystemSettings,
} from '@nocobase/client';
import { ISchema, useForm } from '@formily/react';
import { Card, message } from 'antd';
import { uid } from '@formily/shared';
import cloneDeep from 'lodash/cloneDeep';
import { useTranslation } from 'react-i18next';
import { pick } from 'lodash';
export const NotificationSetting = () => {
  return <View />;
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
        ...obj,
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
      title: '{{t("通知设置")}}',
      properties: {
        'options.noficationConfig.type': {
          type: 'string',
          title: "{{t('通知服务')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          required: true,
          enum: [
            {
              label: '邮件',
              value: 'email',
            },
            {
              label: '钉钉',
              value: 'dingding',
            },
          ],
          default: 'dingding',
        },
        'options.noficationConfig.title': {
          type: 'string',
          title: "{{t('服务名称')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions':[{
            dependencies: ['options.noficationConfig.type'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "email"}}',
              },
            },
          }]
        },
        'options.noficationConfig.options': {
          type: 'object',
          title: "{{t('配置')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.JSON',
          'x-component-props':{
            'rowSpan':10
          },
          'x-reactions':[{
            dependencies: ['options.noficationConfig.type'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "email"}}',
              },
            },
          }]
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
    ...options,
  });
};
const View = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent scope={{ useSaveSystemSettingsValues, useSystemSettingsAppConfigValues }} schema={schema} />
    </Card>
  );
};
