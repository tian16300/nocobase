import { useTranslation } from 'react-i18next';
import { useCollectionManager } from '../../../collection-manager';
import { useContext } from 'react';
import { SchemaOptionsContext } from '@formily/react';
import { useGlobalTheme } from '../../../global-theme';
import { DataBlockInitializer } from '../../../schema-initializer';
import React from 'react';
import { TableOutlined } from '@ant-design/icons';
import { SchemaComponent, SchemaComponentOptions } from '../../core';
import { ArrayItems, FormLayout } from '@formily/antd-v5';
import { FormDialog } from '..';
import { uid } from '@formily/shared';
import { css } from '@emotion/css';

export const createGroupTableSchema = (decoratorProps) => {
  const { collection, group,
    resource,
    rowKey,
    tableActionInitializers,
    tableColumnInitializers,
    tableActionColumnInitializers,
    tableBlockProvider,
    disableTemplate,
    TableBlockDesigner,
    blockType,
    pageSize = 20,
    groupCollection,
    ...others
  } = decoratorProps;
  return {
    type: 'void',
    'x-acl-action': `${collection}:list`,
    'x-decorator': 'GroupTable.Decorator',
    'x-decorator-props': {
      ...decoratorProps,
    },
    'x-designer': 'GroupTable.Designer',
    'x-component': 'GroupTable.Wrap',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'GroupTable',
        'x-component-props': {
          useProps: '{{ useGroupTableProps }}',
        },
        properties: {
          group: {
            type: 'string',
            'x-component': 'GroupTable.GroupTree',
            'x-decorator':'TableBlockProvider',
            'x-decorator-props': {
              collection:`${groupCollection}`,
              resource: `${groupCollection}`,
              action: 'list',
              params: {
                paginate: false
              }
            },
            'x-designer':'GroupTable.GroupTreeDesigner',
            'x-collection-field': `${collection}.${group}`,
            properties: {
              actions: {
                type: 'void',
                'x-initializer': 'GroupTableGroupActionInitializers',
                'x-component': 'ActionBar',
                'x-component-props': {
                  spaceProps: {
                    gap: 4,
                  },
                },
                properties: {},
              },
              recordActions: {
                type: 'void',
                title: '{{ t("Actions") }}',
                'x-decorator': 'GroupTable.GroupRecordActionBar',
                'x-component': 'ActionBar',
                'x-designer': 'GroupTable.GroupRecordActionDesigner',
                'x-initializer': 'GroupTableGroupRecordActionInitializers',
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
            "x-filter-targets": []
          },
          table:{
            type:'void',
            'x-decorator': 'TableBlockProvider',
            'x-acl-action': `${resource || collection}:list`,
            'x-decorator-props': {
              collection,
              resource: resource || collection,
              action: 'list',
              params: {
                pageSize
              },
              rowKey,
              showIndex: true,
              dragSort: false,
              disableTemplate: disableTemplate ?? false,
              blockType,
              ...others
            },
            'x-designer': TableBlockDesigner ?? 'TableBlockDesigner',
            'x-component': 'CardItem',
            properties:{
              actions: {
                type: 'void',
                'x-initializer': tableActionInitializers ?? 'TableActionInitializers',
                'x-component': 'ActionBar',
                'x-component-props': {
                  style: {
                    marginBottom: 'var(--nb-spacing)',
                  },
                },
                properties: {},
              },
              [uid()]: {
                type: 'array',
                'x-initializer': 'TableColumnInitializers',
                'x-component': 'TableV2',
                'x-component-props': {
                  rowKey: 'id',
                  rowSelection: {
                    type: 'checkbox',
                  },
                  useProps: '{{ useGroupTableBlockProps }}',
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


            },
            'x-reactions': [{
              dependencies: ['.group'],
              fulfill: {
                schema: {
                  [`x-decorator-props.params.filter.${group}.id`]: '{{ $deps[0] }}'
                }
              },
            }]
          },
         
        },
      },
    },
  };
};

export const Initializer = (props) => {
  const { insert } = props;
  const { t } = useTranslation();
  const { getCollectionFields, getCollectionField } = useCollectionManager();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  return (
    <DataBlockInitializer
      {...props}
      componentType={'GroupTable'}
      icon={<TableOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const name = item.name;
        const fields = getCollectionFields(name);

        const groupFields = fields
          .filter((field) => {
            return 'm2o' == field.interface;
          })
          .map((field) => {
            return {
              label: t(field?.uiSchema?.title),
              value: field.name,
            };
          });
        const fieldItems = fields.map((field, index) => {
          return {
            sort: index,
            title: t(field?.uiSchema?.title),
            name: field.name,
            visible: false,
          };
        });
        const columnActions = {
          visible: true,
          align: 'right',
        };
        const pagination = {
          position: 'bottomRight',
          showQuickJumper: true,
          pageSize: 10,
        };
        const values = await FormDialog(
          t('创建分组表格区块'),
          () => {
            return (
              <SchemaComponentOptions scope={options.scope} components={{ ...options.components, ArrayItems }}>
                <FormLayout
                  layout={'vertical'}
                  className={css`
                    .columnActions-item,
                    .fields-array-items {
                      .ant-formily-item-feedback-layout-loose {
                        margin-bottom: 8px;
                      }
                    }
                    .fields-array-items {
                      > .ant-formily-item-control {
                        max-height: 600px;
                        overflow: auto;
                      }
                    }
                  `}
                >
                  <SchemaComponent
                    schema={{
                      properties: {
                        group: {
                          title: '分组字段',
                          enum: groupFields,
                          required: true,
                          'x-component': 'Select',
                          'x-decorator': 'FormItem',
                        },
                        // fields: {
                        //   title: '显示字段',
                        //   type: 'array',
                        //   'x-component': 'ArrayItems',
                        //   'x-decorator-props': {
                        //     className: 'fields-array-items',
                        //   },
                        //   'x-decorator': 'FormItem',
                        //   items: {
                        //     type: 'object',
                        //     properties: {
                        //       left: {
                        //         type: 'void',
                        //         'x-component': 'Space',
                        //         properties: {
                        //           sort: {
                        //             type: 'void',
                        //             'x-decorator': 'FormItem',
                        //             'x-component': 'ArrayItems.SortHandle',
                        //           },
                        //           title: {
                        //             type: 'string',
                        //             'x-decorator': 'FormItem',
                        //             'x-component': 'Input',
                        //             'x-read-pretty': true,
                        //           },
                        //           name: {
                        //             type: 'string',
                        //             'x-decorator': 'FormItem',
                        //             'x-component': 'Input',
                        //             'x-display': false,
                        //           },
                        //           visible: {
                        //             type: 'boolean',
                        //             'x-decorator': 'FormItem',
                        //             'x-component': 'Switch',
                        //           },
                        //         },
                        //       },
                        //       right: {
                        //         type: 'void',
                        //         'x-component': 'Space',
                        //         properties: {
                        //           moveUp: {
                        //             type: 'void',
                        //             'x-component': 'ArrayItems.MoveUp',
                        //           },
                        //           moveDown: {
                        //             type: 'void',
                        //             'x-component': 'ArrayItems.MoveDown',
                        //           },
                        //         },
                        //       },
                        //     },
                        //   },
                        //   required: true,
                        //   minLength: 1,
                        // },
                        // columnActions: {
                        //   title: '操作列配置',
                        //   type: 'object',
                        //   'x-decorator': 'FormItem',
                        //   'x-component': 'div',
                        //   'x-decorator-props': {
                        //     className: 'columnActions-item',
                        //   },
                        //   properties: {
                        //     visible: {
                        //       type: 'boolean',
                        //       title: '显示',
                        //       'x-decorator': 'FormItem',
                        //       'x-component': 'Switch',
                        //     },
                        //     align: {
                        //       type: 'string',
                        //       title: '排列',
                        //       'x-decorator': 'FormItem',
                        //       'x-component': 'Radio.Group',
                        //       enum: [
                        //         {
                        //           label: '固定在右侧',
                        //           value: 'right',
                        //         },
                        //         {
                        //           label: '固定在左侧',
                        //           value: 'left',
                        //         },
                        //       ],
                        //     },
                        //   },
                        // },
                        // pagination: {
                        //   title: '分页配置',
                        //   type: 'object',
                        //   'x-decorator': 'FormItem',
                        //   'x-component': 'div',
                        //   'x-decorator-props': {
                        //     className: 'columnActions-item',
                        //   },
                        //   properties: {
                        //     position: {
                        //       type: 'string',
                        //       title: '位置',
                        //       'x-decorator': 'FormItem',
                        //       'x-component': 'Radio.Group',
                        //       enum: [
                        //         {
                        //           label: '底部左侧',
                        //           value: 'bottomLeft',
                        //         },
                        //         {
                        //           label: '底部右侧',
                        //           value: 'bottomRight',
                        //         },
                        //       ],
                        //     },
                        //     showQuickJumper: {
                        //       type: 'boolean',
                        //       title: '快速跳转',
                        //       'x-decorator': 'FormItem',
                        //       'x-component': 'Switch',
                        //     },
                        //     pageSize: {
                        //       type: 'number',
                        //       title: '每页条数',
                        //       'x-decorator': 'FormItem',
                        //       'x-component': 'Select',
                        //       enum: [10, 20, 50, 100, 200].map((item) => {
                        //         return {
                        //           label: item,
                        //           value: item,
                        //         };
                        //       }),
                        //     },
                        //   },
                        // },
                      },
                    }}
                  />
                </FormLayout>
              </SchemaComponentOptions>
            );
          },
          theme,
        ).open({
          initialValues: {
            group: '',
            // fields: fieldItems,
            // columnActions: columnActions,
            // pagination: pagination,
          },
        });
        insert(
          createGroupTableSchema({
            collection: name,
            groupCollection: getCollectionField(`${name}.${values.group}`)?.target,
            ...values,
          }),
        );
      }}
    ></DataBlockInitializer>
  );
};
