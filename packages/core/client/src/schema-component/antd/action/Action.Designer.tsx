import { ArrayTable } from '@formily/antd-v5';
import { onFieldValueChange, onFieldInputValueChange, onFieldInit } from '@formily/core';
import { connect, ISchema, mapProps, useField, useFieldSchema, useForm, useFormEffects } from '@formily/react';
import { isValid, uid } from '@formily/shared';
import { Alert, Tree as AntdTree, ModalProps } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RemoteSelect, useCompile, useDesignable } from '../..';
import { CollectionOptions, useCollection, useCollectionManager } from '../../../collection-manager';
import { FlagProvider } from '../../../flag-provider';
import { useRecord } from '../../../record-provider';
import { OpenModeSchemaItems } from '../../../schema-items';
import { GeneralSchemaDesigner, SchemaSettings } from '../../../schema-settings';
import { useCollectionState } from '../../../schema-settings/DataTemplates/hooks/useCollectionState';
import { useSyncFromForm } from '../../../schema-settings/DataTemplates/utils';
import { DefaultValueProvider } from '../../../schema-settings/hooks/useIsAllowToSetDefaultValue';
import { useLinkageAction } from './hooks';
import { requestSettingsSchema } from './utils';
import { usePlugin } from '../../../application/hooks';
import { css } from '@emotion/css';

const Tree = connect(
  AntdTree,
  mapProps((props, field: any) => {
    useEffect(() => {
      field.value = props.defaultCheckedKeys || [];
    }, []);
    const [checkedKeys, setCheckedKeys] = useState(props.defaultCheckedKeys || []);
    const onCheck = (checkedKeys) => {
      setCheckedKeys(checkedKeys);
      field.value = checkedKeys;
    };
    field.onCheck = onCheck;
    const form = useForm();
    return {
      ...props,
      checkedKeys,
      onCheck,
      treeData: props?.treeData.map((v: any) => {
        if (form.values.duplicateMode === 'quickDulicate') {
          const children = v?.children?.map((k) => {
            return {
              ...k,
              disabled: false,
            };
          });
          return {
            ...v,
            disabled: false,
            children,
          };
        }
        return v;
      }),
    };
  }),
);
const MenuGroup = (props) => {
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const compile = useCompile();
  const actionTitle = fieldSchema.title ? compile(fieldSchema.title) : '';
  const actionType = fieldSchema['x-action'] ?? '';
  if (!actionType.startsWith('customize:') || !actionTitle) {
    return props.children;
  }
  return (
    <SchemaSettings.ItemGroup title={`${t('Customize')} > ${actionTitle}`}>{props.children}</SchemaSettings.ItemGroup>
  );
};

function ButtonEditor(props) {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const isLink = props?.isLink || fieldSchema['x-component'] === 'Action.Link';
  const defValue =  fieldSchema['x-component-props']||{};

  return (
    <SchemaSettings.ModalItem
      title={t('Edit button')}
      schema={
        {
          type: 'object',
          title: t('Edit button'),
          properties: {
            title: {
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              title: t('Button title'),
              default: fieldSchema.title,
              'x-component-props': {},
              // description: `原字段标题：${collectionField?.uiSchema?.title}`,
            },
            icon: {
              'x-decorator': 'FormItem',
              'x-component': 'IconPicker',
              title: t('Button icon'),
              default: fieldSchema?.['x-component-props']?.icon,
              'x-component-props': {},
              // 'x-visible': !isLink,
              // description: `原字段标题：${collectionField?.uiSchema?.title}`,
            },
            type: {
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              title: t('按钮类型'),
              default: fieldSchema?.['x-component-props']?.type,
              enum: [
                { value: 'default', label: '{{t("Default")}}' },
                { value: 'primary', label: '{{t("Highlight")}}' },
                { value: 'danger', label: '{{t("Danger red")}}' },
                { value: 'text', label: '文本' },
                { value: 'link', label: '链接' }
              ],
              'x-visible': !isLink,
            },
            size:{
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              title: t('按钮尺寸'),
              default: fieldSchema?.['x-component-props']?.size || 'default',
              enum: [
                { value: 'small', label: '小' },
                { value: 'default', label: '中' },
                { value: 'large', label: '大' }
              ],
              // 'x-visible': !isLink,
            }
          },
        } as ISchema
      }
      initialValues={{...defValue}}
      onSubmit={({ title, icon, type, size }) => {
        fieldSchema.title = title;
        field.title = title;
        field.componentProps.icon = icon;
        field.componentProps.type = type;
        field.componentProps.size = size;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].icon = icon;
        fieldSchema['x-component-props'].type = type;
        fieldSchema['x-component-props'].size = size;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            title,
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
}

function SaveMode() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const { getEnableFieldTree, getOnLoadData } = useCollectionState(name);

  return (
    <SchemaSettings.ModalItem
      title={t('Save mode')}
      components={{ Tree }}
      scope={{ getEnableFieldTree, name, getOnLoadData }}
      schema={
        {
          type: 'object',
          title: t('Save mode'),
          properties: {
            saveMode: {
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              // title: t('Save mode'),
              default: field.componentProps.saveMode || 'create',
              enum: [
                { value: 'create', label: '{{t("Insert")}}' },
                { value: 'firstOrCreate', label: '{{t("Insert if not exists")}}' },
                { value: 'updateOrCreate', label: '{{t("Insert if not exists, or update")}}' },
              ],
            },
            filterKeys: {
              type: 'array',
              title: '{{ t("Determine whether a record exists by the following fields") }}',
              required: true,
              default: field.componentProps.filterKeys,
              'x-decorator': 'FormItem',
              'x-component': 'Tree',
              'x-component-props': {
                treeData: [],
                checkable: true,
                checkStrictly: true,
                selectable: false,
                loadData: '{{ getOnLoadData($self) }}',
                defaultCheckedKeys: field.componentProps.filterKeys,
                rootStyle: {
                  padding: '8px 0',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  maxHeight: '30vh',
                  overflow: 'auto',
                  margin: '2px 0',
                },
              },
              'x-reactions': [
                {
                  dependencies: ['.saveMode'],
                  fulfill: {
                    state: {
                      hidden: '{{ $deps[0]==="create"}}',
                      componentProps: {
                        treeData: '{{ getEnableFieldTree(name, $self) }}',
                      },
                    },
                  },
                },
              ],
            },
          },
        } as ISchema
      }
      onSubmit={({ saveMode, filterKeys }) => {
        field.componentProps.saveMode = saveMode;
        field.componentProps.filterKeys = filterKeys;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].saveMode = saveMode;
        fieldSchema['x-component-props'].filterKeys = filterKeys;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
}

const findFormBlock = (schema) => {
  const formSchema = schema.reduceProperties((_, s) => {
    if (s['x-decorator'] === 'FormBlockProvider') {
      return s;
    } else {
      return findFormBlock(s);
    }
  }, null);
  return formSchema;
};

const getAllkeys = (data, result) => {
  for (let i = 0; i < data?.length; i++) {
    const { children, ...rest } = data[i];
    result.push(rest.key);
    if (children) {
      getAllkeys(children, result);
    }
  }
  return result;
};

function DuplicationMode() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const { collectionList, getEnableFieldTree, getOnLoadData, getOnCheck } = useCollectionState(name);
  const duplicateValues = cloneDeep(fieldSchema['x-component-props'].duplicateFields || []);
  const record = useRecord();
  const syncCallBack = useCallback((treeData, selectFields, form) => {
    form.query('duplicateFields').take((f) => {
      f.componentProps.treeData = treeData;
      f.componentProps.defaultCheckedKeys = selectFields;
      f.setInitialValue(selectFields);
      f?.onCheck(selectFields);
      form.setValues({ ...form.values, treeData });
    });
  }, []);
  const useSelectAllFields = (form) => {
    return {
      async run() {
        form.query('duplicateFields').take((f) => {
          const selectFields = getAllkeys(f.componentProps.treeData, []);
          f.componentProps.defaultCheckedKeys = selectFields;
          f.setInitialValue(selectFields);
          f?.onCheck(selectFields);
        });
      },
    };
  };
  const useUnSelectAllFields = (form) => {
    return {
      async run() {
        form.query('duplicateFields').take((f) => {
          f.componentProps.defaultCheckedKeys = [];
          f.setInitialValue([]);
          f?.onCheck([]);
        });
      },
    };
  };
  return (
    <SchemaSettings.ModalItem
      title={t('Duplicate mode')}
      components={{ Tree }}
      scope={{
        getEnableFieldTree,
        collectionName: fieldSchema['x-component-props']?.duplicateCollection || record?.__collection || name,
        currentCollection: record?.__collection || name,
        getOnLoadData,
        getOnCheck,
        treeData: fieldSchema['x-component-props']?.treeData,
        duplicateValues,
        onFieldInputValueChange,
      }}
      schema={
        {
          type: 'object',
          title: t('Duplicate mode'),
          properties: {
            duplicateMode: {
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              title: t('Duplicate mode'),
              default: fieldSchema['x-component-props']?.duplicateMode || 'quickDulicate',
              enum: [
                { value: 'quickDulicate', label: '{{t("Direct duplicate")}}' },
                { value: 'continueduplicate', label: '{{t("Copy into the form and continue to fill in")}}' },
              ],
            },
            collection: {
              type: 'string',
              title: '{{ t("Target collection") }}',
              required: true,
              description: t('If collection inherits, choose inherited collections as templates'),
              default: name,
              'x-display': collectionList.length > 1 ? 'visible' : 'hidden',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                options: collectionList,
              },
              'x-reactions': [
                {
                  dependencies: ['.duplicateMode'],
                  fulfill: {
                    state: {
                      disabled: `{{ $deps[0]==="quickDulicate" }}`,
                      value: `{{ $deps[0]==="quickDulicate"? currentCollection:collectionName }}`,
                    },
                  },
                },
              ],
            },
            syncFromForm: {
              type: 'void',
              title: '{{ t("Sync from form fields") }}',
              'x-component': 'Action.Link',
              'x-component-props': {
                type: 'primary',
                style: { float: 'right', position: 'relative', zIndex: 1200 },
                useAction: () => {
                  const formSchema = useMemo(() => findFormBlock(fieldSchema), [fieldSchema]);
                  return useSyncFromForm(
                    formSchema,
                    fieldSchema['x-component-props']?.duplicateCollection || record?.__collection || name,
                    syncCallBack,
                  );
                },
              },
              'x-reactions': [
                {
                  dependencies: ['.duplicateMode'],
                  fulfill: {
                    state: {
                      visible: `{{ $deps[0]!=="quickDulicate" }}`,
                    },
                  },
                },
              ],
            },
            selectAll: {
              type: 'void',
              title: '{{ t("Select all") }}',
              'x-component': 'Action.Link',
              'x-reactions': [
                {
                  dependencies: ['.duplicateMode'],
                  fulfill: {
                    state: {
                      visible: `{{ $deps[0]==="quickDulicate"}}`,
                    },
                  },
                },
              ],
              'x-component-props': {
                type: 'primary',
                style: { float: 'right', position: 'relative', zIndex: 1200 },
                useAction: () => {
                  const from = useForm();
                  return useSelectAllFields(from);
                },
              },
            },
            unselectAll: {
              type: 'void',
              title: '{{ t("UnSelect all") }}',
              'x-component': 'Action.Link',
              'x-reactions': [
                {
                  dependencies: ['.duplicateMode', '.duplicateFields'],
                  fulfill: {
                    state: {
                      visible: `{{ $deps[0]==="quickDulicate"&&$form.getValuesIn('duplicateFields').length>0 }}`,
                    },
                  },
                },
              ],
              'x-component-props': {
                type: 'primary',
                style: { float: 'right', position: 'relative', zIndex: 1200, marginRight: '10px' },
                useAction: () => {
                  const from = useForm();
                  return useUnSelectAllFields(from);
                },
              },
            },
            duplicateFields: {
              type: 'array',
              title: '{{ t("Data fields") }}',
              required: true,
              description: t('Only the selected fields will be used as the initialization data for the form'),
              'x-decorator': 'FormItem',
              'x-component': Tree,
              'x-component-props': {
                defaultCheckedKeys: duplicateValues,
                treeData: [],
                checkable: true,
                checkStrictly: true,
                selectable: false,
                loadData: '{{ getOnLoadData($self) }}',
                onCheck: '{{ getOnCheck($self) }}',
                rootStyle: {
                  padding: '8px 0',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  maxHeight: '30vh',
                  overflow: 'auto',
                  margin: '2px 0',
                },
              },
              'x-reactions': [
                {
                  dependencies: ['.collection', '.duplicateMode'],
                  fulfill: {
                    state: {
                      disabled: '{{ !$deps[0] }}',
                      componentProps: {
                        treeData: '{{ getEnableFieldTree($deps[0], $self,treeData) }}',
                      },
                    },
                  },
                },
              ],
            },
          },
        } as ISchema
      }
      onSubmit={({ duplicateMode, collection, duplicateFields, treeData }) => {
        const fields = Array.isArray(duplicateFields) ? duplicateFields : duplicateFields.checked || [];
        field.componentProps.duplicateMode = duplicateMode;
        field.componentProps.duplicateFields = fields;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].duplicateMode = duplicateMode;
        fieldSchema['x-component-props'].duplicateFields = fields;
        fieldSchema['x-component-props'].duplicateCollection = collection;
        fieldSchema['x-component-props'].treeData = treeData || field.componentProps?.treeData;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
}

function UpdateMode() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();

  return (
    <SchemaSettings.SelectItem
      title={t('Data will be updated')}
      options={[
        { label: t('Selected'), value: 'selected' },
        { label: t('All'), value: 'all' },
      ]}
      value={fieldSchema?.['x-action-settings']?.['updateMode']}
      onChange={(value) => {
        fieldSchema['x-action-settings']['updateMode'] = value;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
        dn.refresh();
      }}
    />
  );
}

function AssignedFieldValues() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const [initialSchema, setInitialSchema] = useState<ISchema>();
  useEffect(() => {
    const schemaUid = uid();
    const schema: ISchema = {
      type: 'void',
      'x-uid': schemaUid,
      'x-component': 'Grid',
      'x-initializer': 'CustomFormItemInitializers',
    };
    setInitialSchema(schema);
  }, [field.address]);

  const tips = {
    'customize:update': t(
      'After clicking the custom button, the following fields of the current record will be saved according to the following form.',
    ),
    'customize:save': t(
      'After clicking the custom button, the following fields of the current record will be saved according to the following form.',
    ),
  };
  const actionType = fieldSchema['x-action'] ?? '';
  const onSubmit = useCallback(
    (assignedValues) => {
      fieldSchema['x-action-settings']['assignedValues'] = assignedValues;
      dn.emit('patch', {
        schema: {
          ['x-uid']: fieldSchema['x-uid'],
          'x-action-settings': fieldSchema['x-action-settings'],
        },
      });
    },
    [dn, fieldSchema],
  );

  return (
    <FlagProvider isInAssignFieldValues={true}>
      <DefaultValueProvider isAllowToSetDefaultValue={() => false}>
        <SchemaSettings.ActionModalItem
          title={t('Assign field values')}
          maskClosable={false}
          initialSchema={initialSchema}
          initialValues={fieldSchema?.['x-action-settings']?.assignedValues}
          modalTip={tips[actionType]}
          uid={fieldSchema?.['x-action-settings']?.schemaUid}
          onSubmit={onSubmit}
        />
      </DefaultValueProvider>
    </FlagProvider>
  );
}

function RequestSettings() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();

  return (
    <SchemaSettings.ActionModalItem
      title={t('Request settings')}
      schema={requestSettingsSchema}
      initialValues={fieldSchema?.['x-action-settings']?.requestSettings}
      onSubmit={(requestSettings) => {
        fieldSchema['x-action-settings']['requestSettings'] = requestSettings;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
        dn.refresh();
      }}
    />
  );
}

function SkipValidation() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();

  return (
    <SchemaSettings.SwitchItem
      title={t('Skip required validation')}
      checked={!!fieldSchema?.['x-action-settings']?.skipValidator}
      onChange={(value) => {
        fieldSchema['x-action-settings'].skipValidator = value;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': {
              ...fieldSchema['x-action-settings'],
            },
          },
        });
      }}
    />
  );
}

function AfterSuccess() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettings.ModalItem
      title={t('After successful submission')}
      initialValues={fieldSchema?.['x-action-settings']?.['onSuccess']}
      schema={
        {
          type: 'object',
          title: t('After successful submission'),
          properties: {
            successMessage: {
              title: t('Popup message'),
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {},
            },
            manualClose: {
              title: t('Popup close method'),
              enum: [
                { label: t('Automatic close'), value: false },
                { label: t('Manually close'), value: true },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              'x-component-props': {},
            },
            redirecting: {
              title: t('Then'),
              enum: [
                { label: t('Stay on current page'), value: false },
                { label: t('Redirect to'), value: true },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              'x-component-props': {},
              'x-reactions': {
                target: 'redirectTo',
                fulfill: {
                  state: {
                    visible: '{{!!$self.value}}',
                  },
                },
              },
            },
            redirectTo: {
              title: t('Link'),
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={(onSuccess) => {
        fieldSchema['x-action-settings']['onSuccess'] = onSuccess;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}

function RemoveButton(
  props: {
    onConfirmOk?: ModalProps['onOk'];
  } = {},
) {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const isDeletable = fieldSchema?.parent['x-component'] === 'CollectionField';
  return (
    !isDeletable && (
      <>
        <SchemaSettings.Divider />
        <SchemaSettings.Remove
          removeParentsIfNoChildren
          breakRemoveOn={(s) => {
            return s['x-component'] === 'Space' || s['x-component'].endsWith('ActionBar');
          }}
          confirm={{
            title: t('Delete action'),
            onOk: props.onConfirmOk,
          }}
        />
      </>
    )
  );
}

function WorkflowSelect({ types, ...props }) {
  const { t } = useTranslation();
  const index = ArrayTable.useIndex();
  const { setValuesIn } = useForm();
  const baseCollection = useCollection();
  const { getCollection } = useCollectionManager();
  const [workflowCollection, setWorkflowCollection] = useState(baseCollection.name);
  useFormEffects(() => {
    onFieldValueChange(`group[${index}].context`, (field) => {
      let collection: CollectionOptions = baseCollection;
      if (field.value) {
        const paths = field.value.split('.');
        for (let i = 0; i < paths.length && collection; i++) {
          const path = paths[i];
          const associationField = collection.fields.find((f) => f.name === path);
          if (associationField) {
            collection = getCollection(associationField.target);
          }
        }
      }
      setWorkflowCollection(collection.name);
      setValuesIn(`group[${index}].workflowKey`, null);
    });
  });

  return (
    <RemoteSelect
      manual={false}
      placeholder={t('Select workflow', { ns: 'workflow' })}
      fieldNames={{
        label: 'title',
        value: 'key',
      }}
      service={{
        resource: 'workflows',
        action: 'list',
        params: {
          filter: {
            type: types,
            enabled: true,
            'config.collection': workflowCollection,
          },
        },
      }}
      {...props}
    />
  );
}

function WorkflowConfig() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const { name: collection } = useCollection();
  const workflowPlugin = usePlugin('workflow') as any;
  const workflowTypes = workflowPlugin.getTriggersOptions().filter((item) => {
    return typeof item.options.useActionTriggerable === 'function'
      ? item.options.useActionTriggerable()
      : item.options.useActionTriggerable;
  });
  const description = {
    submit: t('Workflow will be triggered after submitting succeeded.', { ns: 'workflow' }),
    'customize:save': t('Workflow will be triggered after saving succeeded.', { ns: 'workflow' }),
    'customize:triggerWorkflows': t('Workflow will be triggered directly once the button clicked.', { ns: 'workflow' }),
  }[fieldSchema?.['x-action']];

  return (
    <SchemaSettings.ModalItem
      title={t('Bind workflows', { ns: 'workflow' })}
      scope={{
        fieldFilter(field) {
          return ['belongsTo', 'hasOne'].includes(field.type);
        },
      }}
      components={{
        Alert,
        ArrayTable,
        WorkflowSelect,
      }}
      schema={
        {
          type: 'void',
          title: t('Bind workflows', { ns: 'workflow' }),
          properties: {
            description: description && {
              type: 'void',
              'x-component': 'Alert',
              'x-component-props': {
                message: description,
                style: {
                  marginBottom: '1em',
                },
              },
            },
            group: {
              type: 'array',
              'x-component': 'ArrayTable',
              'x-decorator': 'FormItem',
              items: {
                type: 'object',
                properties: {
                  context: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: t('Trigger data context', { ns: 'workflow' }),
                      width: 200,
                    },
                    properties: {
                      context: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'AppendsTreeSelect',
                        'x-component-props': {
                          placeholder: t('Select context', { ns: 'workflow' }),
                          popupMatchSelectWidth: false,
                          collection,
                          filter: '{{ fieldFilter }}',
                          rootOption: {
                            label: t('Full form data', { ns: 'workflow' }),
                            value: '',
                          },
                          allowClear: false,
                        },
                        default: '',
                      },
                    },
                  },
                  workflowKey: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: t('Workflow', { ns: 'workflow' }),
                    },
                    properties: {
                      workflowKey: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'WorkflowSelect',
                        'x-component-props': {
                          types: workflowTypes.map((item) => item.value),
                        },
                        required: true,
                      },
                    },
                  },
                  operations: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      width: 32,
                    },
                    properties: {
                      remove: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: 'void',
                  title: t('Add workflow', { ns: 'workflow' }),
                  'x-component': 'ArrayTable.Addition',
                },
              },
            },
          },
        } as ISchema
      }
      initialValues={{ group: fieldSchema?.['x-action-settings']?.triggerWorkflows }}
      onSubmit={({ group }) => {
        fieldSchema['x-action-settings']['triggerWorkflows'] = group;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}

const SetInheriteFields = (props) => {
  const {collectionName: pCollectionName} = props;
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const inheritValues = cloneDeep(fieldSchema['x-component-props'].inheritsKeys || []);
  const record = useRecord();
  const collectionName = pCollectionName || record?.__collection || name;
  const { collectionList, getEnableFieldTree, getOnLoadData, getOnCheck } = useCollectionState(collectionName);
  const useSelectAllFields = (form) => {
    return {
      async run() {
        form.query('inheritsKeys').take((f) => {
          const selectFields = getAllkeys(f.componentProps.treeData, []);
          f.componentProps.defaultCheckedKeys = selectFields;
          f.setInitialValue(selectFields);
          f?.onCheck(selectFields);
        });
      },
    };
  };
  return (
    <SchemaSettings.ModalItem
      title={t('设置默认值')}
      components={{ Tree }}
      scope={{
        getEnableFieldTree,
        collectionName: collectionName || record?.__collection || name,
        currentCollection: collectionName || record?.__collection || name,
        getOnLoadData,
        getOnCheck,
        treeData: fieldSchema['x-component-props']?.treeData,
      }}
      schema={
        {
          type: 'object',
          title: t('设置默认值'),
          properties: {
            collection: {
              type: 'string',
              title: '{{ t("Target collection") }}',
              required: true,
              description: t('If collection inherits, choose inherited collections as templates'),
              default: collectionName,
              'x-display': collectionList.length > 1 ? 'visible' : 'hidden',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                options: collectionList
              },
            },
            selectAll: {
              type: 'void',
              title: '{{ t("Select all") }}',
              'x-component': 'Action.Link',
              'x-component-props': {
                type: 'primary',
                style: { float: 'right', position: 'relative', zIndex: 1200 },
                useAction: () => {
                  const from = useForm();
                  return useSelectAllFields(from);
                },
              },
            },
            fieldKeys: {
              type: 'array',
              title: '{{ t("Data fields") }}',
              required: true,
              description: t('Only the selected fields will be used as the initialization data for the form'),
              'x-decorator': 'FormItem',
              'x-component': Tree,
              'x-component-props': {
                defaultCheckedKeys: inheritValues,
                treeData: [],
                checkable: true,
                checkStrictly: true,
                selectable: false,
                loadData: '{{ getOnLoadData($self) }}',
                onCheck: '{{ getOnCheck($self) }}',
                rootStyle: {
                  padding: '8px 0',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  maxHeight: '30vh',
                  overflow: 'auto',
                  margin: '2px 0',
                },
              },
              'x-reactions': [
                {
                  dependencies: ['.collection'],
                  fulfill: {
                    state: {
                      disabled: '{{ !$deps[0] }}',
                      componentProps: {
                        treeData: '{{ getEnableFieldTree($deps[0], $self,treeData) }}',
                      },
                    },
                  },
                },
              ],
              default: inheritValues
            },
          },
        } as ISchema
      }
      onSubmit={({ fieldKeys, treeData }) => {
        const fields = Array.isArray(fieldKeys) ? fieldKeys : fieldKeys.checked || [];
        field.componentProps.inheritsKeys = fields;
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].inheritsKeys = fields;
        fieldSchema['x-component-props']
        fieldSchema['x-component-props'].treeData = treeData;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
};
export const ActionDesigner = (props) => {
  const { modalTip, linkageAction, removeButtonProps, buttonEditorProps, linkageRulesProps, ...restProps } = props;
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const { getChildrenCollections } = useCollectionManager();
  const isAction = useLinkageAction();
  const isPopupAction = ['create', 'update', 'view', 'customize:popup', 'duplicate', 'customize:create'].includes(
    fieldSchema['x-action'] || '',
  );
  const isUpdateModePopupAction = ['customize:bulkUpdate', 'customize:bulkEdit'].includes(fieldSchema['x-action']);
  const isLinkageAction = linkageAction || isAction;
  const isChildCollectionAction = getChildrenCollections(name).length > 0 && fieldSchema['x-action'] === 'create';
  const isDraggable = fieldSchema?.parent['x-component'] !== 'CollectionField';
  const isDuplicateAction = fieldSchema['x-action'] === 'duplicate';
  const isAddChildAction = fieldSchema['x-component-props']?.addChild;
  return (
    <GeneralSchemaDesigner {...restProps} disableInitializer draggable={isDraggable}>
      <MenuGroup>
        <ButtonEditor {...buttonEditorProps} />        
        <ActionScopeBind />
        {isAddChildAction && <SetInheriteFields collectionName={name} />}
        {fieldSchema['x-action'] === 'submit' &&
          fieldSchema.parent?.['x-initializer'] === 'CreateFormActionInitializers' && <SaveMode />}
        {isLinkageAction && <SchemaSettings.LinkageRules {...linkageRulesProps} collectionName={name} />}
        {isDuplicateAction && <DuplicationMode />}
        <OpenModeSchemaItems openMode={isPopupAction} openSize={isPopupAction} />
        {isUpdateModePopupAction && <UpdateMode />}
        {isValid(fieldSchema?.['x-action-settings']?.assignedValues) && <AssignedFieldValues />}
        {isValid(fieldSchema?.['x-action-settings']?.requestSettings) && <RequestSettings />}
        {isValid(fieldSchema?.['x-action-settings']?.skipValidator) && <SkipValidation />}
        {isValid(fieldSchema?.['x-action-settings']?.['onSuccess']) && <AfterSuccess />}
        {isValid(fieldSchema?.['x-action-settings']?.triggerWorkflows) && <WorkflowConfig />}
        {restProps.children}
        {isChildCollectionAction && <SchemaSettings.EnableChildCollections collectionName={name} />}
        {fieldSchema?.['x-action-settings']?.removable !== false && <RemoveButton {...removeButtonProps} />}
      </MenuGroup>
    </GeneralSchemaDesigner>
  );
};

function ActionScopeBind(props) {
  const {type = 'action'} = props;
  const field = useField();
  const schema = useFieldSchema();
  let fieldSchema = schema;
  if(type === 'form'){
    fieldSchema = schema?.properties?.form;
  }
  const { dn } = useDesignable();
  const { t } = useTranslation();
  let defValue =  fieldSchema['x-component-props']?.['useProps'];
  const initialValues = {};
  if(defValue){
    defValue = defValue.replace('{{','').replace('}}','');
    initialValues['usePropsOption'] = defValue.trim();
    initialValues['useProps'] = defValue.trim();
  }
  const enumOptions = [{
    label:'刷新',
    value:'useRefreshActionProps'
  },{
    label:'树表单新增操作',
    value:'useTreeFormCreateActionProps'
  },{
    label:'树表单刷新操作',
    value:'useTreeFormRefreshActionProps'
  },{
    label:'树表单展开收缩操作',
    value:'useTreeFormExpandActionProps'
  },{
    label:'树表单新增初始化',
    value:'useTreeFormCreateProps'
  }]

  return (
    <SchemaSettings.ModalItem
      title={t('功能绑定')}
      schema={
        {
          type: 'object',
          title: t('功能绑定'),
          properties: {           
            usePropsOption: {
              type:'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              title: t('功能选择'),
              enum: enumOptions
            }, 
            useProps: {
              type:'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              title: t('自定义功能')
            },
          },
        } as ISchema
      }
      initialValues={initialValues}
      onSubmit={({ useProps, usePropsOption }) => {  
        const funcName =   usePropsOption || useProps;  
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'].useProps =`{{ ${funcName} }}`;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
}
SchemaSettings.ActionScopeBind = ActionScopeBind;
SchemaSettings.ButtonEditor = ButtonEditor;
ActionDesigner.ButtonEditor = ButtonEditor;
