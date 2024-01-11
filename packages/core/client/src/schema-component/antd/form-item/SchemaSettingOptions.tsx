import { ArrayCollapse, FormLayout } from '@formily/antd-v5';
import { Field } from '@formily/core';
import { ISchema, Schema, useField, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormBlockContext } from '../../../block-provider';
import { useCollection, useCollectionManager } from '../../../collection-manager';
import {
  SchemaSettingsActionModalItem,
  SchemaSettingsButtonEditor,
  SchemaSettingsModalItem,
  SchemaSettingsSelectItem,
  SchemaSettingsSwitchItem,
  isPatternDisabled,
} from '../../../schema-settings';
import { useCompile, useDesignable, useFieldModeOptions } from '../../hooks';
import { useOperatorList } from '../filter/useOperators';
import { isFileCollection } from './FormItem';
export const findFilterOperators = (schema: Schema) => {
  while (schema) {
    if (schema['x-filter-operators']) {
      return {
        operators: schema['x-filter-operators'],
        uid: schema['x-uid'],
      };
    }
    schema = schema.parent;
  }
  return {};
};

const divWrap = (schema: ISchema) => {
  return {
    type: 'void',
    'x-component': 'div',
    properties: {
      [schema.name || uid()]: schema,
    },
  };
};

export const EditTitle = () => {
  const { getCollectionJoinField } = useCollectionManager();
  const { getField } = useCollection();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);

  return collectionField ? (
    <SchemaSettingsModalItem
      key="edit-field-title"
      title={t('Edit field title')}
      schema={
        {
          type: 'object',
          title: t('Edit field title'),
          properties: {
            title: {
              title: t('Field title'),
              default: field?.title,
              description: `${t('Original field title: ')}${collectionField?.uiSchema?.title}`,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={({ title }) => {
        if (title) {
          field.title = title;
          fieldSchema.title = title;
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              title: fieldSchema.title,
            },
          });
        }
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditDescription = () => {
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();

  return !field.readPretty ? (
    <SchemaSettingsModalItem
      key="edit-description"
      title={t('Edit description')}
      schema={
        {
          type: 'object',
          title: t('Edit description'),
          properties: {
            description: {
              // title: t('Description'),
              default: field?.description,
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={({ description }) => {
        field.description = description;
        fieldSchema.description = description;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            description: fieldSchema.description,
          },
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditTooltip = () => {
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();

  return field.readPretty ? (
    <SchemaSettingsModalItem
      key="edit-tooltip"
      title={t('Edit tooltip')}
      schema={
        {
          type: 'object',
          title: t('Edit description'),
          properties: {
            tooltip: {
              default: fieldSchema?.['x-decorator-props']?.tooltip,
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={({ tooltip }) => {
        field.decoratorProps.tooltip = tooltip;
        fieldSchema['x-decorator-props'] = fieldSchema['x-decorator-props'] || {};
        fieldSchema['x-decorator-props']['tooltip'] = tooltip;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            'x-decorator-props': fieldSchema['x-decorator-props'],
          },
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditRequired = () => {
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn, refresh } = useDesignable();

  // TODO: FormField 好像被弃用了，应该删除掉
  return !field.readPretty && fieldSchema['x-component'] !== 'FormField' ? (
    <SchemaSettingsSwitchItem
      key="required"
      title={t('Required')}
      checked={fieldSchema.required as boolean}
      onChange={(required) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        field.required = required;
        fieldSchema['required'] = required;
        schema['required'] = required;
        dn.emit('patch', {
          schema,
        });
        refresh();
      }}
    />
  ) : null;
};

export const EditValidationRules = () => {
  const { getInterface, getCollectionJoinField } = useCollectionManager();
  const { getField } = useCollection();
  const { form } = useFormBlockContext();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn, refresh } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  const interfaceConfig = getInterface(collectionField?.interface);
  const validateSchema = interfaceConfig?.['validateSchema']?.(fieldSchema);

  return form && !form?.readPretty && validateSchema ? (
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
        // return;
        // if (['number'].includes(collectionField?.interface) && collectionField?.uiSchema?.['x-component-props']?.['stringMode'] === true) {
        //   rules['numberStringMode'] = true;
        // }
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
  ) : null;
};

export const EditDefaultValue = () => {
  const { getCollectionJoinField } = useCollectionManager();
  const { getField } = useCollection();
  const { form } = useFormBlockContext();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn, refresh } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);

  return form && !form?.readPretty && collectionField?.uiSchema?.type ? (
    <SchemaSettingsModalItem
      title={t('Set default value')}
      components={{ ArrayCollapse, FormLayout }}
      schema={
        {
          type: 'object',
          title: t('Set default value'),
          properties: {
            default: {
              ...collectionField?.uiSchema,
              name: 'default',
              title: t('Default value'),
              'x-decorator': 'FormItem',
              default: fieldSchema.default || collectionField?.defaultValue,
            },
          },
        } as ISchema
      }
      onSubmit={(v) => {
        const schema: ISchema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        if (field.value !== v.default) {
          field.value = v.default;
        }
        fieldSchema.default = v.default;
        schema.default = v.default;
        dn.emit('patch', {
          schema,
        });
        refresh();
      }}
    />
  ) : null;
};

export const EditComponent = () => {
  const { getCollectionJoinField, getCollection } = useCollectionManager();
  const { getField } = useCollection();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  const fieldModeOptions = useFieldModeOptions();
  const isAssociationField = ['belongsTo', 'hasOne', 'hasMany', 'belongsToMany'].includes(collectionField?.type);
  const targetCollection = getCollection(collectionField?.target);
  const isFileField = isFileCollection(targetCollection as any);

  return isAssociationField && fieldModeOptions ? (
    <SchemaSettingsSelectItem
      key="field-mode"
      title={t('Field component')}
      options={fieldModeOptions}
      value={field?.componentProps?.['mode'] || (isFileField ? 'FileManager' : 'Select')}
      onChange={(mode) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['mode'] = mode;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps.mode = mode;
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditPattern = () => {
  const { getCollectionJoinField } = useCollectionManager();
  const { getField } = useCollection();
  const { form } = useFormBlockContext();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  let readOnlyMode = 'editable';
  if (fieldSchema['x-disabled'] === true) {
    readOnlyMode = 'readonly';
  }
  if (fieldSchema['x-read-pretty'] === true) {
    readOnlyMode = 'read-pretty';
  }

  return form && !form?.readPretty && collectionField?.interface !== 'o2m' && !isPatternDisabled(fieldSchema) ? (
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
            break;
          }
          case 'read-pretty': {
            fieldSchema['x-read-pretty'] = true;
            fieldSchema['x-disabled'] = false;
            schema['x-read-pretty'] = true;
            schema['x-disabled'] = false;
            field.readPretty = true;
            break;
          }
          default: {
            fieldSchema['x-read-pretty'] = false;
            fieldSchema['x-disabled'] = false;
            schema['x-read-pretty'] = false;
            schema['x-disabled'] = false;
            field.readPretty = false;
            field.disabled = false;
            break;
          }
        }

        dn.emit('patch', {
          schema,
        });

        dn.refresh();
      }}
    />
  ) : null;
};

/**
 * 如果用户没有手动设置过 operator，那么在筛选的时候 operator 会是空的，
 * 该方法确保 operator 一定有值（需要在 FormItem 中调用）
 */
export const useEnsureOperatorsValid = () => {
  const fieldSchema = useFieldSchema();
  const operatorList = useOperatorList();
  const { operators: storedOperators } = findFilterOperators(fieldSchema);

  if (storedOperators && operatorList.length && !storedOperators[fieldSchema.name]) {
    storedOperators[fieldSchema.name] = operatorList[0].value;
  }
};

export const EditOperator = () => {
  const compile = useCompile();
  const fieldSchema = useFieldSchema();
  const field = useField<Field>();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const operatorList = useOperatorList();
  const { operators: storedOperators = {}, uid } = findFilterOperators(fieldSchema);

  if (operatorList.length && !storedOperators[fieldSchema.name]) {
    storedOperators[fieldSchema.name] = operatorList[0].value;
  }

  return operatorList.length ? (
    <SchemaSettingsSelectItem
      key="operator"
      title={t('Operator')}
      value={storedOperators[fieldSchema.name]}
      options={compile(operatorList)}
      onChange={(v) => {
        storedOperators[fieldSchema.name] = v;
        const operator = operatorList.find((item) => item.value === v);
        const schema: ISchema = {
          ['x-uid']: uid,
          ['x-filter-operators']: storedOperators,
        };
        let componentProps = {};

        // 根据操作符的配置，设置组件的属性
        if (operator?.schema?.['x-component']) {
          _.set(fieldSchema, 'x-component-props.component', operator.schema['x-component']);
          _.set(field, 'componentProps.component', operator.schema['x-component']);
          field.reset();
          componentProps = {
            component: operator.schema['x-component'],
            ...operator.schema['x-component-props'],
          };
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              ['x-component-props']: componentProps,
            },
          });
        } else if (fieldSchema['x-component-props']?.component) {
          _.set(fieldSchema, 'x-component-props.component', null);
          _.set(field, 'componentProps.component', null);
          field.reset();
          componentProps = {
            component: null,
            ...operator.schema['x-component-props'],
          };
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              ['x-component-props']: componentProps,
            },
          });
        }

        field.componentProps = componentProps;
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditTitleField = () => {
  const { getCollectionFields, getCollectionJoinField } = useCollectionManager();
  const { getField } = useCollection();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const compile = useCompile();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  const targetFields = collectionField?.target
    ? getCollectionFields(collectionField?.target)
    : getCollectionFields(collectionField?.targetCollection) ?? [];
  const options = targetFields
    .filter((field) => (['dic'].includes(field?.interface) ? true : !field?.target) && field.type !== 'boolean')
    .map((field) => ({
      value: ['dic'].includes(field?.interface) ? [field.name, 'label'].join('.') : field.name,
      label: compile(field?.uiSchema?.title) || field?.name,
    }));

  return options.length > 0 && fieldSchema['x-component'] === 'CollectionField' ? (
    <SchemaSettingsSelectItem
      key="title-field"
      title={t('Title field')}
      options={options}
      value={field?.componentProps?.fieldNames?.label}
      onChange={(label) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        const fieldNames = {
          ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
          ...field.componentProps.fieldNames,
          label,
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['fieldNames'] = fieldNames;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const EditDataBlockSelectorAction = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { name, title } = useCollection();
  const { getCollectionFields } = useCollectionManager();
  const fields = getCollectionFields(name);
  const addToFields = fields
    .filter((field) => {
      return ['o2m','m2m'].includes(field?.interface);
    })
    .map((item) => {
      return { label: item?.uiSchema?.title, value: item.name };
    });
  const initialValues = fieldSchema?.['x-component-props'];
  return (
    <>
      <SchemaSettingsButtonEditor />    
        <SchemaSettingsModalItem
          title="批量选择"
          schema={{
            type: 'object',
            properties: {
              collection: {
                type: 'string',
                title: '选择数据表',
                'x-decorator': 'FormItem',
                'x-component': 'CollectionSelect',
              },
              addTo: {
                type: 'string',
                title: '添加到',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: addToFields,
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
              sumFields:{
                type: 'array', 
                title: '统计字段',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  useProps: ()=>{
                    const field = useField();
                    const fields = getCollectionFields(field.data)||[];
                    // const {t} = useTranslation();
                    return {
                      options: fields.filter((field)=>{
                        return field.uiSchema?.type == 'number';
                      }).map((field)=>{
                        return {
                          label: field.uiSchema?.title,
                          value: field.name
                        }
                      }),
                      mode:'multiple'

                    }
                  }
                },
                'x-reactions': [{
                  dependencies:['.collection'],
                  fulfill:{
                    state:{
                      visible: '{{ !!$deps[0] }}',
                      data: '{{$deps[0]}}'
                    }
                  }
                }],
              },
            },
          }}
          initialValues={initialValues}
          onSubmit={(values) => {
            field.componentProps = {
              ...field.componentProps,
              ...values,
            };
            fieldSchema['x-component-props'] = {
              ...initialValues,
              ...values,
            };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
            dn.refresh();
          }}
        />
      
    </>
  );
};
