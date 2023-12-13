import { uid } from '@nocobase/utils';

export const config = {
  name: uid(),
  type: 'void',
  required: true,
  'x-component': 'ApprovalSchemaConfigSetting',
  'x-component-props': {},
  properties: {
    form: {
      type: 'void',
      'x-decorator': 'FormBlockProvider',
      'x-decorator-props': {
        collection: 'bom',
        resourceName: 'bom',
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
};
export const createSchema = (collection) => {
  return {
    name: uid(),
    type: 'void',
    required: true,
    'x-component': 'ApprovalSchemaConfigSetting',
    'x-component-props': {},
    properties: {
      form: {
        type: 'void',
        'x-decorator': 'FormBlockProvider',
        'x-decorator-props': {
          collection: collection,
          resourceName: collection,
        },
        'x-acl-action': ``,
        'x-component': 'CardItem',
        'x-designer': 'FormV2.Designer',
        properties: {
          [uid()]: {
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
  };
};
