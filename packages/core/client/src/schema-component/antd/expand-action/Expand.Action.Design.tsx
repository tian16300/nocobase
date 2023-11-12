import { ISchema, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDesignable } from '../..';
import { GeneralSchemaDesigner, SchemaSettings } from '../../../schema-settings';

export const ExpandActionDesign = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { titleExpand, titleCollapse, iconExpand, iconCollapse } = fieldSchema['x-component-props'] || {};

  return (
    <GeneralSchemaDesigner {...props} disableInitializer>
      <SchemaSettings.ModalItem
        title={t('Edit button')}
        schema={
          {
            type: 'object',
            title: t('Edit button'),
            properties: {
              titleExpand: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('Expand all')}`,
                default: titleExpand,
              },
              titleCollapse: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: `${t('Button title')} - ${t('Collapse all')}`,
                default: titleCollapse,
              },
              iconExpand: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('Expand all')}`,
                default: iconExpand,
              },
              iconCollapse: {
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                title: `${t('Button icon')} - ${t('Collapse all')}`,
                default: iconCollapse,
              },
              type: {
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                title: t('Button background color'),
                default: fieldSchema?.['x-component-props']?.type || 'default',
                enum: [
                  { value: 'default', label: '{{t("Default")}}' },
                  { value: 'primary', label: '{{t("Highlight")}}' },
                  { value: 'danger', label: '{{t("Danger red")}}' },
                  { value: 'text', label: '文本' },
                  { value: 'link', label: '链接' }
                ],
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
                ]
              }
            },
          } as ISchema
        }
        onSubmit={({ titleExpand, titleCollapse, iconExpand, iconCollapse, type, size }) => {
          fieldSchema.title = t('Expand/Collapse');
          field.title = t('Expand/Collapse');
          field.componentProps.icon = iconExpand;
          field.componentProps.type = type;
          field.componentProps.size = size;
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            titleExpand,
            titleCollapse,
            iconExpand,
            iconCollapse,
            type,
            size
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
      <SchemaSettings.Divider />
      <SchemaSettings.Remove
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
