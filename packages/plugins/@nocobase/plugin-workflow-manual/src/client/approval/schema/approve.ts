export const approve = {
  type: 'void',
  'x-decorator': 'FormBlockProvider',
  'x-decorator-props': {
    formType: 'create',
    resource: 'approve_logs',
    collection: 'approve_logs',
  },
  'x-designer': 'CreateFormDesigner',
  'x-component': 'CardItem',
  'x-component-props': {
    title: '审批',
  },
  properties: {
    form: {
      type: 'void',
      'x-component': 'FormV2',
      'x-component-props': {
        useProps: '{{ useFormBlockProps }}',
      },
      properties: {
        collectionName: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.collectionName',
          'x-component-props': {
            style: {
              width: '100%',
            },
          },
        },
        bill_no: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.bill_no',
          'x-component-props': {},
        },
        action_time: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.action_time',
          'x-component-props': {},
        },
        comment: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.comment',
          'x-component-props': {},
        },
        approval_user: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.approval_user',
          'x-component-props': {},
        },
        approval_result: {
          type: 'string',
          'x-designer': 'FormItem.Designer',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'approve_logs.approval_result',
          'x-component-props': {},
        },
      },
      actions: {
        type: 'void',
        'x-initializer': 'AddActionButton',
        'x-component': 'ActionBar',
        'x-component-props': {
          layout: 'one-column',
          style: {
            marginTop: '1.5em',
            flexWrap: 'wrap',
          },
        },
        properties: {
          resolve: {
            type: 'void',
            title: '同意',
            'x-decorator': 'ManualActionStatusProvider',
            'x-decorator-props': {
              value: 1,
            },
            'x-component': 'Action',
            'x-component-props': {
              type: 'primary',
              useAction: '{{ useSubmit }}',
              size: 'default',
            },
            'x-designer': 'ManualActionDesigner',
            'x-designer-props': {},
            'x-action-settings': {
              assignedValues: {
                schema: {
                  type: 'void',
                  'x-component': 'Grid',
                  'x-initializer': 'CustomFormItemInitializers',

                  properties: {
                    lviocoi4d35: {
                      type: 'void',
                      'x-component': 'Grid.Row',
                      properties: {
                        p8brky8afwp: {
                          type: 'void',
                          'x-component': 'Grid.Col',
                          properties: {
                            approval_result: {
                              type: 'string',
                              title: '审批结果',
                              'x-designer': 'FormItem.Designer',
                              'x-component': 'AssignedField',
                              'x-decorator': 'FormItem',
                              'x-collection-field': 'approve_logs.approval_result',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                values: {
                  approval_result: true,
                },
              },
            },
          },
          reject: {
            type: 'void',
            title: '拒绝',
            'x-decorator': 'ManualActionStatusProvider',
            'x-decorator-props': {
              value: -5,
            },
            'x-component': 'Action',
            'x-component-props': {
              danger: true,
              useAction: '{{ useSubmit }}',
              type: 'default',
              size: 'default',
            },
            'x-designer': 'Action.Designer',
            'x-action': '-5',
          },
        },
        'x-decorator': 'ActionBarProvider'
      },
    },
  },
};
