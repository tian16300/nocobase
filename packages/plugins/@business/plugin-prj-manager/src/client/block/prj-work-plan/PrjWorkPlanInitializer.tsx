import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import {  SchemaInitializerItem, useCollection, useCollectionManager, useRecordCollectionDataSourceItems, useSchemaInitializer, useSchemaInitializerItem, useSchemaTemplateManager } from '@nocobase/client';
import { uid } from '@nocobase/utils';

export const PrjWorkPlanInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  const { getCollection } = useCollectionManager();
  const field = itemConfig.field;
  const collection = getCollection(field.target);
  const {name} = useCollection();
  const pCollection = name;
  const resource = `${field.collectionName}.${field.name}`;
  return (
    <SchemaInitializerItem
      {...others}
      icon={<FormOutlined />}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          insert(createPrjWorkPlanShema( {
            rowKey: collection.filterTargetKey,
            collection: field.target,
            resource,
            association: resource,
            pCollection
          }));
        }
      }}
      items={useRecordCollectionDataSourceItems('PrjWorkPlan', itemConfig, collection, resource)}
    />
  );
};

const createPrjWorkPlanShema = ({
  rowKey,
  collection,
  resource,
  association,
  pCollection
}) => {

  const groupsFields = ['prjStage', 'user'];
  const comp = 'PrjWorkPlan';
  const groups = {};
  groupsFields.forEach((key) => {
    groups[key] = {
      type: 'void',
      'x-component': 'Gantt.Event',
      'x-decorator': 'ACLActionProvider',
      'x-acl-action': 'update',
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Action.Drawer',
          'x-component-props': {
            className: 'nb-action-popup',
          },
          title: '{{ t("详情") }}',
          properties: {
            tabs: {
              type: 'void',
              'x-component': 'Tabs',
              'x-component-props': {},
              'x-initializer': 'TabPaneInitializers',
              properties: {
                tab1: {
                  type: 'void',
                  title: '{{t("Details")}}',
                  'x-component': 'Tabs.TabPane',
                  'x-designer': 'Tabs.Designer',
                  'x-component-props': {},
                  properties: {
                    grid: {
                      type: 'void',
                      'x-component': 'Grid',
                      'x-initializer': 'RecordBlockInitializers',
                      properties: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  });
  const decoratorProps = {
    collection: collection,
    resource: resource,
    action: 'list',
    association,
    fieldNames: {
      id: rowKey,
      title: 'title',
      start: 'start',
      range: 'week',
      end: 'end',
    },
    params: {
      appends: ['prjStage', 'user', 'dependencies'],
      paginate: false,
      sort: rowKey,
    },
    rightSize: 0.7,
    form: {
      group: {
        visible: true,
        options: ['prjStage', 'user', 'status'],
        default: 'prjStage',
      },
      sort: {
        visible: true,
        options: ['start', 'end', 'real_start', 'real_end', 'plan_days', 'real_days'],
        default: 'start',
      },
      range: {
        visible: true,
        options: ['day', 'week', 'month', 'quarterYear', 'year'],
        default: 'day',
      },
    },
  };

  return {
    type: 'void',
    'x-decorator': `${comp}.Decorator`,
    'x-decorator-props': decoratorProps,
    'x-component': `${comp}.Wrap`,
    'x-designer': `${comp}.Designer`,
    properties: {
      view: {
        type: 'void',
        'x-component': `Gantt`,
        'x-component-props': {
          height: 'calc(100vh - 52px - 40px - 24px * 2 - 10px - 24px * 2 - 52px - 44px - 46px - 16px)',
          useProps: '{{ useGanttBlockProps }}',
        },
        properties: {
          form: {
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  size: 'default',
                  layout: 'inline',
                  labelWidth: 60,
                  wrapperWidth: 120,
                },
                properties: {
                  group: {
                    type: 'string',
                    title: '分组',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      useProps: '{{useGanttFormGroupFieldProps}}',
                    },
                    default: decoratorProps.form.group?.default,
                    'x-visible': decoratorProps.form.group?.visible,
                  },
                  sort: {
                    type: 'string',
                    title: '排序',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      useProps: '{{useGanttFormSortFieldProps}}',
                    },
                    default: decoratorProps.form.sort?.default,
                    'x-visible': decoratorProps.form.sort?.visible,
                  },
                  range: {
                    type: 'string',
                    title: '时间范围',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      allowClear: false,
                      useProps: '{{useGanttFormRangeFieldProps}}',
                    },
                    'x-visible': decoratorProps.form.range?.visible,
                    default: decoratorProps.form.range?.default,
                  },
                },
              },
            },
          },
          toolBar: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 24,
              },
            },
            'x-initializer': 'GanttActionInitializers',
            properties: {
              [uid()]: {
                title: '{{ t("添加计划") }}',
                type: 'void',
                'x-action': 'customize:save',
                'x-component': 'Action',
                'x-designer': 'Action.Designer',
                'x-designer-props': {
                  modalTip:
                    '{{ t("When the button is clicked, the following fields will be assigned and saved together with the fields in the form. If there are overlapping fields, the value here will overwrite the value in the form.") }}',
                },
                'x-action-settings': {
                  assignedValues: {},
                  skipValidator: false,
                  onSuccess: {
                    manualClose: true,
                    redirecting: false,
                    successMessage: '{{t("Submitted successfully")}}',
                  },
                  triggerWorkflows: [],
                },
                'x-component-props': {
                  icon: 'calendaroutlined',
                  danger: false,
                  type: 'default',
                  useProps: '{{ useCreatePrjPlanActionProps }}',
                },
              },
              [uid()]: {
                title: '{{ t("保存为新版本") }}',
                type: 'void',
                'x-action': 'customize:save',
                'x-component': 'Action',
                'x-designer': 'Action.Designer',
                'x-designer-props': {
                  modalTip:
                    '{{ t("When the button is clicked, the following fields will be assigned and saved together with the fields in the form. If there are overlapping fields, the value here will overwrite the value in the form.") }}',
                },
                'x-action-settings': {
                  assignedValues: {},
                  skipValidator: false,
                  onSuccess: {
                    manualClose: true,
                    redirecting: false,
                    successMessage: '{{t("Submitted successfully")}}',
                  },
                  triggerWorkflows: [],
                },
                'x-component-props': {
                  danger: false,
                  type: 'primary',
                  useProps: '{{ useSaveOtherPrjPlanActionProps }}',
                }
              }
            },
          },
          table: {
            type: 'array',
            'x-component': `${comp}.Table`,
            'x-component-props': {
              rowKey: 'rowKey',
              rowSelection: {
                type: 'checkbox',
              },
              pagination: false,
              useProps: '{{usePrjWorkPlanTableBlockProps}}',
            },
          },
          detail: {
            type: 'void',
            'x-component': 'Gantt.Event',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'update',
            properties: {
              drawer: {
                type: 'void',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                title: '{{ t("详情") }}',
                properties: {
                  tabs: {
                    type: 'void',
                    'x-component': 'Tabs',
                    'x-component-props': {},
                    'x-initializer': 'TabPaneInitializers',
                    properties: {
                      tab1: {
                        type: 'void',
                        title: '{{t("Details")}}',
                        'x-component': 'Tabs.TabPane',
                        'x-designer': 'Tabs.Designer',
                        'x-component-props': {},
                        properties: {
                          grid: {
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'RecordBlockInitializers',
                            properties: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          createTask: {
            type: 'void',
            'x-component': 'Gantt.Event',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'create',
            properties: {
              drawer: {
                type: 'void',
                title: '{{ t("Add record") }}',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                properties: {
                  tabs: {
                    type: 'void',
                    'x-component': 'Tabs',
                    'x-component-props': {},
                    'x-initializer': 'TabPaneInitializersForCreateFormBlock',
                    properties: {
                      tab1: {
                        type: 'void',
                        title: '{{t("Add new")}}',
                        'x-component': 'Tabs.TabPane',
                        'x-designer': 'Tabs.Designer',
                        'x-component-props': {},
                        properties: {
                          grid: {
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'CreateFormBlockInitializers',
                            properties: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          ...groups,
        },
      },
    },
  };
};
