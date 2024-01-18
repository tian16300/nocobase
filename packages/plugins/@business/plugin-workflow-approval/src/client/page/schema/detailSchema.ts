import { createFormBlockSchema, css } from '@nocobase/client';
import { uid } from '@nocobase/utils';

export const createDetailSchema = (options: any = {}) => {
  const width = 100 / 4;
  const template = {
    type: 'void',
    'x-component': 'Grid',
    'x-uid': uid(),
    'x-initializer': 'ReadPrettyFormItemInitializers',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Row',
        properties: {
          [`col_${uid()}`]: {
            type: 'void',
            'x-component': 'Grid.Col',
            'x-component-props': {
              width,
            },
            properties: {
              code: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.code',
              },
            },
            'x-uid': uid(),
          },
          [`col_${uid()}`]: {
            type: 'void',
            'x-component': 'Grid.Col',
            'x-component-props': {
              width,
            },
            properties: {
              applyUser: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.applyUser',
                'x-component-props': {
                  fieldNames: {
                    label: 'nickname',
                    value: 'id',
                  },
                },
              },
            },
            'x-uid': uid(),
          },
          [`col_${uid()}`]: {
            type: 'void',
            'x-component': 'Grid.Col',
            'x-component-props': {
              width,
            },
            'x-uid': uid(),
            properties: {
              status: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.status',
                'x-component-props': {
                  style: {
                    width: '100%',
                  },
                },
                'x-uid': uid(),
              },
            },
          },
          [`col_${uid()}`]: {
            type: 'void',
            'x-component': 'Grid.Col',
            'x-component-props': {
              width,
            },
            'x-uid': uid(),
            properties: {
              currentApprovalUsers: {
                type: 'string',
                name: 'currentApprovalUsers',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.currentApprovalUsers',
                'x-component-props': {
                  fieldNames: {
                    label: 'nickname',
                    value: 'id',
                  },
                },
                'x-uid': uid(),
              },
            },
          },
          [`col_${uid()}`]: {
            'x-component': 'Grid.Col',
            'x-component-props': {
              width,
            },
            'x-uid': uid(),
            type: 'void',
            properties: {
              updatedAt: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.updatedAt',
                'x-component-props': {
                  dateFormat: 'YYYY-MM-DD',
                  showTime: true,
                  timeFormat: 'HH:mm:ss',
                },
                'x-read-pretty': true,
                'x-uid': uid(),
              },
            },
          },
        },
      },
    },
  };
  return {
    name: 'detail',
    ...createFormBlockSchema({
      name: 'apply_detail',
      formItemInitializers: 'ReadPrettyFormItemInitializers',
      collection: 'approval_apply',
      readPretty: true,
      action: 'get',
      params: {
        filterByTk: options.id,
      },
      layout: 'horizontal',
      template,
      cardStyle: {
        className: [
          'card',
          css`
            .nb-action-bar {
                display: none!important;
              }
          `,
        ],
      },
    }),
  };
};
