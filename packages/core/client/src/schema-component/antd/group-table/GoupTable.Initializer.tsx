import { useTranslation } from 'react-i18next';
import { useCollectionManager } from '../../../collection-manager';
import { useContext } from 'react';
import { SchemaOptionsContext } from '@formily/react';
import { useGlobalTheme } from '../../../global-theme';
import { DataBlockInitializer } from '../../../schema-initializer';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaComponent, SchemaComponentOptions } from '../../core';
import { ArrayItems, FormLayout } from '@formily/antd-v5';
import { FormDialog } from '..';
import { uid } from '@formily/shared';
import { css } from '@emotion/css';

export const createGroupTableSchema = (decoratorProps) => {
  const { collection } = decoratorProps;
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
          groupActions: {
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
          groupRecordActions: {
            type: 'void',
            title: '{{ t("Actions") }}',
            'x-decorator': 'GroupTable.GroupRecordActionBar',
            'x-component':'ActionBar',
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
      },
    },
  };
};

export const Initializer = (props) => {
  const { insert } = props;
  const { t } = useTranslation();
  const { getCollectionFields } = useCollectionManager();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  return (
    <DataBlockInitializer
      {...props}
      componentType={'GroupTable'}
      icon={<FormOutlined />}
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
            name: t(field?.uiSchema?.title),
            visible: false,
          };
        });
        const columnActions = {
          visible: true,
          align: 'right',
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
                        fields: {
                          title: '显示字段',
                          type: 'array',
                          'x-component': 'ArrayItems',
                          'x-decorator-props': {
                            className: 'fields-array-items',
                          },
                          'x-decorator': 'FormItem',
                          items: {
                            type: 'object',
                            properties: {
                              left: {
                                type: 'void',
                                'x-component': 'Space',
                                properties: {
                                  sort: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'ArrayItems.SortHandle',
                                  },
                                  name: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Input',
                                    'x-read-pretty': true,
                                  },
                                  visible: {
                                    type: 'boolean',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Switch',
                                  },
                                },
                              },
                              right: {
                                type: 'void',
                                'x-component': 'Space',
                                properties: {
                                  moveUp: {
                                    type: 'void',
                                    'x-component': 'ArrayItems.MoveUp',
                                  },
                                  moveDown: {
                                    type: 'void',
                                    'x-component': 'ArrayItems.MoveDown',
                                  },
                                },
                              },
                            },
                          },
                          required: true,
                          minLength: 1,
                        },
                        columnActions: {
                          title: '操作列配置',
                          type: 'object',
                          'x-decorator': 'FormItem',
                          'x-component': 'div',
                          'x-decorator-props': {
                            className: 'columnActions-item',
                          },
                          properties: {
                            visible: {
                              type: 'boolean',
                              title: '显示',
                              'x-decorator': 'FormItem',
                              'x-component': 'Switch',
                            },
                            align: {
                              type: 'string',
                              title: '排列',
                              'x-decorator': 'FormItem',
                              'x-component': 'Radio.Group',
                              enum: [
                                {
                                  label: '固定在右侧',
                                  value: 'right',
                                },
                                {
                                  label: '固定在左侧',
                                  value: 'left',
                                },
                              ],
                            },
                          },
                        },
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
            fields: fieldItems,
            columnActions: columnActions,
          },
        });
        insert(
          createGroupTableSchema({
            collection: name,
            ...values,
          }),
        );
      }}
    ></DataBlockInitializer>
  );
};
