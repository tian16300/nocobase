import { ISchema } from '@formily/react';
import { uid } from "@nocobase/utils"

export const createDataSelectBlockSchema = (options) => {
    const {
      formItemInitializers = 'FormItemInitializers',
      actionInitializers = 'FormActionInitializers',
      collection,
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
                    // "width": "83.20"
                    width: '24',
                  },
                  properties: {
                    id: {
                      type: 'number',
                      title: '选择项目',
                      // 'x-designer': 'FormItem.Designer',
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
                }
                ,
                ['col_' + uid()]: {
                  type: 'void',
                  'x-component': 'Grid.Col',
                  'x-component-props': {
                    // "width": "83.20"
                    width: 100 - 48,
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
                      'x-designer': 'FormItem.Designer',
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
                        "ellipsis": true,
                        "tagColorField": "color",
                        "tagIconField": "icon",
                      },
                      'x-read-pretty':true
                    },
                  },
                }
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
      // 'x-initializer': 'TabPaneInitializers',
      // 'x-initializer-props': {
      //   gridInitializer: 'PrjRecordBlockInitializers',
      //   gridInitializerProps: {
      //     isBulkEdit: true,
      //   },
      // },
      properties: {
        ...createTabGrid('工时统计', {
          ['prjWorkStatic_' + uid()]: createPrjWorkStatic()
        })
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
                    form,
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
                    tabs
                  }
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
      ['tab_' + uid()]: {
        type: 'void',
        title: title,
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {},
        properties: {
          ['grid_' + uid()]: {
            type: 'void',
            'x-component': 'Grid',
            'properties': {
              ['row_' + uid()]: {
                type: 'void',
                'x-component': 'Grid.Row',
                properties: {
                  ['col_' + uid()]: {
                    type: 'void',
                    'x-component': 'Grid.Col',
                    properties: {
                      ...properties
                    },
                  },
                },
              }
            }
  
          },
        },
      },
  
    }
  
  };
export const createPrjWorkStatic = () => {
    return {
        type: 'void',
        'x-decorator': 'PrjWorkStatic.Decorator',
        'x-component': 'PrjWorkStatic.Wrap',
        'x-designer': 'PrjWorkStatic.Designer',
        'properties': {
            ['form_' + uid()]: {
                type: 'void',
                'x-component': 'PrjWorkStatic.Form',
                'x-component-props': {
                    'useProps': '{{ usePrjWorkStaticForm}}'
                }
            },
            ['view_' + uid()]: {
                type: 'void',
                'x-component': 'PrjWorkStatic.View'
            }
        }
    }
}