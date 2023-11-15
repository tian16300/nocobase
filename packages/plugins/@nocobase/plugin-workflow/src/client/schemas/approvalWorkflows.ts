import { ISchema, useForm } from '@formily/react';
import { useActionContext, useRecord, useResourceActionContext, useResourceContext } from '@nocobase/client';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { NAMESPACE } from '../locale';
// import { triggers } from '../triggers';
import React from 'react';
import { executionSchema } from './executions';
import { uid } from '@nocobase/utils';

const collection = {
  name: 'workflows',
  fields: [
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{t("Name")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      name: 'bussinessCollectionName',
      type: 'string',
      interface: 'collection',
      uiSchema: {
        type: 'string',
        'x-component': 'CollectionSelect',
        title: '关联业务表',
      },
    },
    {
      type: 'boolean',
      name: 'isApproval',
      interface: 'checkbox',
      uiSchema: {
        title: `{{t("isApproval", { ns: "${NAMESPACE}" })}}`,
        type: 'boolean',
        'x-component': 'Switch',
        'x-decorator': 'FormItem',
        default: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'type',
      interface: 'select',
      uiSchema: {
        title: `{{t("Trigger type", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          options: `{{getTriggersOptions()}}`,
        },
        required: true,
      } as ISchema,
      default: 'collection',
    },
    {
      type: 'string',
      name: 'description',
      interface: 'textarea',
      uiSchema: {
        title: '{{t("Description")}}',
        type: 'string',
        'x-component': 'Input.TextArea',
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'radioGroup',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        enum: [
          { label: `{{t("On", { ns: "${NAMESPACE}" })}}`, value: true, color: '#52c41a' },
          { label: `{{t("Off", { ns: "${NAMESPACE}" })}}`, value: false },
        ],
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        default: false,
      } as ISchema,
    },
    {
      type: 'number',
      name: 'allExecuted',
      interface: 'integer',
      uiSchema: {
        title: `{{t("Executed", { ns: "${NAMESPACE}" })}}`,
        type: 'number',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
      } as ISchema,
    },
    {
      type: 'object',
      name: 'options',
    },
    {
      name: 'config',
      type: 'json',
      interface: 'json',
      uiSchema: {
        type: 'object',
        'x-component': 'Input.JSON',
        'x-component-props': {
          autoSize: {
            minRows: 5,
          },
        },
        default: null,
        title: '配置',
      },
    },
  ],
};

const workflowFieldset = {
  title: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  type: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    required: true,
    // 'x-display': true
  },
  isApproval: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    // 'x-display': true
  },
  bussinessCollectionName: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    required: true,
  },
  config: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-reactions': [
      {
        dependencies: ['.bussinessCollectionName'],
        fulfill: {
          state: {
            value:'{{ {"collection": $deps[0] ,"changed": ["approve_status"],"appends": ["updatedBy", "updatedBy.dept"],"condition": { "$and": []},"mode": 2} }}'
          }
        },
      },
    ],
    'x-hidden': true
  },
  enabled: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  description: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  options: {
    type: 'object',
    'x-component': 'fieldset',
    properties: {
      // NOTE: not to expose this option for now, because hard to track errors
      // useTransaction: {
      //   type: 'boolean',
      //   title: `{{ t("Use transaction", { ns: "${NAMESPACE}" }) }}`,
      //   description: `{{ t("Data operation nodes in workflow will run in a same transaction until any interruption. Any failure will cause data rollback, and will also rollback the history of the execution.", { ns: "${NAMESPACE}" }) }}`,
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Checkbox',
      // },
      deleteExecutionOnStatus: {
        type: 'array',
        title: `{{ t("Auto delete history when execution is on end status", { ns: "${NAMESPACE}" }) }}`,
        'x-decorator': 'FormItem',
        'x-component': 'ExecutionStatusSelect',
        'x-component-props': {
          multiple: true,
        },
      },
    },
  },
};

export const approvalWorkflows: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-decorator': 'ResourceActionProvider',
      'x-decorator-props': {
        collection,
        resourceName: 'workflows',
        request: {
          resource: 'workflows',
          action: 'list',
          params: {
            filter: {
              current: true,
              isApproval: true,
            },
            sort: ['-createdAt'],
            except: ['config'],
          },
        },
      },
      'x-component': 'CollectionProvider',
      'x-component-props': {
        collection,
      },
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 16,
            },
          },
          properties: {
            filter: {
              type: 'void',
              title: '{{ t("Filter") }}',
              default: {
                $and: [{ title: { $includes: '' } }],
              },
              'x-action': 'filter',
              'x-component': 'Filter.Action',
              'x-component-props': {
                icon: 'FilterOutlined',
                useProps: '{{ cm.useFilterActionProps }}',
              },
              'x-align': 'left',
            },
            create: {
              type: 'void',
              title: '{{t("Add new")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
              },
              properties: {
                drawer: {
                  type: 'void',
                  'x-component': 'Action.Drawer',
                  'x-decorator': 'Form',
                  'x-decorator-props': {
                    initialValue: {
                      current: true,
                      type: 'collection',
                      isApproval: true,
                      config: {
                        collection: '',
                        changed: ['approve_status'],
                        appends: ['updatedBy', 'updatedBy.dept'],
                        condition: {
                          $and: [],
                        },
                        mode: 2,
                      },
                    },
                  },
                  title: '{{t("Add new")}}',
                  properties: {
                    title: workflowFieldset.title,
                    // type: workflowFieldset.type,
                    // isApproval: workflowFieldset.isApproval,
                    bussinessCollectionName: workflowFieldset.bussinessCollectionName,
                    config: workflowFieldset.config,
                    description: workflowFieldset.description,
                    options: workflowFieldset.options,
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Drawer.Footer',
                      properties: {
                        cancel: {
                          title: '{{ t("Cancel") }}',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: '{{ cm.useCancelAction }}',
                          },
                        },
                        submit: {
                          title: '{{ t("Submit") }}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction: '{{ cm.useCreateAction }}',
                          },
                        },
                      },
                    },
                  },
                  ['x-linkage-rules']: [
                    {
                      condition: {
                        $and: [],
                      },
                      actions: [
                        {
                          targetFields: ['type', 'isApproval'],
                          operator: 'hidden',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            delete: {
              type: 'void',
              title: '{{t("Delete")}}',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ cm.useBulkDestroyAction }}',
                confirm: {
                  title: "{{t('Delete record')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
              },
            },
          },
        },
        table: {
          type: 'void',
          'x-component': 'Table.Void',
          'x-component-props': {
            rowKey: 'id',
            rowSelection: {
              type: 'checkbox',
            },
            useDataSource: '{{ cm.useDataSourceFromRAC }}',
          },
          properties: {
            title: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: {
                title: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            bussinessCollectionName: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: {
                bussinessCollectionName: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            enabled: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: {
                enabled: {
                  type: 'boolean',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  default: false,
                },
              },
            },
            allExecuted: {
              type: 'void',
              'x-decorator': 'Table.Column.Decorator',
              'x-component': 'Table.Column',
              properties: {
                allExecuted: {
                  type: 'number',
                  'x-decorator': 'OpenDrawer',
                  'x-decorator-props': {
                    component: function Com(props) {
                      const record = useRecord();
                      return React.createElement('a', {
                        'aria-label': `executed-${record.title}`,
                        ...props,
                      });
                    },
                  },
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  properties: {
                    drawer: executionSchema,
                  },
                },
              },
            },
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'Table.Column',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    configure: {
                      type: 'void',
                      'x-component': 'WorkflowLink',
                      'x-component-props': {
                        params: '?from=approvalWorkflow',
                      },
                    },
                    update: {
                      type: 'void',
                      title: '{{ t("Edit") }}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        type: 'primary',
                      },
                      properties: {
                        drawer: {
                          type: 'void',
                          'x-component': 'Action.Drawer',
                          'x-decorator': 'Form',
                          'x-decorator-props': {
                            useValues: '{{ cm.useValuesFromRecord }}',
                          },
                          title: '{{ t("Edit") }}',
                          properties: {
                            title: workflowFieldset.title,
                            type: workflowFieldset.type,
                            isApproval: workflowFieldset.isApproval,
                            bussinessCollectionName: workflowFieldset.bussinessCollectionName,
                            enabled: workflowFieldset.enabled,
                            description: workflowFieldset.description,
                            options: workflowFieldset.options,
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Drawer.Footer',
                              properties: {
                                cancel: {
                                  title: '{{ t("Cancel") }}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    useAction: '{{ cm.useCancelAction }}',
                                  },
                                },
                                submit: {
                                  title: '{{ t("Submit") }}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    type: 'primary',
                                    useAction: '{{ cm.useUpdateAction }}',
                                  },
                                },
                              },
                            },
                          },
                          ['x-linkage-rules']: [
                            {
                              condition: {
                                $and: [],
                              },
                              actions: [
                                {
                                  targetFields: ['type', 'isApproval'],
                                  operator: 'hidden',
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                    revision: {
                      type: 'void',
                      title: `{{t("Duplicate", { ns: "${NAMESPACE}" })}}`,
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        openSize: 'small',
                      },
                      properties: {
                        modal: {
                          type: 'void',
                          title: `{{t("Duplicate to new workflow", { ns: "${NAMESPACE}" })}}`,
                          'x-decorator': 'FormV2',
                          'x-component': 'Action.Modal',
                          properties: {
                            title: {
                              type: 'string',
                              title: '{{t("Title")}}',
                              'x-decorator': 'FormItem',
                              'x-component': 'Input',
                            },
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Modal.Footer',
                              properties: {
                                submit: {
                                  type: 'void',
                                  title: '{{t("Submit")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    type: 'primary',
                                    useAction() {
                                      const { t } = useTranslation();
                                      const { refresh } = useResourceActionContext();
                                      const { resource, targetKey } = useResourceContext();
                                      const { setVisible } = useActionContext();
                                      const { [targetKey]: filterByTk } = useRecord();
                                      const { values } = useForm();
                                      return {
                                        async run() {
                                          await resource.revision({ filterByTk, values });
                                          message.success(t('Operation succeeded'));
                                          refresh();
                                          setVisible(false);
                                        },
                                      };
                                    },
                                  },
                                },
                                cancel: {
                                  type: 'void',
                                  title: '{{t("Cancel")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    useAction: '{{ cm.useCancelAction }}',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    delete: {
                      type: 'void',
                      title: '{{ t("Delete") }}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                        useAction: '{{ cm.useDestroyActionAndRefreshCM }}',
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

/* 
人员 [userId]
申请人主管 
{{$context.data.updatedBy.dept.supervisor.id}} 

*/
