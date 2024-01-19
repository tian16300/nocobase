import type { ISchema } from '@formily/react';
import { Schema, useFieldSchema, useField, useForm } from '@formily/react';
import { merge } from '@formily/shared';
import {
  CollectionManagerProvider,
  FormDialog,
  SchemaComponent,
  SchemaInitializerSwitch,
  css,
  useBlockAssociationContext,
  useCollectionManager,
  useDesignable,
  useGlobalTheme,
  useSchemaComponentContext,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
// import { useFields } from './useFields';
import { useTranslation } from 'react-i18next';
import { FormLayout, ArrayItems } from '@formily/antd-v5';
import { getParentFieldSchema } from '../../hooks';
const findSchema = (schema: Schema, key: string, action: string) => {
  return schema.reduceProperties((buf, s) => {
    if (s[key] === action) {
      return s;
    }
    const c = findSchema(s, key, action);
    if (c) {
      return c;
    }
    return buf;
  });
};
const removeSchema = (schema, cb) => {
  return cb(schema);
};
const useCurrentSchema = (action: string, key: string, find = findSchema, rm = removeSchema) => {
  const fieldSchema = useFieldSchema();
  const { remove } = useDesignable();
  const schema = find(fieldSchema, key, action);
  return {
    schema,
    exists: !!schema,
    remove() {
      schema && rm(schema, remove);
    },
  };
};

export const SelectFromSourceActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { exists, remove } = useCurrentSchema('selectFromSourceAction', 'x-action', itemConfig.find, itemConfig.remove);

  const { t } = useTranslation();
  const { getCollectionField, getCollectionFields } = useCollectionManager();

  const { theme } = useGlobalTheme();
  const { components, scope } = useSchemaComponentContext();
  const ctx = useCollectionManager();
  const _fieldSchema = useFieldSchema();
  const fieldSchema = getParentFieldSchema(_fieldSchema);
  const collectionField = fieldSchema?.['x-collection-field'];
  return (
    <SchemaInitializerSwitch
      {...itemConfig}
      checked={exists}
      title={itemConfig.title}
      onClick={async () => {
        if (exists) {
          return remove();
        }
        const values = await FormDialog(
          {
            title: t('选择来源数据配置'),
            width: 780,
          },
          () => {
            return (
              <CollectionManagerProvider {...ctx}>
                <FormLayout layout={'vertical'} className={css``}>
                  <SchemaComponent
                    components={{ ...components, ArrayItems }}
                    scope={{ ...scope }}
                    schema={{
                      properties: {
                        collection: {
                          type: 'string',
                          title: '选择数据来源表',
                          'x-decorator': 'FormItem',
                          'x-component': 'CollectionSelect',
                        },
                        groupBy: {
                          type: 'string',
                          title: '分组字段',
                          'x-decorator': 'FormItem',
                          'x-component': 'AppendsTreeSelect',
                          'x-component-props': {
                            multiple: false,
                            useCollection() {
                              const { values } = useForm();
                              return values?.collection;
                            },
                          },
                          'x-reactions': [
                            {
                              dependencies: ['.collection'],
                              fulfill: {
                                state: {
                                  visible: '{{ !!$deps[0] }}',
                                },
                              },
                            },
                          ],
                        },
                        sumFields: {
                          type: 'array',
                          title: '统计字段',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            useProps: () => {
                              const field = useField();
                              const fields = getCollectionFields(field.data) || [];
                              // const {t} = useTranslation();
                              return {
                                options: fields
                                  .filter((field) => {
                                    return field.uiSchema?.type == 'number';
                                  })
                                  .map((field) => {
                                    return {
                                      label: field.uiSchema?.title,
                                      value: field.name,
                                    };
                                  }),
                                mode: 'multiple',
                              };
                            },
                          },
                          'x-reactions': [
                            {
                              dependencies: ['.collection'],
                              fulfill: {
                                state: {
                                  visible: '{{ !!$deps[0] }}',
                                  data: '{{$deps[0]}}',
                                },
                              },
                            },
                          ],
                        },
                        fieldMaps: {
                          type: 'array',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems',
                          items: {
                            type: 'object',
                            properties: {
                              space: {
                                type: 'void',
                                'x-component': 'Space',
                                properties: {
                                  sort: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'ArrayItems.SortHandle',
                                  },
                                  from: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'CollectionSelect',
                                    'x-component-props': {
                                      useProps: () => {
                                        const form = useForm();
                                        return {
                                          value: form.values?.collection,
                                          style: {
                                            width: 140,
                                          },
                                          disabled: true,
                                        };
                                      },
                                    },
                                    'x-read-pretty': true,
                                  },
                                  sourceField: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    'x-component-props': {
                                      useProps: () => {
                                        const field = useField();
                                        const fields = getCollectionFields(field.data) || [];
                                        // const {t} = useTranslation();
                                        return {
                                          options: fields
                                            .filter((field) => {
                                              return !['obo', 'm2m', 'o2m', 'dic'].includes(field?.inerface);
                                            })
                                            .map((field) => {
                                              return {
                                                label: field.uiSchema?.title,
                                                value: field.name,
                                              };
                                            }),
                                          style: {
                                            width: 160,
                                          },
                                        };
                                      },
                                    },
                                    'x-reactions': [
                                      {
                                        dependencies: ['collection'],
                                        fulfill: {
                                          state: {
                                            visible: '{{ !!$deps[0] }}',
                                            data: '{{$deps[0]}}',
                                          },
                                        },
                                      },
                                    ],
                                  },
                                  to: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'CollectionSelect',
                                    'x-component-props': {
                                      useProps: () => {
                                        return {
                                          value: collectionField ? getCollectionField(collectionField)?.target : '',
                                          style: {
                                            width: 140,
                                          },
                                          disabled: true,
                                        };
                                      },
                                    },
                                    'x-read-pretty': true,
                                  },
                                  targetField: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    'x-component-props': {
                                      useProps: () => {
                                        const cField = getCollectionField(collectionField);
                                        debugger;
                                        const fields = getCollectionFields(cField?.target) || [];
                                        return {
                                          options: fields
                                            .filter((field) => {
                                              return !['obo', 'm2m', 'o2m', 'dic'].includes(field?.inerface);
                                            })
                                            .map((field) => {
                                              return {
                                                label: field.uiSchema?.title,
                                                value: field.name,
                                              };
                                            }),
                                          style: {
                                            width: 160,
                                          },
                                        };
                                      },
                                    },
                                  },
                                  remove: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'ArrayItems.Remove',
                                  },
                                },
                              },
                            },
                          },
                          properties: {
                            add: {
                              type: 'void',
                              title: '添加条目',
                              'x-component': 'ArrayItems.Addition',
                            },
                          },
                        },
                      },
                    }}
                  />
                </FormLayout>
              </CollectionManagerProvider>
            );
          },
          theme,
        ).open({
          initialValues: {},
        });
        const schema = {
          'x-action': 'selectFromSourceAction',
          'x-component': 'Action',
          'x-designer': 'DataBlockSelectorAction.Designer',
          'x-component-props': {             
            ...values ,
            component:'DataBlockSelectorAction'
          },
          title: '选择来源',
          properties: {
            selector: {
              type: 'void',
              title: '{{ t("Select record") }}',
              'x-component': 'RecordPicker.Selector',
              'x-component-props': {
                className: 'nb-record-picker-selector',
              },
              properties: {
                grid: {
                  type: 'void',
                  'x-component': 'Grid',
                  'x-initializer': 'TableSelectorInitializers',
                },
                footer: {
                  'x-component': 'Action.Container.Footer',
                  'x-component-props': {},
                  properties: {
                    actions: {
                      type: 'void',
                      'x-component': 'ActionBar',
                      'x-component-props': {},
                      properties: {
                        submit: {
                          title: '{{ t("Submit") }}',
                          'x-action': 'submit',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            htmlType: 'submit',
                            useProps: '{{ useDataBlockSelectorProps }}',
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

        const s = merge(schema || {}, itemConfig.schema || {});
        itemConfig?.schemaInitialize?.(s);
        insert(s);
      }}
    />
  );
};
