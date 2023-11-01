import { defineCollection } from '@nocobase/database';

export default defineCollection({
  namespace: 'system-settings.systemSettings',
  duplicator: 'optional',
  name: 'systemSettings',
  fields: [
    {
      type: 'string',
      name: 'title',
      translation: true
    },
    {
      type: 'string',
      name: 'simpleTitle',
      translation: true
    },
    {
      type: 'string',
      name: 'companyName',
      translation: true
    },
    {
      type: 'string',
      name: 'poweredBy',
      translation: true
    },
    {
      type: 'boolean',
      name: 'showLogoOnly',
    },
    {
      type: 'boolean',
      name: 'allowSignUp',
      defaultValue: true,
    },
    {
      type: 'boolean',
      name: 'smsAuthEnabled',
      defaultValue: false,
    },
    {
      type: 'belongsTo',
      name: 'logo',
      target: 'attachments',
    },
    {
      type: 'json',
      name: 'enabledLanguages',
      defaultValue: [],
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
