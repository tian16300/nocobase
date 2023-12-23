import { uid } from '@nocobase/utils';

export const createDetailSchema = (options: any = {}) => {
  return {
    type: 'void',
    name: 'grid',
    'x-component': 'Grid',
    'x-uid': uid(),
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Row',
        properties: {
          [uid()]: {
              type: 'void',
            'x-component': 'Grid.Col',
            'x-uid': uid(),
            properties: {
              [uid()]: {
                type: 'void',
                'x-acl-action': 'approval_apply:view',
                'x-decorator': 'DetailsBlockProvider',
                'x-decorator-props': {
                  resource: 'approval_apply',
                  collection: 'approval_apply',
                  readPretty: true,
                  action: 'list',
                  params: {
                    "pageSize": 1,
                    "filter": {
                        "$and": [
                            {
                                "id": {
                                    "$eq": options.id
                                }
                            }
                        ]
                    }
                },
                  rowKey: 'id',
                },
                'x-designer': 'DetailsDesigner',
                'x-component': 'CardItem',
                'x-uid': uid(),
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'Details',
                    'x-read-pretty': true,
                    'x-component-props': {
                      useProps: '{{ useDetailsBlockProps }}',
                    },
                    'x-uid': uid(),
                    properties: {
                      grid: {
                        type: 'void',
                        'x-component': 'Grid',
                        'x-uid': uid(),
                        properties: {
                          [uid()]: {
                            type: 'void',
                            'x-component': 'Grid.Row',
                            properties: {
                              [`col_${uid()}`]: {
                                type: 'void',
                                'x-component': 'Grid.Col',
                                'x-component-props': {
                                  width: 33.333333333333336,
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
                                  width: 33.333333333333336,
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
                                'x-component': 'Grid.Col',
                                'x-component-props': {
                                  width: 33.333333333333336,
                                },
                                'x-uid': uid(),
                                type: 'void',
                                properties: {
                                  createdAt: {
                                    type: 'string',
                                    'x-designer': 'FormItem.Designer',
                                    'x-component': 'CollectionField',
                                    'x-decorator': 'FormItem',
                                    'x-collection-field': 'approval_apply.createdAt',
                                    'x-component-props': {},
                                    'x-read-pretty': true,
                                    'x-uid': uid(),
                                  },
                                },
                              },
                            },
                          },
                          [uid()]: {
                            'x-component': 'Grid.Row',
                            'x-uid': uid(),
                            type: 'void',
                            properties: {
                              [`col_${uid()}`]: {
                                'x-component': 'Grid.Col',
                                'x-uid': uid(),
                                type: 'void',
                                properties: {
                                  applyReason: {
                                    type: 'string',
                                    'x-designer': 'FormItem.Designer',
                                    'x-component': 'CollectionField',
                                    'x-decorator': 'FormItem',
                                    'x-collection-field': 'approval_apply.applyReason',
                                    'x-component-props': {},
                                    'x-uid': uid(),
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      pagination: {
                        type: 'void',
                        'x-component': 'Pagination',
                        'x-component-props': {
                          useProps: '{{ useDetailsPaginationProps }}',
                        },
                        'x-uid': uid(),
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
