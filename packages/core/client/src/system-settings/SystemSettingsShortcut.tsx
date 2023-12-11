import { ISchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';
import { Card, message } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSystemSettings } from '.';
import { i18n, useAPIClient, useRequest } from '..';
import locale from '../locale';
import { SchemaComponent, useActionContext } from '../schema-component';
import {
  FormGrid,
  FormItem
} from '@formily/antd-v5'
const langs = Object.keys(locale).map((lang) => {
  return {
    label: `${locale[lang].label} (${lang})`,
    value: lang,
  };
});

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const useSystemSettingsValues = (options) => {
  const { visible } = useActionContext();
  const result = useSystemSettings();
  return useRequest(() => Promise.resolve(result.data), {
    ...options,
    refreshDeps: [visible],
  });
};

const useSaveSystemSettingsValues = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { mutate, data } = useSystemSettings();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      mutate({
        data: {
          ...data?.data,
          ...values,
        },
      });
      await api.request({
        url: 'systemSettings:update/1',
        method: 'post',
        data: values,
      });
      message.success(t('Saved successfully'));
      const lang = values.enabledLanguages?.[0] || 'en-US';
      if (values.enabledLanguages.length < 2 && api.auth.getLocale() !== lang) {
        api.auth.setLocale('');
        window.location.reload();
      } else {
        setVisible(false);
      }
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useSystemSettingsValues }}',
      },
      'x-component': 'div',
      type: 'void',
      title: '{{t("System settings")}}',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            maxColumns: 2,
            minColumns: 2
          },
          properties: {
            title: {
              type: 'string',
              title: "{{t('System title')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              required: true,
            },
            simpleTitle: {
              type: 'string',
              title: "{{t('System simple title')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              required: false,
            },
            companyName: {
              type: 'string',
              title: "{{t('Company Name')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              required: false,
            },
            poweredBy: {
              type: 'string',
              title: "{{t('PoweredBy')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              required: false,
            },
            enabledLanguages: {
              type: 'array',
              title: '{{t("Enabled languages")}}',
              'x-component': 'Select',
              'x-component-props': {
                mode: 'multiple',
              },
              'x-decorator': 'FormItem',
              'x-decorator-props':{ gridSpan: 2 },
              enum: langs,
              'x-reactions': (field) => {
                field.dataSource = langs.map((item) => {
                  let label = item.label;
                  if (field.value?.[0] === item.value) {
                    label += `(${i18n.t('Default')})`;
                  }
                  return {
                    label,
                    value: item.value,
                  };
                });
              },
            },        
            logo: {
              type: 'string',
              title: "{{t('Logo')}}",
              'x-decorator': 'FormItem',
              'x-decorator-props':{ gridSpan: 2 },
              'x-component': 'Upload.Attachment',
              'x-component-props': {
                action: 'attachments:create',
                multiple: false,
                // accept: 'jpg,png'
              },
            }
          }
        },
        
        // allowSignUp: {
        //   type: 'boolean',
        //   default: true,
        //   'x-content': '{{t("Allow sign up")}}',
        //   'x-component': 'Checkbox',
        //   'x-decorator': 'FormItem',
        // },
        // smsAuthEnabled: {
        //   type: 'boolean',
        //   default: false,
        //   'x-content': '{{t("Enable SMS authentication")}}',
        //   'x-component': 'Checkbox',
        //   'x-decorator': 'FormItem',
        // },
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
            // cancel: {
            //   title: 'Cancel',
            //   'x-component': 'Action',
            //   'x-component-props': {
            //     useAction: '{{ useCloseAction }}',
            //   },
            // },
          },
        },
      },
    },
  },
};

export const SystemSettingsPane = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        scope={{ useSaveSystemSettingsValues, useSystemSettingsValues, useCloseAction }}
        components={{ FormGrid, FormItem }}
        schema={schema}
      />
    </Card>
  );
};
