import { ISchema, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GeneralSchemaDesigner,
  SchemaSettingsActionScopeBind,
  SchemaSettingsButtonEditor,
  SchemaSettingsDivider,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
  useDesignable,
} from '@nocobase/client';

export const CountTableChangeActionDesign = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { table, countTable, iconTable, iconCountTable } = fieldSchema['x-component-props'] || {};

  return (
    <GeneralSchemaDesigner {...props} disableInitializer>
      <SchemaSettingsButtonEditor />
      <SchemaSettingsModalItem
        title={t('按钮设置')}
        schema={
          {
            type: 'object',
            title: t('展开收缩按钮设置'),
            properties: {
              table: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('明细')}`,
                default: table,
              },
              countTable: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('统计')}`,
                default: countTable,
              },
              iconTable: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('明细')}`,
                default: iconTable,
              },
              iconCountTable: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('统计')}`,
                default: iconCountTable,
              },
              type: {
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                title: t('Button background color'),
                default: fieldSchema?.['x-component-props']?.danger
                  ? 'danger'
                  : fieldSchema?.['x-component-props']?.type === 'primary'
                    ? 'primary'
                    : 'default',
                enum: [
                  { value: 'default', label: '{{t("Default")}}' },
                  { value: 'primary', label: '{{t("Highlight")}}' },
                  { value: 'danger', label: '{{t("Danger red")}}' },
                ],
              },
            },
          } as ISchema
        }
        onSubmit={(values) => {
          // fieldSchema.title = t('Expand/Collapse');
          // field.title = t('Expand/Collapse');
          field.componentProps = {
            ... field.componentProps,
            ...values
          };
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            ...values
          };
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-component-props': fieldSchema['x-component-props'],
              // title: fieldSchema.title,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettingsActionScopeBind />
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
