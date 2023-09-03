import { ISchema } from '@formily/react';
import { TableOutlined } from '@ant-design/icons';
import {
  DataBlockInitializer,
} from '@nocobase/client';
import React from 'react';
import { uid } from '@nocobase/utils';

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
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: [4, 6, 10],
        },
        'properties': {
          id: {
            type: 'number',
            title: '选择项目',
            "x-designer": "FormItem.Designer",
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
                value: 'id'
              },
              useProps: '{{ useFormSelectOptionsProps }}',
            },
          },
          status: {
            "type": "string",
            "name": "status",
            "x-designer": "FormItem.Designer",
            "x-component": "CollectionField",
            "x-decorator": "FormItem",
            "x-collection-field": "prj.status",
            "x-component-props": {
              "service": {
                "params": {
                  "filter": {
                    "$and": [
                      {
                        "dicCode": {
                          "$eq": "prj_status"
                        }
                      }
                    ]
                  }
                }
              },
              "multiple": false,
              "fieldNames": {
                "label": "label",
                "value": "id",
                "icon": "icon",
                "color": "color"
              },
              "mode": "Picker",
              "openSize": "small"
            },
            "properties": {
              [uid()]: {
                "type": "void",
                "x-component": "AssociationField.Selector",
                "title": "选择状态",
                "x-component-props": {
                  "className": "nb-record-picker-selector"
                },
                "x-index": 1,
                "properties": {
                  "grid": {
                    "type": "void",
                    "x-component": "Grid",
                    "x-initializer": "TableSelectorInitializers",
                    "properties": {
                      [`r_${uid()}`]: {
                        "type": "void",
                        "x-component": "Grid.Row",
                        "properties": {
                          [`c_${uid()}`]: {
                            "type": "void",
                            "x-component": "Grid.Col",
                            "properties": {
                              [uid()]: {
                                "type": "void",
                                "x-acl-action": "dicItem:list",
                                "x-decorator": "TableSelectorProvider",
                                "x-decorator-props": {
                                  "collection": "dicItem",
                                  "resource": "dicItem",
                                  "action": "list",
                                  "params": {
                                    "pageSize": 20,
                                    "filter": {
                                      "$and": [
                                        {
                                          "dic": {
                                            "code": {
                                              "$eq": "prj_status"
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  }
                                },
                                "x-designer": "TableSelectorDesigner",
                                "x-component": "BlockItem",
                                "properties": {
                                  "actions": {
                                    "type": "void",
                                    "x-initializer": "TableActionInitializers",
                                    "x-component": "ActionBar",
                                    "x-component-props": {
                                      "style": {
                                        "marginBottom": "var(--nb-spacing)"
                                      }
                                    },
                                    "properties": {
                                      [uid()]: {
                                        "title": "{{ t(\"Refresh\") }}",
                                        "x-action": "refresh",
                                        "x-component": "Action",
                                        "x-designer": "Action.Designer",
                                        "x-component-props": {
                                          "icon": "ReloadOutlined",
                                          "useProps": "{{ useRefreshActionProps }}"
                                        },
                                        "x-align": "right",
                                        "type": "void",
                                        "x-async": false,
                                        "x-index": 1
                                      }
                                    }
                                  },
                                  "value": {
                                    "type": "array",
                                    "x-initializer": "TableColumnInitializers",
                                    "x-component": "TableV2.Selector",
                                    "x-component-props": {
                                      "rowSelection": {
                                        "type": "checkbox"
                                      },
                                      "useProps": "{{ useTableSelectorProps }}"
                                    },
                                    "properties": {
                                      [uid()]: {
                                        "type": "void",
                                        "x-decorator": "TableV2.Column.Decorator",
                                        "x-designer": "TableV2.Column.Designer",
                                        "x-component": "TableV2.Column",
                                        "properties": {
                                          "label": {
                                            "x-collection-field": "dicItem.label",
                                            "x-component": "CollectionField",
                                            "x-component-props": {
                                              "ellipsis": true
                                            },
                                            "x-read-pretty": true,
                                            "x-decorator": null,
                                            "x-decorator-props": {
                                              "labelStyle": {
                                                "display": "none"
                                              }
                                            }
                                          }
                                        }
                                      },
                                      [uid()]: {
                                        "type": "void",
                                        "x-decorator": "TableV2.Column.Decorator",
                                        "x-designer": "TableV2.Column.Designer",
                                        "x-component": "TableV2.Column",
                                        "properties": {
                                          "value": {
                                            "x-collection-field": "dicItem.value",
                                            "x-component": "CollectionField",
                                            "x-component-props": {
                                              "ellipsis": true
                                            },
                                            "x-read-pretty": true,
                                            "x-decorator": null,
                                            "x-decorator-props": {
                                              "labelStyle": {
                                                "display": "none"
                                              }
                                            }
                                          }
                                        }
                                      },
                                      [uid()]: {
                                        "type": "void",
                                        "x-decorator": "TableV2.Column.Decorator",
                                        "x-designer": "TableV2.Column.Designer",
                                        "x-component": "TableV2.Column",
                                        "properties": {
                                          "dic": {
                                            "x-collection-field": "dicItem.dic",
                                            "x-component": "CollectionField",
                                            "x-component-props": {
                                              "ellipsis": true,
                                              "size": "small",
                                              "mode": "Tag",
                                              "enableLink": false
                                            },
                                            "x-read-pretty": true,
                                            "x-decorator": null,
                                            "x-decorator-props": {
                                              "labelStyle": {
                                                "display": "none"
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "footer": {
                    "x-component": "Action.Container.Footer",
                    "x-component-props": {},
                    "properties": {
                      "actions": {
                        "type": "void",
                        "x-component": "ActionBar",
                        "x-component-props": {},
                        "properties": {
                          "submit": {
                            "title": "提交",
                            "x-action": "submit",
                            "x-component": "Action",
                            "x-designer": "Action.Designer",
                            "x-component-props": {
                              "type": "primary",
                              "htmlType": "submit",
                              "useProps": "{{ usePickActionProps }}",
                              "danger": false
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              [uid()]: {
                "type": "void",
                "x-component": "AssociationField.Nester",
                "x-index": 2,
                "properties": {
                  "grid": {
                    "type": "void",
                    "x-component": "Grid",
                    "x-initializer": "FormItemInitializers",
                    "properties": {
                      [uid()]: {
                        "type": "void",
                        "x-component": "Grid.Row",
                        "properties": {
                          [uid()]: {
                            "type": "void",
                            "x-component": "Grid.Col",
                            "properties": {
                              "dic.items": {
                                "type": "string",
                                "x-designer": "FormItem.Designer",
                                "x-component": "CollectionField",
                                "x-read-pretty": true,
                                "x-component-props": {
                                  "pattern-disable": true,
                                  "enableLink": false,
                                  "mode": "Tag"
                                },
                                "x-decorator": "FormItem",
                                "x-collection-field": "dicItem.dic.items",
                                "x-async": false,
                                "x-index": 1
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      }
    }
  };
  const tabs: ISchema = {
    type: 'void',
    'x-component': 'Tabs',
    'x-component-props': {},
    'x-initializer': 'TabPaneInitializers',
    properties: {
      tab1: {
        type: 'void',
        title: '项目概览',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'RecordBlockInitializers',
            'x-initializer-props': {
              "isBulkEdit": true
            },
            properties: {},
          },
        },
      },
      tab2: {
        type: 'void',
        title: '任务管理',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'RecordBlockInitializers',
            'x-initializer-props': {
              "isBulkEdit": true
            },
            properties: {},
          },
        },
      },
      tab3: {
        type: 'void',
        title: '甘特图',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'RecordBlockInitializers',
            'x-initializer-props': {
              "isBulkEdit": true
            },
            properties: {},
          },
        },
      },
      tab4: {
        type: 'void',
        title: '工时统计',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
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
      tab5: {
        type: 'void',
        title: '数据报表',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
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
      tab6: {
        type: 'void',
        title: '项目文件',
        'x-component': 'Tabs.TabPane',
        'x-designer': 'Tabs.Designer',
        'x-component-props': {
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
  }
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:view`,
    'x-decorator': 'DataSelectFieldProvider',
    'x-decorator-props': {
      ...others,
      resource: resourceName,
      collection,
      association,
      action: 'list',
      params: {
        pageSize: 1,
        appends:['status']
      },
    },
    'x-designer': 'DataSelectDesigner',
    'x-component': 'CardItem',
    'x-component-props': {
      'span': 3
    },
    // 保存当前筛选区块所能过滤的数据区块
    'x-filter-targets': [],
    // 用于存储用户设置的每个字段的运算符，目前仅筛选表单区块支持自定义
    'x-filter-operators': {},
    properties: {
      ['grid_' + uid()]: {
        "type": "void",
        "x-component": "Grid",
        "properties": {
          ['row_' + uid()]: {
            "type": "void",
            "x-component": "Grid.Row",
            "properties": {
              ['col_' + uid()]: {
                "type": "void",
                "x-component": "Grid.Col",
                "x-component-props": {
                  // "width": "83.20"
                },
                "properties": {
                  form
                }
              }
            }

          }
        }

      },
      ['grid_' + uid()]: {
        "type": "void",
        "x-component": "Grid",
        "properties": {
          ['row_' + uid()]: {
            "type": "void",
            "x-component": "Grid.Row",
            "properties": {
              ['col_' + uid()]: {
                "type": "void",
                "x-component": "Grid.Col",
                "x-component-props": {
                },
                "properties": {
                  tabs
                }
              }
            }

          }
        }

      }
    },
  };
  return schema;
};
export const DataSelectBlockInitializer = (props) => {
  return (
    <DataBlockInitializer
      {...props}
      icon={<TableOutlined />}
      componentType={'DataSelect'}
      templateWrap={(templateSchema, { item }) => {
        const s = createDataSelectBlockSchema({
          template: templateSchema,
          collection: item.name,
        });
        if (item.template && item.mode === 'reference') {
          s['x-template-key'] = item.template.key;
        }
        return s;
      }}
      createBlockSchema={createDataSelectBlockSchema}
    />
  );
};
