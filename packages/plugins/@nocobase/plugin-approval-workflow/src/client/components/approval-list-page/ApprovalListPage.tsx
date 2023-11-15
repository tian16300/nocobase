import React from 'react';
import { RecursionField, useFieldSchema } from '@formily/react';
import { uid } from '@nocobase/utils';
export const ApprovalListPage = () => {
  /* 详情链接 */
  const linkWorkflowNodesPage = '';
  const createFieldSchema = (action: string) => {
    return {
      name: {
        type: 'string',
        'x-component': 'CollectionField',
        'x-decorator': 'FormItem',
        'x-collection-field': 'approve_workflows.name',
        'x-component-props': {},
      },
      collection: {
        type: 'string',
        'x-component': 'CollectionField',
        'x-decorator': 'FormItem',
        'x-collection-field': 'approve_workflows.collection',
        'x-component-props': {
          style: {
            width: '100%',
          },
        },
        'x-pretty-read': action == 'update'
      },
      description: {
        type: 'string',
        'x-component': 'CollectionField',
        'x-decorator': 'FormItem',
        'x-collection-field': 'approve_workflows.description',
        'x-component-props': {},
      }
    };
  };
  const createForm = {
    drawer: {
      type: 'void',
      title: '新增流程',
      'x-component': 'Action.Drawer',
      'x-component-props': {
        // className: 'nb-action-popup',
        // title: '{{ t("Add record") }}'
      },
      properties: {
        [uid()]: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: true,
          },
          'x-acl-action': 'approve_workflows:create',
          'x-decorator': 'FormBlockProvider',
          'x-decorator-props': {
            resource: 'approve_workflows',
            collection: 'approve_workflows',
          },
          'x-component': 'FormV2',
          'x-component-props': {
            useProps: '{{ useFormBlockProps }}',
          },
          properties: {
            ...createFieldSchema('create'),
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': {
                layout: 'one-column',
                style: {
                  marginTop: 24,
                },
              },
              properties: {
                [uid()]: {
                  title: '{{ t("Submit") }}',
                  'x-action': 'submit',
                  'x-component': 'Action',
                  'x-component-props': {
                    type: 'primary',
                    htmlType: 'submit',
                    useProps: '{{ useCreateActionProps }}',
                  },
                  'x-action-settings': {
                    triggerWorkflows: [],
                  },
                  type: 'void',
                },
              },
            },
          },
        },
      },
    },
  };
  const updateForm = {
    drawer: {
      type: 'void',
      title: '编辑流程',
      'x-component': 'Action.Container',
      'x-component-props': {
        // className: 'nb-action-popup',
      },
      properties: {
        grid: {
          type: 'void',
          'x-component': 'Grid',
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
                      type: 'void',
                      'x-acl-action-props': {
                        skipScopeCheck: false,
                      },
                      'x-acl-action': 'approve_workflows:update',
                      'x-decorator': 'FormBlockProvider',
                      'x-decorator-props': {
                        useSourceId: '{{ useSourceIdFromParentRecord }}',
                        useParams: '{{ useParamsFromRecord }}',
                        action: 'get',
                        resource: 'approve_workflows',
                        collection: 'approve_workflows',
                      },

                      'x-component': 'FormV2',
                      'x-component-props': {
                        useProps: '{{ useFormBlockProps }}',
                      },
                      properties: {
                        ...createFieldSchema('update'),
                        actions: {
                          type: 'void',
                          'x-component': 'ActionBar',
                          'x-component-props': {
                            layout: 'one-column',
                            style: {
                              marginTop: 24,
                            },
                          },
                          properties: {
                            [uid()]: {
                              title: '{{ t("Submit") }}',
                              'x-action': 'submit',
                              'x-component': 'Action',
                              'x-component-props': {
                                type: 'primary',
                                htmlType: 'submit',
                                useProps: '{{ useUpdateActionProps }}',
                              },
                              'x-action-settings': {
                                triggerWorkflows: [],
                              },
                              type: 'void',
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
        },
      },
    },
  };
  const schema = {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [uid()]: {
            type: 'void',
            'x-decorator': 'TableBlockProvider',
            // 'x-acl-action': 'workflows:list',
            'x-decorator-props': {
              collection: 'workflows',
              resource: 'workflows',
              action: 'list',
              params: {
                pageSize: 10,
              },
              rowKey: 'id',
              showIndex: true,
              dragSort: false,
              disableTemplate: false,
              fixedBlock: false,
            },
            'x-component': 'CardItem',
            'x-filter-targets': [],
            // properties: {
            //   actions: {
            //     type: 'void',
            //     'x-component': 'ActionBar',
            //     'x-component-props': {
            //       style: {
            //         marginBottom: 'var(--nb-spacing)',
            //       },
            //     },
            //     properties: {
            //       view: {
            //         type: 'void',
            //         title: '{{ t("Filter") }}',
            //         'x-action': 'filter',

            //         'x-component': 'Filter.Action',
            //         'x-component-props': {
            //           icon: 'FilterOutlined',
            //           useProps: '{{ useFilterActionProps }}',
            //         },
            //         'x-align': 'left',
            //       },
            //       create: {
            //         type: 'void',
            //         'x-action': 'create',
            //         'x-acl-action': 'create',
            //         title: "{{t('Add new')}}",
            //         'x-component': 'Action',
            //         'x-decorator': 'ACLActionProvider',
            //         'x-component-props': {
            //           openMode: 'modal',
            //           type: 'primary',
            //           icon: 'PlusOutlined',
            //           openSize: 'small',
            //         },
            //         'x-align': 'right',
            //         'x-acl-action-props': {
            //           skipScopeCheck: true,
            //         },
            //         properties: createForm,
            //       },
            //       enable: {
            //         type: 'void',
            //         title: '启用',
            //         'x-component': 'Action',
            //         'x-align': 'right',
            //         'x-acl-action': 'update',
            //         'x-decorator': 'ACLActionProvider',
            //         'x-acl-action-props': {
            //           skipScopeCheck: true,
            //         },
            //         'x-action': 'customize:bulkUpdate',
            //         'x-action-settings': {
            //           assignedValues: {
            //             enable: true,
            //           },
            //           updateMode: 'selected',
            //           onSuccess: {
            //             manualClose: true,
            //             redirecting: false,
            //             successMessage: '{{t("Updated successfully")}}',
            //           },
            //           schemaUid: 'zmldpgyrlq0',
            //         },
            //         'x-component-props': {
            //           icon: null,
            //           useProps: '{{ useCustomizeBulkUpdateActionProps }}',
            //           size: 'default',
            //         },
            //       },
            //       disable: {
            //         type: 'void',
            //         title: '停用',
            //         'x-component': 'Action',
            //         'x-align': 'right',
            //         'x-acl-action': 'update',
            //         'x-decorator': 'ACLActionProvider',
            //         'x-acl-action-props': {
            //           skipScopeCheck: true,
            //         },
            //         'x-action': 'customize:bulkUpdate',

            //         'x-action-settings': {
            //           assignedValues: {
            //             enable: false,
            //           },
            //           updateMode: 'selected',
            //           onSuccess: {
            //             manualClose: true,
            //             redirecting: false,
            //             successMessage: '{{t("Updated successfully")}}',
            //           },
            //         },
            //         'x-component-props': {
            //           icon: null,
            //           useProps: '{{ useCustomizeBulkUpdateActionProps }}',
            //           type: 'default',
            //           size: 'default',
            //         },
            //       },
            //       destroy: {
            //         title: '{{ t("Delete") }}',
            //         'x-action': 'destroy',
            //         'x-component': 'Action',

            //         'x-decorator': 'ACLActionProvider',
            //         'x-acl-action-props': {
            //           skipScopeCheck: true,
            //         },
            //         'x-component-props': {
            //           icon: 'DeleteOutlined',
            //           confirm: {
            //             title: "{{t('Delete record')}}",
            //             content: "{{t('Are you sure you want to delete it?')}}",
            //           },
            //           useProps: '{{ useBulkDestroyActionProps }}',
            //         },
            //         'x-acl-action': 'approve_workflows:destroy',
            //         'x-align': 'right',
            //         type: 'void',
            //       },
            //     },
            //   },
            //   table: {
            //     type: 'array',
            //     'x-component': 'TableV2',
            //     'x-component-props': {
            //       rowKey: 'id',
            //       rowSelection: {
            //         type: 'checkbox',
            //       },
            //       useProps: '{{ useTableBlockProps }}',
            //     },
            //     properties: {
            //       [uid()]: {
            //         type: 'void',
            //         'x-decorator': 'TableV2.Column.Decorator',
            //         'x-component': 'TableV2.Column',
            //         'x-component-props': {
            //           width: 140,
            //         },
            //         properties: {
            //           name: {
            //             'x-collection-field': 'approve_workflows.name',
            //             'x-component': 'CollectionField',
            //             'x-component-props': {
            //               ellipsis: true,
            //             },
            //             'x-read-pretty': true,
            //             'x-decorator': null,
            //             'x-decorator-props': {
            //               labelStyle: {
            //                 display: 'none',
            //               },
            //             },
            //           },
            //         },
            //         // 'x-component-props': {
            //         //   width: 180
            //         // },
            //       },
            //       [uid()]: {
            //         type: 'void',
            //         'x-decorator': 'TableV2.Column.Decorator',
            //         'x-component': 'TableV2.Column',
            //         'x-component-props': {
            //           width: 120,
            //           sorter: true,
            //           sortName: 'collection',
            //         },
            //         properties: {
            //           collection: {
            //             'x-collection-field': 'approve_workflows.collection',
            //             'x-component': 'CollectionField',
            //             'x-component-props': {
            //               style: {
            //                 width: '100%',
            //               },
            //               ellipsis: true,
            //             },
            //             'x-read-pretty': true,
            //             'x-decorator': null,
            //             'x-decorator-props': {
            //               labelStyle: {
            //                 display: 'none',
            //               },
            //             },
            //           },
            //         },
            //       },
            //       [uid()]: {
            //         type: 'void',
            //         'x-decorator': 'TableV2.Column.Decorator',
            //         'x-component': 'TableV2.Column',
            //         'x-component-props': {
            //           width: 100,
            //         },
            //         properties: {
            //           enable: {
            //             'x-collection-field': 'approve_workflows.enable',
            //             'x-component': 'CollectionField',
            //             'x-component-props': {
            //               ellipsis: true,
            //               onChange: '{{ useTableBlockProps.onFieldChange("enable") }}',
            //             },
            //             // 'x-read-pretty': true,
            //             'x-decorator': null,
            //             'x-decorator-props': {
            //               labelStyle: {
            //                 display: 'none',
            //               },
            //             },
            //           },
            //         },
            //       },
            //       actions: {
            //         type: 'void',
            //         title: '{{ t("Actions") }}',
            //         'x-action-column': 'actions',
            //         'x-decorator': 'TableV2.Column.ActionBar',
            //         'x-component': 'TableV2.Column',
            //         'x-component-props': {
            //           // width: 140,
            //         },
            //         properties: {
            //           actions: {
            //             type: 'void',
            //             'x-decorator': 'DndContext',
            //             'x-component': 'Space',
            //             'x-component-props': {
            //               split: '',
            //             },
            //             properties: {
            //               [uid()]: {
            //                 type: 'void',
            //                 title: '配置',
            //                 'x-action': 'customize:popup',
            //                 'x-component': 'Action.Link',
            //                 'x-component-props': {
            //                   openMode: 'link',
            //                   component: 'RecordLink',
            //                   icon: 'searchoutlined',
            //                   size: 'small',
            //                   to: linkWorkflowNodesPage,
            //                 },
            //                 'x-designer-props': {
            //                   linkageAction: true,
            //                 },
            //               },
            //               update: {
            //                 type: 'void',
            //                 title: '编辑',
            //                 'x-action': 'update',
            //                 'x-component': 'Action.Link',
            //                 'x-component-props': {
            //                   openMode: 'drawer',
            //                   openSize: 'small',
            //                   size: 'small',
            //                 },
            //                 'x-decorator': 'ACLActionProvider',
            //                 'x-designer-props': {
            //                   linkageAction: true,
            //                 },
            //                 properties: updateForm,
            //               },
            //               duplicate: {
            //                 type: 'void',
            //                 'x-action': 'duplicate',
            //                 'x-acl-action': 'create',
            //                 title: '复制',
            //                 'x-component': 'Action.Link',
            //                 'x-decorator': 'ACLActionProvider',
            //                 'x-component-props': {
            //                   openMode: 'modal',
            //                   duplicateMode: 'continueduplicate',
            //                   duplicateFields: ['collection', 'approval_workflow_nodes', 'description'],
            //                   duplicateCollection: 'approve_workflows',
            //                   openSize: 'small',
            //                 },
            //                 'x-designer-props': {
            //                   linkageAction: true,
            //                 },
            //                 properties: {
            //                   drawer: {
            //                     type: 'void',
            //                     title: '{{ t("Duplicate") }}',
            //                     'x-component': 'Action.Container',
            //                     'x-component-props': {
            //                       // className: 'nb-action-popup',
            //                     },
            //                     properties: {
            //                       [uid()]: {
            //                         type: 'void',
            //                         'x-acl-action-props': {
            //                           skipScopeCheck: true,
            //                         },
            //                         'x-acl-action': 'approve_workflows:create',
            //                         'x-decorator': 'FormBlockProvider',
            //                         'x-decorator-props': {
            //                           resource: 'approve_workflows',
            //                           collection: 'approve_workflows',
            //                         },
            //                         'x-component': 'FormV2',
            //                         'x-component-props': {
            //                           useProps: '{{ useFormBlockProps }}',
            //                         },
            //                         properties: {
            //                           name: {
            //                             type: 'string',
            //                             name: 'name',
            //                             'x-designer': 'FormItem.Designer',
            //                             'x-component': 'CollectionField',
            //                             'x-decorator': 'FormItem',
            //                             'x-collection-field': 'approve_workflows.name',
            //                             'x-component-props': {},
            //                           },
            //                           actions: {
            //                             type: 'void',
            //                             'x-component': 'ActionBar',
            //                             'x-component-props': {
            //                               layout: 'one-column',
            //                               style: {
            //                                 marginTop: 24,
            //                               },
            //                             },
            //                             properties: {
            //                               submit: {
            //                                 title: '{{ t("Submit") }}',
            //                                 'x-action': 'submit',
            //                                 'x-component': 'Action',
            //                                 'x-designer': 'Action.Designer',
            //                                 'x-component-props': {
            //                                   type: 'primary',
            //                                   htmlType: 'submit',
            //                                   useProps: '{{ useCreateActionProps }}',
            //                                 },
            //                                 'x-action-settings': {
            //                                   triggerWorkflows: [],
            //                                 },
            //                                 type: 'void',
            //                               },
            //                             },
            //                           },
            //                         },
            //                       },
            //                     },
            //                   },
            //                 },
            //               },
            //               [uid()]: {
            //                 title: '删除',
            //                 'x-action': 'destroy',
            //                 'x-component': 'Action.Link',
            //                 'x-component-props': {
            //                   confirm: {
            //                     title: "{{t('Delete record')}}",
            //                     content: "{{t('Are you sure you want to delete it?')}}",
            //                   },
            //                   useProps: '{{ useDestroyActionProps }}',
            //                   size: 'small',
            //                 },
            //                 'x-decorator': 'ACLActionProvider',
            //                 'x-designer-props': {
            //                   linkageAction: true,
            //                 },
            //                 type: 'void',
            //               },
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
          },
        },
      },
    },
  };
  return <RecursionField name={'approval-list'} schema={schema} />;
};
