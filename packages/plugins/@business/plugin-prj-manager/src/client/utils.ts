import { ISchema } from '@formily/react';
import { uid } from '@nocobase/utils';
import React from 'react';
import { Divider } from 'antd';
export const createDataSelectBlockSchema = (options) => {
  const {
    formItemInitializers = 'FormItemInitializers',
    actionInitializers = 'FormActionInitializers',
    collection = 'prj',
    resource,
    action = 'list',
    template,
    params,
    association,
    ...others
  } = options;
  const resourceName = resource || association || collection;
  const form: ISchema = {
    type: 'void',
    'x-component': 'FormV2',
    'x-component-props': {
      useProps: '{{ useFormSelectBlockProps }}',
    },
    properties: {
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {
                  width: 36,
                },
                properties: {
                  id: {
                    type: 'number',
                    title: '选择项目',
                    'x-component': 'RemoteSelect',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      multiple: false,
                      service: {
                        resource: resourceName,
                        action,
                        params,
                      },
                      fieldNames: {
                        label: 'title',
                        value: 'id',
                      },
                      useProps: '{{ useFormSelectOptionsProps }}',
                    },
                  },
                },
              },
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {
                  width: 100 - 36 - 24,
                },
              },
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {
                  width: '24',
                },
                properties: {
                  status: {
                    type: 'string',
                    name: 'status',
                    'x-component': 'CollectionField',
                    'x-decorator': 'FormItem',
                    'x-collection-field': 'prj.status',
                    'x-component-props': {
                      service: {
                        params: {
                          filter: {
                            $and: [
                              {
                                dicCode: {
                                  $eq: 'prj_status',
                                },
                              },
                            ],
                          },
                        },
                      },
                      multiple: false,
                      enableLink: false,
                      fieldNames: {
                        label: 'label',
                        value: 'id',
                        icon: 'icon',
                        color: 'color',
                      },
                      mode: 'Select',
                      ellipsis: true,
                      tagColorField: 'color',
                      tagIconField: 'icon',
                    },
                    'x-read-pretty': true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const grid = {
    type: 'void',
    'x-component': 'Grid',
  };

  const tabs: ISchema = {
    type: 'void',
    'x-component': 'Tabs',
    'x-component-props': {
      //  'size':'large',
      //  'type':'card'
      useProps: '{{ usePrjTabsProps }}'
    },
    'x-initializer': 'TabPaneInitializers',
    'x-initializer-props': {
      gridInitializer: 'PrjRecordBlockInitializers',
      gridInitializerProps: {
        isBulkEdit: true,
      },
    },
    properties: {
      tab1: createTabGrid('任务管理', {
        ['prjWorkPlan_' + uid()]: createPrjWorkPlanShema(),
      }),
      // tab2: createTabGrid('项目任务', {
      //   ['prjWorkPlan_' + uid()]: createPrjWorkPlanShema(),
      // }),
      tab2: createTabGrid('工时统计', {
        ['prjWorkStatic_' + uid()]: createPrjWorkStaticShema(),
      }),
      // ...createTabGrid('项目概览', {}),
      // tab1: {
      //   type: 'void',
      //   title: '项目概览',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab2: {
      //   type: 'void',
      //   title: '项目成员',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab3: {
      //   type: 'void',
      //   title: '项目计划',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // // tab4: {
      // //   type: 'void',
      // //   title: '项目汇总',
      // //   'x-component': 'Tabs.TabPane',
      // //   'x-designer': 'Tabs.Designer',
      // //   'x-component-props': {
      // //   },
      // //   properties: {
      // //     grid: {
      // //       type: 'void',
      // //       'x-component': 'Grid',
      // //       'x-initializer': 'RecordBlockInitializers',
      // //       'x-initializer-props': {
      // //         "isBulkEdit": true,
      // //         'useHookItems': '{{ useRecordBlockInitializerItems }}'
      // //       },
      // //       properties: {},
      // //     },
      // //   },
      // // },
      // tab4: {
      //   type: 'void',
      //   title: '工时统计',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab5: {
      //   type: 'void',
      //   title: '数据报表',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab6: {
      //   type: 'void',
      //   title: '项目文件',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
    },
  };
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:view`,
    'x-decorator': 'DataSelect.Decorator',
    'x-decorator-props': {
      ...others,
      resource: resourceName,
      collection,
      association,
      action: 'list',
      params: {
        pageSize: 1,
        appends: ['status'],
      },
    },
    'x-designer': 'DataSelect.Designer',
    'x-component': 'CardItem',
    'x-component-props': {
      span: 3,
    },
    // 保存当前筛选区块所能过滤的数据区块
    'x-filter-targets': [],
    // 用于存储用户设置的每个字段的运算符，目前仅筛选表单区块支持自定义
    'x-filter-operators': {},
    properties: {
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {
                  // "width": "83.20"
                },
                properties: {
                  ['form_' + uid()]: form,
                },
              },
            },
          },
        },
      },
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {},
                properties: {
                  ['tabs_' + uid()]: tabs,
                },
              },
            },
          },
        },
      },
    },
  };
  return schema;
};
export const createTabGrid = (title, properties) => {
  return {
    type: 'void',
    title: title,
    'x-component': 'Tabs.TabPane',
    'x-designer': 'Tabs.Designer',
    'x-component-props': {},
    properties: {
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  ...properties,
                },
              },
            },
          },
        },
      },
    },
  };
};

export const createBaseComp = (comp) => {
  return {
    type: 'void',
    'x-decorator': `${comp}.Decorator`,
    'x-component': `${comp}.Wrap`,
    'x-designer': `${comp}.Designer`,
    properties: {
      // form: {
      //   type: 'void',
      //   'x-component': `${comp}.Form`,
      //   'x-component-props': {
      //     useProps: `{{ use${comp}Form}}`,
      //   },
      // },
      view: {
        type: 'void',
        'x-component': `${comp}.View`,
      },
    },
  };
};

export const createPrjWorkPlanShema = () => {
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
    collection: 'task',
    resource: 'task',
    action: 'list',
    fieldNames: {
      id: 'id',
      title: 'title',
      start: 'start',
      range: 'week',
      end: 'end',
    },
    params: {
      appends: ['prjStage', 'user', 'dependencies'],
      paginate: false,
      sort: 'id',
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
  return createBaseComp(comp);
};
export const createPrjWorkStaticShema = () => {
  return createBaseComp('PrjWorkStatic');
};

export const createPrjPlanCompare = () => {
  const Comp = 'PrjPlanCompare';
  const fields = {
    range: [
      { label: '{{t("Day")}}', value: 'day', color: 'yellow' },
      { label: '{{t("Week")}}', value: 'week', color: 'pule' },
      { label: '{{t("Month")}}', value: 'month', color: 'green' },
      { label: '{{t("QuarterYear")}}', value: 'quarterYear', color: 'red' },
      { label: '{{t("Year")}}', value: 'year', color: 'green' },
    ],
  };
  const schema = {
    type: 'void',
    'x-decorator': `${Comp}.Decorator`,
    'x-decorator-props': {
      collection: 'prj_plan_history',
      resource: 'prj_plan_history',
      action: 'list',
      fieldNames: {
        id: 'id',
        title: 'title',
        start: 'start',
        range: 'week',
        end: 'end',
      },
      params: {
        // appends: ['prjStage', 'user', 'dependencies'],
        paginate: false,
        sort: 'id',
      },
      rightSize: 0.9,
      // group: 'prjStage',
      form:{
        group:{
          visible:false
        },
        range:{
          visible:true,
          options:['day','week','month','quarterYear','year'],
          default:'week'

        },
        sort:{
          visible:false,
          default:'id'
        }
      }

    },
    'x-component': `${Comp}.Wrap`,
    'x-designer': `${Comp}.Designer`,
    properties: {
      view: {
        type: 'void',
        'x-component': `Gantt`,
        'x-component-props': {
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
                  labelWidth: 100,
                  wrapperWidth: 160,
                },
                properties: {
                  prj: {
                    type: 'number',
                    title: '选择项目',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'RemoteSelect',
                    'x-component-props': {
                      useProps: `{{use${Comp}OptionsProps}}`,
                    },
                  },
                  range: {
                    type: 'string',
                    title: '时间范围',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      allowClear: false,
                    },
                    enum: fields.range,
                    default: 'week',
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
              version: {
                type: 'number',
                title: '当前版本',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  useProps: `{{use${Comp}OptionsProps}}`,
                },
              },
              compVersion: {
                type: 'number',
                title: '对比版本',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  useProps: `{{use${Comp}OptionsProps}}`,
                },
              },
            },
          },
          table: {
            type: 'array',
            'x-component': `${Comp}.Table`,
            'x-component-props': {
              rowKey: 'rowKey',
              rowSelection: {
                type: 'checkbox',
              },
              pagination: false,
              useProps: `{{use${Comp}TableBlockProps}}`,
            },
          },
          latest: {
            type: 'void',
            'x-component': 'Gantt.Event',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'update',
            title: '最新版本',
            properties: {
              drawer: {
                type: 'void',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
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
          compVersion: {
            type: 'void',
            'x-component': 'Gantt.Event',
            'x-decorator': 'ACLActionProvider',
            title: '历史版本',
            'x-acl-action': 'update',
            properties: {
              drawer: {
                type: 'void',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
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

  return schema;
};



export const createDataItemSelectBlockSchema = (options)=>{
  const {
    formItemInitializers = 'FormItemInitializers',
    actionInitializers = 'FormActionInitializers',
    collection = 'prj',
    resource,
    action = 'list',
    template,
    params,
    association,
    ...others
  } = options;
  const _resource = resource || association || collection;
  const resourceName = _resource.name;
  const form: ISchema = {
    type: 'void',
    'x-component': 'FormV2',
    'x-component-props': {
      useProps: '{{ useDataItemSelectFormSelectBlockProps }}',
    },
    properties: {
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                'x-component-props': {
                  width: 36,
                },
                properties: {
                  id: {
                    type: 'number',
                    title: '选择',
                    'x-component': 'RemoteSelect',
                    'x-decorator': 'FormItem',
                    'x-designer':'DataItemSelect.ItemDesinger',
                    'x-component-props': {
                      multiple: false,
                      service: {
                        resource: resourceName,
                        action,
                        params,
                      },
                      fieldNames: {
                        label: 'title',
                        value: 'id',
                      },
                      useProps: '{{ useDataItemSelectFormSelectOptionsProps }}',
                    },
                  },
                },
              },
            },
          },
        },
      },
      [uid()]:{
        type: 'void',
        'x-component': 'Divider',
        'x-designer':'Divider.Designer'
      }
    },
  };
  const grid = {
    type: 'void',
    'x-component': 'Grid',
  };

  const tabs: ISchema = {
    type: 'void',
    'x-component': 'Tabs',
    'x-component-props': {
      //  'size':'large',
      //  'type':'card'
    },
    'x-initializer': 'TabPaneInitializers',
    'x-initializer-props': {
      gridInitializer: 'RecordFormBlockInitializer',
      gridInitializerProps: {
        isBulkEdit: true,
      },
    },
    properties: {
      tab1: createTabGrid('任务管理', {
        ['prjWorkPlan_' + uid()]: createPrjWorkPlanShema(),
      }),
      // tab2: createTabGrid('项目任务', {
      //   ['prjWorkPlan_' + uid()]: createPrjWorkPlanShema(),
      // }),
      tab2: createTabGrid('工时统计', {
        ['prjWorkStatic_' + uid()]: createPrjWorkStaticShema(),
      }),
      // ...createTabGrid('项目概览', {}),
      // tab1: {
      //   type: 'void',
      //   title: '项目概览',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab2: {
      //   type: 'void',
      //   title: '项目成员',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab3: {
      //   type: 'void',
      //   title: '项目计划',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // // tab4: {
      // //   type: 'void',
      // //   title: '项目汇总',
      // //   'x-component': 'Tabs.TabPane',
      // //   'x-designer': 'Tabs.Designer',
      // //   'x-component-props': {
      // //   },
      // //   properties: {
      // //     grid: {
      // //       type: 'void',
      // //       'x-component': 'Grid',
      // //       'x-initializer': 'RecordBlockInitializers',
      // //       'x-initializer-props': {
      // //         "isBulkEdit": true,
      // //         'useHookItems': '{{ useRecordBlockInitializerItems }}'
      // //       },
      // //       properties: {},
      // //     },
      // //   },
      // // },
      // tab4: {
      //   type: 'void',
      //   title: '工时统计',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab5: {
      //   type: 'void',
      //   title: '数据报表',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
      // tab6: {
      //   type: 'void',
      //   title: '项目文件',
      //   'x-component': 'Tabs.TabPane',
      //   'x-designer': 'Tabs.Designer',
      //   'x-component-props': {},
      //   properties: {
      //     grid: {
      //       ...grid,
      //     },
      //   },
      // },
    },
  };
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:view`,
    'x-decorator': 'DataItemSelect.Decorator',
    'x-decorator-props': {
      ...others,
      resource: resourceName,
      collection,
      association,
      action: 'list',
      params: {
        pageSize: 1,
        appends: ['status'],
      },
    },
    'x-designer': 'DataItemSelect.Designer',
    'x-component': 'CardItem',
    'x-component-props': {
      span: 3,
    },
    // 保存当前筛选区块所能过滤的数据区块
    'x-filter-targets': [],
    // 用于存储用户设置的每个字段的运算符，目前仅筛选表单区块支持自定义
    'x-filter-operators': {},
    properties: {
      ['grid_' + uid()]: {
        type: 'void',
        'x-component': 'Grid',
        properties: {
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  ['form_' + uid()]: form,
                },
              },
            },
          },
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  ['prj_detail_'+uid()]:{
                    type: 'void',
                    'x-decorator':'BomPrjCost.Decorator',
                    'x-component':'BomPrjCost',
                    'x-deisgner':'BomPrjCost.Designer'
                  }
                }
              },
            },
          },
          ['row_' + uid()]: {
            type: 'void',
            'x-component': 'Grid.Row',
            properties: {
              ['col_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Col',
                properties: {
                  ['prj_detail_'+uid()]:{
                    type: 'void',
                    'x-decorator':'PrjBomTree.Decorator',
                    'x-component':'PrjBomTree',
                    'x-deisgner':'PrjBomTree.Designer'
                  }
                }
              },
            },
          }
        },
      }
    },
  };
  return schema;

}