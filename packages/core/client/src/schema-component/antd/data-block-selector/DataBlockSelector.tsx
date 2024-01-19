import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CollectionProvider, useCollection, useCollectionManager } from '../../../collection-manager';
import {
  GeneralSchemaDesigner,
  SchemaSettingsActionModalItem,
  SchemaSettingsButtonEditor,
  SchemaSettingsDivider,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
} from '../../../schema-settings';
import { ISchema, RecursionField, observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useCompile, useDesignable } from '../../hooks';
import { Action, ActionContextProvider, useActionContext } from '../action';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { linkageAction } from '../action/utils';
import { actionDesignerCss } from '../../../schema-initializer/components';
import { Button, Select, Space, message } from 'antd';
import { RecordPickerDrawer, useFieldNames } from '../record-picker';
import { unionBy } from 'lodash';
import {
  BlockAssociationContext,
  BlockProvider,
  BlockRequestContext,
  WithoutCollectionFieldFieldResource,
  WithoutTableFieldResource,
  useFormBlockContext,
  useFormBlockType,
} from '../../../block-provider';
import { useSchemaInitializerItem } from '../../../application';
import { BlockInitializer } from '../../../schema-initializer';

import { FormLayout, ArrayItems } from '@formily/antd-v5';

import { spliceArrayState } from '@formily/core/esm/shared/internals';
const DataBlockSelectorActionContext = createContext(null);
export const DataBlockSelectorAction: any = (props: any) => {
  const {
    value,
    collection: tName,
    multiple = true,
    sumFields,
    groupBy,
    fieldMaps = [],
    onChange,
    openSize = 'large',
    ...buttonProps
  } = props;

  const fieldNames = useFieldNames(props);
  const [visible, setVisible] = useState(false);
  const fieldSchema = useFieldSchema();
  const toFieldSchema = getParentFieldSchema(fieldSchema)?.['x-collection-field'];
  const { getCollectionField, getCollectionFields } = useCollectionManager();
  const addToField = getCollectionField(toFieldSchema);
  // const compile = useCompile();
  // const labelUiSchema = useLabelUiSchema(collectionField, fieldNames?.label || 'label');
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([]);
  const field = useField();
  const [toField, setToField] = useState<any>({});
  const [toCollectionName, setToCollectionName] = useState<any>(null);
  const [groupField, setGroupField] = useState({});
  const { form } = useFormBlockContext();
  const actionTitle = field.title;
  useEffect(() => {
    if (addToField) {
      const target = addToField?.target;
      if (target) {
        const temp = getCollectionFields(target).find((item) => item.target === tName);
        if (temp) {
          setToField(temp);
          setToCollectionName(target);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (groupBy) {
      const groupField = getCollectionField(`${tName}.${groupBy}`);
      setGroupField(groupField);
    }
  }, []);

  return (
    <div className={actionDesignerCss}>
      <WithoutCollectionFieldFieldResource.Provider value={true}>
        <BlockRequestContext.Provider value={{ resource: tName }}>
          {/* <BlockProvider name="table-field" block={'TableField'} resource={tName}> */}
          <DataBlockSelectorActionContext.Provider
            value={{
              selectedRows,
              toField,
              addToField,
              groupField,
              sumFields,
              fieldMaps,
              source: {
                from: tName,
                to: addToField?.target,
              },
            }}
          >
            <Button
              {...props}
              onClick={() => {
                setVisible(true);
              }}
            >
              {actionTitle}
              {props.children[1]}
            </Button>
            {RecordPickerDrawer({
              multiple,
              onChange,
              selectedRows,
              setSelectedRows,
              visible,
              setVisible,
              fieldSchema,
              options,
              collectionField: null,
              collection: tName,
              openSize,
            })}
          </DataBlockSelectorActionContext.Provider>
          {/* </BlockProvider> */}
        </BlockRequestContext.Provider>
      </WithoutCollectionFieldFieldResource.Provider>
    </div>
  );
};
DataBlockSelectorAction.Provider = () => {};
/**
 * 无效
 * @returns
 */
DataBlockSelectorAction.Initializer = () => {
  const collection = useCollection();
  const itemConfig = useSchemaInitializerItem();

  const schema = {};
  if (collection && schema['x-acl-action']) {
    schema['x-acl-action'] = `${collection.name}:${schema['x-acl-action']}`;
    schema['x-decorator'] = 'ACLActionProvider';
  }

  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />;
};

import { useTranslation } from 'react-i18next';
import { getParentFieldSchema } from '../form-item/hooks/useSpecialCase';
DataBlockSelectorAction.Designer = (props) => {
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const _fieldSchema = useFieldSchema();
  const fieldSchema = getParentFieldSchema(_fieldSchema);
  const collectionField = fieldSchema?.['x-collection-field'];
  const { getCollectionField, getCollectionFields } = useCollectionManager();
  const { collection, groupBy, sumFields, fieldMaps } = _fieldSchema['x-component-props'] || {};
  return (
    <GeneralSchemaDesigner {...props} disableInitializer>
      <SchemaSettingsButtonEditor />
      <SchemaSettingsModalItem
        title={t('选择来源数据配置')}
        components={{ ArrayItems }}
        schema={
          {
            type: 'object',
            properties: {
              collection: {
                type: 'string',
                title: '选择数据来源表',
                'x-decorator': 'FormItem',
                'x-component': 'CollectionSelect',
                default: collection,
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
                default: groupBy,
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
                default: sumFields || [],
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
                default: fieldMaps || [],
              },
            },
          } as ISchema
        }
        initialValues={{ collection, groupBy, sumFields, fieldMaps }}
        onSubmit={({ collection, groupBy, sumFields, fieldMaps }) => {
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            collection,
            groupBy,
            sumFields,
            fieldMaps,
          };
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-component-props': fieldSchema['x-component-props'],
              title: fieldSchema.title,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={(s) => {
          return s['x-component'] === 'Space' || s['x-component'].endsWith('ActionBar');
        }}
        confirm={{
          title: t('Delete action'),
        }}
      />
    </GeneralSchemaDesigner>
  );
};
const useDataBlockSelectorActionContext = () => {
  return useContext(DataBlockSelectorActionContext);
};

export const useDataBlockSelectorProps = () => {
  const { setVisible } = useActionContext();
  const { form } = useFormBlockContext();
  const { selectedRows, toField, addToField, groupField, sumFields, fieldMaps, source } =
    useDataBlockSelectorActionContext();
  const { getCollectionField } = useCollectionManager();
  /* 设置映射值 */
  const setFieldMap = (row, targetFieldName, fieldName, source) => {
    const { from, to } = source;
    const targetField = getCollectionField(`${to}.${targetFieldName}`);
    const field = getCollectionField(`${from}.${fieldName}`);
    if (row) {
      row[targetFieldName] = row[fieldName];
      if (targetField?.foreignKey) {
        row[targetField.foreignKey] = row[field.foreignKey];
      }
    }
  };
  return {
    async onClick() {
      const rows = selectedRows;
      const field = form.query(addToField.name).take();
      // 获取当前的bom_wl字段的值
      const currentRecords = field.value || [];
      if (!toField || !toField.foreignKey) {
        message.error('字段关系配置错误, 请联系管理员');
        return;
      }
      const newRows = [];
      const foreignKey = toField.foreignKey;
      const targetKey = toField.targetKey || 'id';
      if (toField && toField?.interface == 'obo') {
        rows.map(({ [targetKey]: id, ...row }) => {
          const isExist = currentRecords.find((item) => {
            return item[foreignKey] === id;
          });
          if (!isExist) {
            /* 一对一的关系 */
            newRows.push({
              ...row,
              [toField.name]: {
                id,
                ...row,
              },
              [foreignKey]: id,
            });
          }
        });
      } else if (toField && toField?.interface == 'm2m') {
        /* 一对多的关系 */
        if (!groupField) {
          message.error('缺少分组字段配置, 请联系管理员');
          return;
        }
        /* 根据分组字段进行调整 分组字段不包含值时 */
        const rowMap: any = {},
          otherRows = [];
        const groupRecords = rows.reduce((group, record) => {
          const category = record[groupField.foreignKey];
          if (category) {
            rowMap[category] = record[groupField.name];
            group[category] = group[category] ?? [];
            group[category].push(record);
          } else {
            const { id, ...others } = record;
            otherRows.push({
              ...others,
              [toField.name]: [record],
              [toField.otherKey]: id,
            });
          }
          return group;
        }, {});
        const addGroupRows = Object.values(rowMap).map(({ id, ...others }) => {
          let item = {
            ...others,
            [groupField.name]: { id, ...others },
            [groupField.foreignKey]: id,
            [toField.name]: groupRecords[id],
          };
          if (sumFields) {
            sumFields?.map((name) => {
              const sum = groupRecords[id].reduce((prev, cur) => {
                return prev + (typeof cur[name] == 'number' ? cur[name] : 0);
              }, 0);
              item[name] = sum;
            });
          }
          return item;
        });
        const addRows = [...addGroupRows, ...otherRows];
        addRows.map((row) => {
          const index = currentRecords.findIndex((item) => {
            return row[foreignKey] && item[foreignKey] === row[foreignKey];
          });

          if (fieldMaps.length > 0) {
            fieldMaps.map(({ field, mapField }) => {
              setFieldMap(row, mapField, field, source);
            });
          }
          if (index == -1) {
            /* 一对一的关系 */
            newRows.push({
              ...row,
            });
          } else {
            currentRecords[index] = {
              ...currentRecords[index],
              ...row,
            };
          }
        });
      }
      const newBomWl = [...currentRecords, ...newRows];
      field.onInput(newBomWl);
      setVisible(false);
    },
    disabled: false,
  };
};
