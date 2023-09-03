import { defineCollection } from '@nocobase/database';

export default defineCollection({
  namespace: 'system-settings.systemSettings',
  duplicator: 'optional',
  name: 'systemSettings',
  title: '系统设置',
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: { type: 'string', title: '{{t("Title")}}' },
    }, {
      interface: 'input',
      type: 'string',
      name: 'simpleTitle',
      uiSchema: { type: 'string', title: '{{t("Simple Title")}}' },
    },
    {

      type: 'boolean',
      name: 'showLogoOnly',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Show Logo Only")}}',
        'x-component': 'Switch'
      },
    }, {

      type: 'boolean',
      name: 'allowSignUp',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Allow Sign Up")}}',
        'x-component': 'Switch',
        default: true
      },
    }, {

      type: 'boolean',
      name: 'smsAuthEnabled',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Sms Auth Enabled")}}',
        'x-component': 'Switch',
        default: true
      },
    },
    {
      interface: 'linkTo',
      type: 'belongsTo',
      name: 'logo',
      target: 'attachments',
      uiSchema: {
        // title,
        'x-component': 'AssociationField',
        'x-component-props': {
          // mode: 'tags',
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
      reverseField: {
        interface: 'linkTo',
        type: 'belongsToMany',
        // name,
        uiSchema: {
          // title,
          'x-component': 'AssociationField',
          'x-component-props': {
            // mode: 'tags',
            multiple: true,
            fieldNames: {
              label: 'id',
              value: 'id',
            },
          },
        },
      },
    },
    {

      type: 'json',
      name: 'enabledLanguages',
      defaultValue: ['zh-CN'],
    },
    {
      type: 'string',
      name: 'appLang',
    },
    {
      type: 'json',
      name: 'options',
      defaultValue: {},
    },
  ],
});
