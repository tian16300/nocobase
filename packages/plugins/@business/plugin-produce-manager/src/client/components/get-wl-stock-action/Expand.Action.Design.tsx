import { ISchema, useField, useFieldSchema, useForm } from '@formily/react';
import { GeneralSchemaDesigner, SchemaSettingsButtonEditor, SchemaSettingsDivider, SchemaSettingsModalItem, SchemaSettingsRemove, useCollection, useCollectionManager, useDesignable } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';


export const GetWlStockActionDesign = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { titleExpand, titleCollapse, iconExpand, iconCollapse } = fieldSchema['x-component-props'] || {};
  const { name, title } = useCollection();
  const { getCollectionFields } = useCollectionManager();
  const fields = getCollectionFields(name);
  const targetFields = fields
    .filter((field) => {
      return ['o2m','m2m'].includes(field.interface);
    })
    .map((item) => {
      return { label: item?.uiSchema?.title, value: item.name };
    });

  return (
    <GeneralSchemaDesigner {...props} disableInitializer>
      <SchemaSettingsButtonEditor />
      <SchemaSettingsModalItem
        title={t('设置')}
        schema={
          {
            type: 'object',
            title: t('设置'),
            properties: {
              targetField:{
                type: 'string',
                title: '目标字段',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: targetFields,
                default: fieldSchema['x-component-props']?.targetField
              }
            },
          } as ISchema
        }
        onSubmit={({ targetField }) => {
          field.componentProps.targetField = targetField;
          fieldSchema['x-component-props'] = {
            ...(fieldSchema['x-component-props'] || {}),
            targetField
          };
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              'x-component-props': fieldSchema['x-component-props']
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
