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

export const FullScreenActionDesign = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { titleFullScreen, titleNormal, iconFullScreen, iconNormal } = fieldSchema['x-component-props'] || {};
  return (
    <GeneralSchemaDesigner {...props} disableInitializer>
      <SchemaSettingsButtonEditor />
      <SchemaSettingsModalItem
        title={t('全屏按钮设置')}
        schema={
          {
            type: 'object',
            title: t('全屏按钮图标设置'),
            properties: {
              titleFullScreen: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('Expand all')}`,
                default: titleFullScreen,
              },
              titleNormal: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('Collapse all')}`,
                default: titleNormal,
              },
              iconFullScreen: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('Expand all')}`,
                default: iconFullScreen,
              },
              iconNormal: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('Collapse all')}`,
                default: iconNormal,
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
        onSubmit={({  titleFullScreen, titleNormal, iconFullScreen, iconNormal }) => {
          fieldSchema.title = t('全屏');
          field.title = t('全屏');
          field.componentProps.icon = iconFullScreen;
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            titleFullScreen,
            titleNormal,
            iconFullScreen,
            iconNormal
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
