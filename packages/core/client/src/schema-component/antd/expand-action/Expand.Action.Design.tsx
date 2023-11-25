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
      <SchemaSettings.ButtonEditor />
      <SchemaSettings.ModalItem
        title={t('展开收缩按钮设置')}
        schema={
          {
            type: 'object',
            title: t('展开收缩按钮设置'),
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
            },
          } as ISchema
        }
        onSubmit={({ titleExpand, titleCollapse, iconExpand, iconCollapse, type, size }) => {
          fieldSchema.title = t('Expand/Collapse');
          field.title = t('Expand/Collapse');
          field.componentProps.icon = iconExpand;
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            titleExpand,
            titleCollapse,
            iconExpand,
            iconCollapse
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
      <SchemaSettings.ActionScopeBind />
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
