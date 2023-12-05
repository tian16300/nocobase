import { css, cx } from '@emotion/css';
import { ArrayCollapse, FormLayout, FormItem as Item } from '@formily/antd-v5';
import { Field } from '@formily/core';
import { ISchema, observer, useField, useFieldSchema } from '@formily/react';
import { Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormBlockContext } from '../../../block-provider/FormBlockProvider';
import { Collection, useCollection, useCollectionManager } from '../../../collection-manager';
import { useRecord } from '../../../record-provider';
import { GeneralSchemaItems } from '../../../schema-items/GeneralSchemaItems';
import { GeneralSchemaDesigner, SchemaSettingsDataFormat, SchemaSettingsDataScope, SchemaSettingsDefaultValue, SchemaSettingsDivider, SchemaSettingsItem, SchemaSettingsModalItem, SchemaSettingsModalItem, SchemaSettingsRemove, SchemaSettingsSelectItem, SchemaSettingsSortingRule, SchemaSettingsSwitchItem, isPatternDisabled } from '../../../schema-settings';
import { ActionType } from '../../../schema-settings/LinkageRules/type';
import { VariableInput, getShouldChange } from '../../../schema-settings/VariableInput/VariableInput';
import useIsAllowToSetDefaultValue from '../../../schema-settings/hooks/useIsAllowToSetDefaultValue';
import { useIsShowMultipleSwitch } from '../../../schema-settings/hooks/useIsShowMultipleSwitch';
import { useLocalVariables, useVariables } from '../../../variables';
import { useCompile, useDesignable, useFieldModeOptions } from '../../hooks';
import { isSubMode } from '../association-field/util';
import { removeNullCondition } from '../filter';
import { DynamicComponentProps } from '../filter/DynamicComponent';
import { getTempFieldState } from '../form-v2/utils';
import { useColorFields } from '../table-v2/Table.Column.Designer';
import { EditDataBlockSelectorAction, useEnsureOperatorsValid } from './SchemaSettingOptions';


export function Designer() {
  const {
    getCollectionFields,
    getInterface,
    getCollectionJoinField,
    getCollection,
    isTitleField,
    getAllCollectionsInheritChain,
  } = useCollectionManager();
  const { getField } = useCollection();
  const { form } = useFormBlockContext();
  const record = useRecord();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn, refresh, insertAdjacent } = useDesignable();
  const compile = useCompile();
  const IsShowMultipleSwitch = useIsShowMultipleSwitch();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  const variables = useVariables();
  const localVariables = useLocalVariables();
  const { isAllowToSetDefaultValue } = useIsAllowToSetDefaultValue();
  const isAddNewForm = useIsAddNewForm();

  const targetCollection = getCollection(collectionField?.target);
  const interfaceConfig = getInterface(collectionField?.interface);
  const validateSchema = interfaceConfig?.['validateSchema']?.(fieldSchema);
  const originalTitle = collectionField?.uiSchema?.title;
  const targetFields = collectionField?.target
    ? getCollectionFields(collectionField?.target)
    : getCollectionFields(collectionField?.targetCollection) ?? [];
  const fieldModeOptions = useFieldModeOptions();
  const isAssociationField = ['obo', 'oho', 'o2o', 'o2m', 'm2m', 'm2o', 'dic'].includes(collectionField?.interface);
  const isTableField = fieldSchema['x-component'] === 'TableField';
  const isFileField = isFileCollection(targetCollection as any);
  const options = targetFields
    .filter((field) => {
      return isTitleField(field);
    })
    .map((field) => ({
      value: ['dic'].includes(field?.interface) ? [field?.name, 'label'].join('.') : field?.name,
      label: compile(field?.uiSchema?.title) || field?.name,
    }));
  const colorFieldOptions = useColorFields(collectionField?.target ?? collectionField?.targetCollection);

  let readOnlyMode = 'editable';
  if (fieldSchema['x-disabled'] === true) {
    readOnlyMode = 'readonly';
  }
  if (fieldSchema['x-read-pretty'] === true) {
    readOnlyMode = 'read-pretty';
  }
  const fieldMode = field?.componentProps?.['mode'] || (isFileField ? 'FileManager' : 'Select');
  const isSelectFieldMode = isAssociationField && fieldMode === 'Select';
  const isSubTableFieldMode = isAssociationField && fieldMode === 'SubTable';
  const isSubFormMode = fieldSchema['x-component-props']?.mode === 'Nester';
  const isPickerMode = fieldSchema['x-component-props']?.mode === 'Picker';
  const showFieldMode = isAssociationField && fieldModeOptions && !isTableField;
  const showModeSelect = showFieldMode && isPickerMode;
  const isDateField = ['datetime', 'createdAt', 'updatedAt'].includes(collectionField?.interface);
  const isAttachmentField =
    ['attachment'].includes(collectionField?.interface) || targetCollection?.template === 'file';
  const isMultiple = fieldSchema?.['x-component-props']?.multiple;
  return (
    <GeneralSchemaDesigner>
      <GeneralSchemaItems />
      {!form?.readPretty && isFileField ? (
        <SchemaSettingsSwitchItem
          key="quick-upload"
          title={t('Quick upload')}
          checked={fieldSchema['x-component-props']?.quickUpload !== (false as boolean)}
          onChange={(value) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            field.componentProps.quickUpload = value;
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props'].quickUpload = value;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      ) : null}
      {!form?.readPretty && isFileField ? (
        <SchemaSettingsSwitchItem
          key="select-file"
          title={t('Select file')}
          checked={fieldSchema['x-component-props']?.selectFile !== (false as boolean)}
          onChange={(value) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            field.componentProps.selectFile = value;
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props'].selectFile = value;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      ) : null}
      {form && !form?.readPretty && validateSchema && (
        <SchemaSettingsModalItem
          title={t('Set validation rules')}
          components={{ ArrayCollapse, FormLayout }}
          schema={
            {
              type: 'object',
              title: t('Set validation rules'),
              properties: {
                rules: {
                  type: 'array',
                  default: fieldSchema?.['x-validator'],
                  'x-component': 'ArrayCollapse',
                  'x-decorator': 'FormItem',
                  'x-component-props': {
                    accordion: true,
                  },
                  maxItems: 3,
                  items: {
                    type: 'object',
                    'x-component': 'ArrayCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '{{ t("Validation rule") }}',
                    },
                    properties: {
                      index: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.Index',
                      },
                      layout: {
                        type: 'void',
                        'x-component': 'FormLayout',
                        'x-component-props': {
                          labelStyle: {
                            marginTop: '6px',
                          },
                          labelCol: 8,
                          wrapperCol: 16,
                        },
                        properties: {
                          ...validateSchema,
                          message: {
                            type: 'string',
                            title: '{{ t("Error message") }}',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input.TextArea',
                            'x-component-props': {
                              autoSize: {
                                minRows: 2,
                                maxRows: 2,
                              },
                            },
                          },
                        },
                      },
                      remove: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.Remove',
                      },
                      moveUp: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.MoveUp',
                      },
                      moveDown: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.MoveDown',
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      title: '{{ t("Add validation rule") }}',
                      'x-component': 'ArrayCollapse.Addition',
                      'x-reactions': {
                        dependencies: ['rules'],
                        fulfill: {
                          state: {
                            disabled: '{{$deps[0].length >= 3}}',
                          },
                        },
                      },
                    },
                  },
                },
              },
            } as ISchema
          }
          onSubmit={(v) => {
            const rules = [];
            for (const rule of v.rules) {
              rules.push(_.pickBy(rule, _.identity));
            }
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            if (['percent'].includes(collectionField?.interface)) {
              for (const rule of rules) {
                if (!!rule.maxValue || !!rule.minValue) {
                  rule['percentMode'] = true;
                }

                if (rule.percentFormat) {
                  rule['percentFormats'] = true;
                }
              }
            }
            const concatValidator = _.concat([], collectionField?.uiSchema?.['x-validator'] || [], rules);
            field.validator = concatValidator;
            fieldSchema['x-validator'] = rules;
            schema['x-validator'] = rules;
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      )}
      {isAllowToSetDefaultValue() && <SchemaSettingsDefaultValue />}
      {isSelectFieldMode && (
        <SchemaSettingsModalItem
          title={'追加字段'}
          initialValues={{
            appends: fieldSchema['x-component-props']?.service?.params?.appends,
          }}
          schema={{
            type: 'object',
            title: '追加字段',
            properties: {
              appends: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
                'x-component-props': {
                  multiple: true,
                  defaultExpandAll: true,
                  treeData: targetFields
                    .filter((field) => {
                      return ['obo', 'oho', 'o2o', 'o2m', 'm2m', 'm2o', 'dic'].includes(field?.interface);
                    })
                    .map((field) => {
                      return {
                        title: compile(field.uiSchema?.title || field.name),
                        key: field.name,
                        value: field.name,
                      };
                    }),
                },
              },
            },
          }}
          onSubmit={({ appends }) => {
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props'].service = fieldSchema['x-component-props'].service || {};
            fieldSchema['x-component-props'].service.params = fieldSchema['x-component-props']?.service?.params || {};
            fieldSchema['x-component-props'].service.params.appends = appends;
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
              ['x-component-props']: fieldSchema['x-component-props'],
            };
            dn.emit('patch', {
              schema,
            });

            dn.refresh();
          }}
        ></SchemaSettingsModalItem>
      )}
      {(isSelectFieldMode || isSubTableFieldMode) && !field.readPretty && (
        <SchemaSettingsDataScope
          collectionName={collectionField?.target}
          defaultFilter={fieldSchema?.['x-component-props']?.service?.params?.filter || {}}
          form={form}
          dynamicComponent={(props: DynamicComponentProps) => {
            return (
              <VariableInput
                {...props}
                form={form}
                collectionField={props.collectionField}
                record={record}
                shouldChange={getShouldChange({
                  collectionField: props.collectionField,
                  variables,
                  localVariables,
                  getAllCollectionsInheritChain,
                })}
              />
            );
          }}
          onSubmit={({ filter }) => {
            filter = removeNullCondition(filter);
            _.set(field.componentProps, 'service.params.filter', filter);
            fieldSchema['x-component-props'] = field.componentProps;
            void dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': field.componentProps,
              },
            });
          }}
        />
      )}
      {(isSelectFieldMode || isSubTableFieldMode) && !field.readPretty && <SchemaSettingsSortingRule />}
      {showFieldMode && (
        <SchemaSettingsSelectItem
          key="field-mode"
          title={t('Field component')}
          options={fieldModeOptions}
          value={fieldMode}
          onChange={(mode) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['mode'] = mode;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = field.componentProps || {};
            field.componentProps.mode = mode;

            // 子表单状态不允许设置默认值
            if (isSubMode(fieldSchema) && isAddNewForm) {
              // @ts-ignore
              schema.default = null;
              fieldSchema.default = null;
              field.setInitialValue(null);
              field.setValue(null);
            }

            void dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      )}
      {showFieldMode && isSubTableFieldMode && (
        <>
          <SchemaSettingsModalItem
            title="子表格设置"
            schema={{
              type: 'object',
              title: '子表格设置',
              properties: {
                showAdd: {
                  type: 'boolean',
                  title: '允许新增',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                },
                showMove: {
                  type: 'boolean',
                  title: '允许移动',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                },
                showDel: {
                  type: 'boolean',
                  title: '允许删除',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                },
                removeActionName: {
                  type: 'string',
                  title: '删除操作',
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  enum: [
                    {
                      label: '删除',
                      value: 'remove',
                    },
                    {
                      label: '标记删除',
                      value: 'setRemoved',
                    },
                  ],
                  default: 'remove',
                  'x-reactions':[{
                    dependencies: ['showDel'],
                    fulfill: {
                      state: {
                        visible: '{{$deps[0]}}',
                      },
                    },
                  }]
                },
                scrollY: {
                  type: 'number',
                  title: '最大高度',
                  'x-decorator': 'FormItem',
                  'x-component': 'InputNumber',
                },
              },
            }}
            initialValues={fieldSchema['x-component-props']}
            onSubmit={(values) => {
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              field.componentProps = {
                ...field.componentProps,
                ...values,
              };
              fieldSchema['x-component-props'] = {
                ...fieldSchema['x-component-props'],
                ...values,
              };
              schema['x-component-props'] = fieldSchema['x-component-props'];
              dn.emit('patch', {
                schema,
              });
              refresh();
            }}
          ></SchemaSettingsModalItem>
        </>
      )}
      {showModeSelect && (
        <SchemaSettingsItem title="Popup size">
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            {t('Popup size')}
            <Select
              bordered={false}
              options={[
                { label: t('Small'), value: 'small' },
                { label: t('Middle'), value: 'middle' },
                { label: t('Large'), value: 'large' },
              ]}
              value={
                fieldSchema?.['x-component-props']?.['openSize'] ??
                (fieldSchema?.['x-component-props']?.['openMode'] == 'modal' ? 'large' : 'middle')
              }
              onChange={(value) => {
                field.componentProps.openSize = value;
                fieldSchema['x-component-props'] = field.componentProps;
                dn.emit('patch', {
                  schema: {
                    'x-uid': fieldSchema['x-uid'],
                    'x-component-props': fieldSchema['x-component-props'],
                  },
                });
                dn.refresh();
              }}
              style={{ textAlign: 'right', minWidth: 100 }}
            />
          </div>
        </SchemaSettingsItem>
      )}
      {!field.readPretty && isAssociationField && ['Picker'].includes(fieldMode) && (
        <SchemaSettingsSwitchItem
          key="allowAddNew"
          title={t('Allow add new data')}
          checked={fieldSchema['x-add-new'] as boolean}
          onChange={(allowAddNew) => {
            const hasAddNew = fieldSchema.reduceProperties((buf, schema) => {
              if (schema['x-component'] === 'Action') {
                return schema;
              }
              return buf;
            }, null);

            if (!hasAddNew) {
              const addNewActionschema = {
                'x-action': 'create',
                'x-acl-action': 'create',
                title: "{{t('Add new')}}",
                'x-designer': 'Action.Designer',
                'x-component': 'Action',
                'x-decorator': 'ACLActionProvider',
                'x-component-props': {
                  openMode: 'drawer',
                  type: 'default',
                  component: 'CreateRecordAction',
                },
              };
              insertAdjacent('afterBegin', addNewActionschema);
            }
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            field['x-add-new'] = allowAddNew;
            fieldSchema['x-add-new'] = allowAddNew;
            schema['x-add-new'] = allowAddNew;
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      )}
      {!field.readPretty && isAssociationField && ['Select'].includes(fieldMode) && (
        <SchemaSettingsSelectItem
          key="add-mode"
          title={t('Quick create')}
          options={[
            { label: t('None'), value: 'none' },
            { label: t('Dropdown'), value: 'quickAdd' },
            { label: t('Pop-up'), value: 'modalAdd' },
          ]}
          value={field.componentProps?.addMode || 'none'}
          onChange={(mode) => {
            if (mode === 'modalAdd') {
              const hasAddNew = fieldSchema.reduceProperties((buf, schema) => {
                if (schema['x-component'] === 'Action') {
                  return schema;
                }
                return buf;
              }, null);

              if (!hasAddNew) {
                const addNewActionschema = {
                  'x-action': 'create',
                  'x-acl-action': 'create',
                  title: "{{t('Add new')}}",
                  'x-designer': 'Action.Designer',
                  'x-component': 'Action',
                  'x-decorator': 'ACLActionProvider',
                  'x-component-props': {
                    openMode: 'drawer',
                    type: 'default',
                    component: 'CreateRecordAction',
                  },
                };
                insertAdjacent('afterBegin', addNewActionschema);
              }
            }
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['addMode'] = mode;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = field.componentProps || {};
            field.componentProps.addMode = mode;
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      )}
      {isAssociationField && IsShowMultipleSwitch() ? (
        <SchemaSettingsSwitchItem
          key="multiple"
          title={t('Allow multiple')}
          checked={
            fieldSchema['x-component-props']?.multiple === undefined ? true : fieldSchema['x-component-props'].multiple
          }
          onChange={(value) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            field.componentProps = field.componentProps || {};

            fieldSchema['x-component-props'].multiple = value;
            field.componentProps.multiple = value;

            schema['x-component-props'] = fieldSchema['x-component-props'];
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      ) : null}
      {IsShowMultipleSwitch() && isSubFormMode ? (
        <SchemaSettingsSwitchItem
          key="allowDissociate"
          title={t('Allow dissociate')}
          checked={fieldSchema['x-component-props']?.allowDissociate !== false}
          onChange={(value) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            field.componentProps = field.componentProps || {};

            fieldSchema['x-component-props'].allowDissociate = value;
            field.componentProps.allowDissociate = value;

            schema['x-component-props'] = fieldSchema['x-component-props'];
            dn.emit('patch', {
              schema,
            });
            refresh();
          }}
        />
      ) : null}

      {/* 至少选几条 最大选多少条 */}
      {((isAssociationField && isMultiple) || isSubTableFieldMode) && (
        <SchemaSettingsModalItem
          title={t('设置数组长度')}
          schema={{
            type: 'object',
            title: t('设置数组长度'),
            properties: {
              minLength: {
                title: '最小长度',
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              maxLength: {
                title: '最大长度',
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
            },
          }}
          initialValues={{
            minLength: fieldSchema['minLength'],
            maxLength: fieldSchema['maxLength'],
          }}
          onSubmit={(values) => {
            if (values.minLength) field.setValidatorRule('minLength', values.minLength);
            if (values.maxLength) field.setValidatorRule('maxLength', values.maxLength);
            Object.assign(fieldSchema, values);
            dn.emit('patch', {
              schema: {
                'x-uid': fieldSchema['x-uid'],
                ...values,
              },
            });
            dn.refresh();
          }}
        ></SchemaSettingsModalItem>
      )}

      {field.readPretty && options.length > 0 && fieldSchema['x-component'] === 'CollectionField' && !isFileField && (
        <SchemaSettingsSwitchItem
          title={t('Enable link')}
          checked={fieldSchema['x-component-props']?.enableLink !== false}
          onChange={(flag) => {
            fieldSchema['x-component-props'] = {
              ...fieldSchema?.['x-component-props'],
              enableLink: flag,
            };
            field.componentProps['enableLink'] = flag;
            dn.emit('patch', {
              schema: {
                'x-uid': fieldSchema['x-uid'],
                'x-component-props': {
                  ...fieldSchema?.['x-component-props'],
                },
              },
            });
            dn.refresh();
          }}
        />
      )}

      <EditDataBlockSelectorAction />
      {form && !form?.readPretty && !isPatternDisabled(fieldSchema) && (
        <SchemaSettingsSelectItem
          key="pattern"
          title={t('Pattern')}
          options={[
            { label: t('Editable'), value: 'editable' },
            { label: t('Readonly'), value: 'readonly' },
            { label: t('Easy-reading'), value: 'read-pretty' },
          ]}
          value={readOnlyMode}
          onChange={(v) => {
            const schema: ISchema = {
              ['x-uid']: fieldSchema['x-uid'],
            };

            switch (v) {
              case 'readonly': {
                fieldSchema['x-read-pretty'] = false;
                fieldSchema['x-disabled'] = true;
                schema['x-read-pretty'] = false;
                schema['x-disabled'] = true;
                field.readPretty = false;
                field.disabled = true;
                _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.ReadOnly));
                break;
              }
              case 'read-pretty': {
                fieldSchema['x-read-pretty'] = true;
                fieldSchema['x-disabled'] = false;
                schema['x-read-pretty'] = true;
                schema['x-disabled'] = false;
                field.readPretty = true;
                _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.ReadPretty));
                break;
              }
              default: {
                fieldSchema['x-read-pretty'] = false;
                fieldSchema['x-disabled'] = false;
                schema['x-read-pretty'] = false;
                schema['x-disabled'] = false;
                field.readPretty = false;
                field.disabled = false;
                _.set(field, 'initStateOfLinkageRules.pattern', getTempFieldState(true, ActionType.Editable));
                break;
              }
            }

            dn.emit('patch', {
              schema,
            });

            dn.refresh();
          }}
        />
      )}
      {options.length > 0 && isAssociationField && fieldMode !== 'SubTable' && (
        <SchemaSettingsSelectItem
          key="title-field"
          title={t('Title field')}
          options={options}
          value={field?.componentProps?.fieldNames?.label}
          onChange={(value) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            const label = value.split('.');
            const appends = label.slice(0, label.length - 1);
            const fieldNames = {
              ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
              ...field.componentProps.fieldNames,
              label: value,
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['fieldNames'] = fieldNames;
            fieldSchema['x-component-props']['service'] = fieldSchema['x-component-props']['service'] || {};
            fieldSchema['x-component-props']['service']['params'] =
              fieldSchema['x-component-props']['service']['params'] || {};
            fieldSchema['x-component-props']['service']['params'] = {
              ...fieldSchema['x-component-props']['service']['params'],
              appends,
            };
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
            field.componentProps.service = field.componentProps.service || {};
            field.componentProps.service.params = fieldSchema['x-component-props']['service']['params'];
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      )}
      {isDateField && <SchemaSettingsDataFormat fieldSchema={fieldSchema} />}

      {isAttachmentField && field.readPretty && (
        <SchemaSettingsSelectItem
          key="size"
          title={t('Size')}
          options={[
            { label: t('Large'), value: 'large' },
            { label: t('Default'), value: 'default' },
            { label: t('Small'), value: 'small' },
          ]}
          value={field?.componentProps?.size || 'default'}
          onChange={(size) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['size'] = size;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = field.componentProps || {};
            field.componentProps.size = size;
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      )}

      {isAssociationField && ['Tag'].includes(fieldMode) && (
        <SchemaSettingsSelectItem
          key="title-field"
          title={t('Tag color field')}
          options={colorFieldOptions}
          value={field?.componentProps?.tagColorField}
          onChange={(tagColorField) => {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };

            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['tagColorField'] = tagColorField;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps.tagColorField = tagColorField;
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          }}
        />
      )}
      {collectionField && <SchemaSettingsDivider />}
      <SchemaSettingsRemove
        key="remove"
        removeParentsIfNoChildren
        confirm={{
          title: t('Delete field'),
        }}
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

export function isFileCollection(collection: Collection) {
  return collection?.template === 'file';
}


function useIsAddNewForm() {
  const record = useRecord();
  const isAddNewForm = _.isEmpty(_.omit(record, ['__parent', '__collectionName']));

  return isAddNewForm;
}
