import { ISchema } from '@formily/react';
import { css } from '@nocobase/client';
import { uid } from '@nocobase/utils';

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
                      mode: 'Tag',
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
    // 'x-initializer': 'PrjRecordBlockInitializers',
    // 'x-initializer-props': {
    //   isBulkEdit: true,
    // },
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
      gridInitializer: 'PrjRecordBlockInitializers',
      gridInitializerProps: {
        isBulkEdit: true,
      },
    },
    properties: {
      tab1: createTabGrid('项目计划', {
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
      form: {
        type: 'void',
        'x-component': `${comp}.Form`,
        'x-component-props': {
          useProps: `{{ use${comp}Form}}`,
        },
      },
      view: {
        type: 'void',
        'x-component': `${comp}.View`,
      },
    },
  };
};

export const createPrjWorkPlanGanttBlockSchema = (options) => {
  const { collection, resource, fieldNames, appends, ...others } = options;
  const schema: ISchema = {
    type: 'void',
    'x-component': 'Gantt',
    'x-component-props': {
      useProps: '{{ useGanttBlockProps }}',
    },
    properties: {
      toolBar: {
        type: 'void',
        'x-component': 'ActionBar',
        'x-component-props': {
          style: {
            marginBottom: 24,
          },
        },
        'x-initializer': 'GanttActionInitializers',
        properties: {},
      },
      table: {
        type: 'array',
        'x-decorator': 'div',
        'x-decorator-props': {
          style: {
            float: 'left',
            maxWidth: '35%',
          },
        },
        'x-initializer': 'TableColumnInitializers',
        'x-component': 'TableV2',
        'x-component-props': {
          rowKey: 'id',
          rowSelection: {
            type: 'checkbox',
          },
          useProps: '{{ useTableBlockProps }}',
          pagination: false,
        },
        properties: {
          actions: {
            type: 'void',
            title: '{{ t("Actions") }}',
            'x-action-column': 'actions',
            'x-decorator': 'TableV2.Column.ActionBar',
            'x-component': 'TableV2.Column',
            'x-designer': 'TableV2.ActionColumnDesigner',
            'x-initializer': 'TableActionColumnInitializers',
            properties: {
              actions: {
                type: 'void',
                'x-decorator': 'DndContext',
                'x-component': 'Space',
                'x-component-props': {
                  split: '',
                },
                properties: {},
              },
            },
          },
        },
      },
      detail: {
        type: 'void',
        'x-component': 'Gantt.Event',
        properties: {
          drawer: {
            type: 'void',
            'x-component': 'Action.Drawer',
            'x-component-props': {
              className: 'nb-action-popup',
            },
            title: '{{ t("View record") }}',
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
    },
  };
  return schema;
};
export const createPrjWorkPlanShema = () => {
  const comp = 'PrjWorkPlan';
  // return {
  //   type: 'void',
  //   'x-decorator': `${comp}.Decorator`,
  //   'x-decorator-props': {
  //     collection: 'prj_plan',
  //     resource: 'prj_plan',
  //     action: 'list',
  //     fieldNames: {
  //       id: 'id',
  //       start: 'start',
  //       range: 'day',
  //       title: 'stage',
  //       end: 'end',
  //     },
  //     params: '{{useWorkPlanGanttParams}}',
  //   },
  //   'x-component': `${comp}.Wrap`,
  //   'x-designer': `${comp}.Designer`,
  //   properties: {
  //     [uid()]: {
  //       type: 'void',
  //       'x-component': `${comp}.Form`,
  //       'x-component-props': {
  //         useProps: `{{ use${comp}Form}}`,
  //       },
  //     },
  //     [uid()]: {
  //       type: 'void',
  //       'x-component': `div`,
  //       'x-component-props': {
  //         className: css`
  //           height: 880px;
  //         `,
  //       },
  //       properties: {
  //         [uid()]: createPrjWorkPlanGanttBlockSchema({}),
  //       },
  //     },
  //   },
  // };
  return {
    type: 'void',
    'x-decorator': `${comp}.Decorator`,
    'x-component': `${comp}.Wrap`,
    'x-designer': `${comp}.Designer`,
    properties: {
      form: {
        type: 'void',
        'x-component': `${comp}.Form`,
        'x-component-props': {
          useProps: `{{ use${comp}Form}}`,
        },
      },
      view: {
        type: 'void',
        'x-component': `${comp}.View`,
        properties: {
          toolBar: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 24,
              },
            },
            'x-initializer': 'GanttActionInitializers',
          },
          table: {
            type: 'array',
            // 'x-decorator': 'div',
            'x-initializer': 'StageColumnInitializers',
            'x-component': `TableV2`,
            'x-component-props': {
              rowKey: 'id',
              rowSelection: {
                type: 'checkbox',
              },
              useProps: '{{ useStageTableBlockProps }}',
              pagination: false,
            },
            properties: {
              actions: {
                type: 'void',
                title: '{{ t("Actions") }}',
                'x-action-column': 'actions',
                'x-decorator': 'TableV2.Column.ActionBar',
                'x-component': 'TableV2.Column',
                'x-designer': 'TableV2.ActionColumnDesigner',
                'x-initializer': 'TableActionColumnInitializers',
                properties: {
                  actions: {
                    type: 'void',
                    'x-decorator': 'DndContext',
                    'x-component': 'Space',
                    'x-component-props': {
                      split: '',
                    },
                  },
                },
              }
            }
          }, 
          // expandTable: {
          //   type: 'array',
          //   'x-decorator': 'div',
          //   'x-initializer': 'TaskColumnInitializers',
          //   'x-component': `TableV2`,
          //   'x-component-props': {
          //     rowKey: 'id',
          //     rowSelection: {
          //       type: 'checkbox',
          //     },
          //     useProps: '{{ useTaskTableBlockProps }}',
          //     pagination: false,
          //   },
          //   properties: {
          //     actions: {
          //       type: 'void',
          //       title: '{{ t("Actions") }}',
          //       'x-action-column': 'actions',
          //       'x-decorator': 'TableV2.Column.ActionBar',
          //       'x-component': 'TableV2.Column',
          //       'x-designer': 'TableV2.ActionColumnDesigner',
          //       'x-initializer': 'TableActionColumnInitializers',
          //       properties: {
          //         actions: {
          //           type: 'void',
          //           'x-decorator': 'DndContext',
          //           'x-component': 'Space',
          //           'x-component-props': {
          //             split: '',
          //           },
          //         },
          //       },
          //     },
          //   }
          // },        
          detail: {
            type: 'void',
            'x-component': 'Gantt.Event',
            properties: {
              drawer: {
                type: 'void',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                title: '{{ t("View record") }}',
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
  return createBaseComp(comp);
};
export const createPrjWorkStaticShema = () => {
  return createBaseComp('PrjWorkStatic');
};
