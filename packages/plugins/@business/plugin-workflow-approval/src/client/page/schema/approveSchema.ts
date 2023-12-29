import { uid } from '@nocobase/utils';

export const createApproveSchema = (options: any = {}) => {
  const schema = {
    type: 'void',
    'x-component': 'Grid',
    'x-initializer': 'BlockInitializers',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Row',
        properties: {
          [uid()]: {
            type: 'void',
            'x-component': 'Grid.Col',
            properties: {
              [uid()]: {
                'x-uid': uid(),

                type: 'void',
                'x-acl-action-props': {
                  skipScopeCheck: true,
                },
                'x-acl-action': 'approval_results:create',
                'x-decorator': 'FormBlockProvider',
                'x-decorator-props': {
                  resource: 'approval_results',
                  collection: 'approval_results',
                },
                'x-designer': 'FormV2.Designer',
                'x-component': 'CardItem',
                'x-component-props': {
                  title: '审批意见',
                },
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'FormV2',
                    'x-component-props': {
                      useProps: '{{ useApproveFormBlockProps }}',
                    },
                    properties: {
                      grid: {
                        type: 'void',
                        'x-component': 'Grid',
                        'x-initializer': 'FormItemInitializers',
                        properties: {
                          [uid()]: {
                            type: 'void',
                            'x-component': 'Grid.Row',
                            properties: {
                              [uid()]: {
                                type: 'void',
                                'x-component': 'Grid.Col',
                                properties: {
                                  remark: {
                                    'x-uid': uid(),
                                    type: 'string',
                                    'x-designer': 'FormItem.Designer',
                                    'x-component': 'CollectionField',
                                    'x-decorator': 'FormItem',
                                    'x-collection-field': 'approval_results.remark',
                                    'x-component-props': {},
                                    'x-decorator-props': {
                                      showTitle: false,
                                    },
                                    
                                    
                                  },
                                },
                                'x-uid': uid(),
                                
                                
                              },
                            },
                            'x-uid': uid(),
                          },
                        },
                        'x-uid': uid(),
                      },
                      actions: {
                        type: 'void',
                        'x-initializer': 'FormActionInitializers',
                        'x-component': 'ActionBar',
                        'x-component-props': {
                          layout: 'one-column',
                          style: {
                            marginTop: 24,
                          },
                        },
                        properties: {
                          agree: {
                            'x-uid': uid(),
                            title: '同意',
                            'x-action': 'approval_apply:agree',
                            'x-designer': 'Action.Designer',
                            'x-component': 'Action',
                            'x-acl-action-props': {
                              skipScopeCheck: true,
                            },
                            'x-component-props': {
                              useProps: '{{ useAgreeActionProps }}',
                              type: 'primary',
                              size: 'default',
                            },
                            type: 'void',
                          },
                          reject: {
                            title: '拒绝',
                            'x-action': 'approval_apply:reject',
                            'x-designer': 'Action.Designer',
                            'x-component': 'Action',
                            'x-acl-action-props': {
                              skipScopeCheck: true,
                            },
                            'x-component-props': {
                              useProps: '{{ useRejectActionProps }}',
                            },
                            type: 'void',
                            'x-uid': uid(),                            
                            
                          },
                        },
                        'x-uid': uid(),
                      },
                    },
                    'x-uid': uid(),
                  },
                },
              },
            },
            'x-uid': uid(),
          },
        },
        'x-uid': uid(),
      },
    },
    'x-uid': uid(),
  };
  return schema;
};
