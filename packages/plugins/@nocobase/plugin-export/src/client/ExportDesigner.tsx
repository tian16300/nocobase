import { ArrayItems } from '@formily/antd-v5';
import type { ISchema } from '@formily/react';
import { useField, useFieldSchema } from '@formily/react';
import {
  GeneralSchemaDesigner,
  SchemaSettingsActionModalItem,
  SchemaSettingsButtonEditor,
  SchemaSettingsDivider,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
  useDesignable,
} from '@nocobase/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShared } from './useShared';

export const ExportDesigner = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const [schema, setSchema] = useState<ISchema>();
  const { schema: pageSchema } = useShared();

  useEffect(() => {
    setSchema(pageSchema);
  }, [field.address, fieldSchema?.['x-action-settings']?.['exportSettings']]);

  return (
    <GeneralSchemaDesigner disableInitializer>
      <SchemaSettingsButtonEditor />
      <SchemaSettingsActionModalItem
        title={t('Exportable fields')}
        schema={schema}
        initialValues={{ exportSettings: fieldSchema?.['x-action-settings']?.exportSettings }}
        components={{ ArrayItems }}
        onSubmit={({ exportSettings }) => {
          fieldSchema['x-action-settings']['exportSettings'] = exportSettings
            ?.filter((fieldItem) => fieldItem?.dataIndex?.length)
            .map((item) => ({
              dataIndex: item.dataIndex.map((di) => di.name ?? di),
              title: item.title,
            }));

          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-action-settings': fieldSchema['x-action-settings'],
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
