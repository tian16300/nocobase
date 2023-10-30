import React, { useRef } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { Button, Input, InputProps, InputRef, Select, Space } from 'antd';
import { useDesignable } from '../schema-component';
import { SchemaSettings } from '../schema-settings';

interface Options {
  openMode?: boolean;
  openSize?: boolean;
}
export const OpenModeSchemaItems: React.FC<Options> = (options) => {
  const { openMode = true, openSize = true } = options;
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const openModeValue = fieldSchema?.['x-component-props']?.['openMode'] || 'drawer';
  const toRef = useRef<InputRef>();

  return (
    <>
      {openMode ? (
        <SchemaSettings.SelectItem
          title={t('Open mode')}
          options={[
            { label: t('Drawer'), value: 'drawer' },
            { label: t('Dialog'), value: 'modal' },
            { label: t('链接'), value: 'link' },
          ]}
          value={openModeValue}
          onChange={(value) => {
            field.componentProps.openMode = value;
            const schema = {
              'x-uid': fieldSchema['x-uid'],
            };
            schema['x-component-props'] = fieldSchema['x-component-props'] || {};
            schema['x-component-props'].openMode = value;
            fieldSchema['x-component-props'].openMode = value;
            // when openMode change, set openSize value to default
            Reflect.deleteProperty(fieldSchema['x-component-props'], 'openSize');
            if (value == 'link') {
              schema['x-component-props']['component'] = 'RecordLink';
            } else {
              Reflect.deleteProperty(field.componentProps, 'component');
              Reflect.deleteProperty(fieldSchema['x-component-props'], 'component');
            }
            dn.emit('patch', {
              schema: schema,
            });
            dn.refresh();
          }}
        />
      ) : null}
      {openSize && ['modal', 'drawer'].includes(openModeValue) ? (
        <SchemaSettings.Item title="Popup size">
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
                const schema = {
                  'x-uid': fieldSchema['x-uid'],
                };
                schema['x-component-props'] = fieldSchema['x-component-props'] || {};
                schema['x-component-props'].openSize = value;
                fieldSchema['x-component-props'].openSize = value;
                dn.emit('patch', {
                  schema: schema,
                });
                dn.refresh();
              }}
              style={{ textAlign: 'right', minWidth: 100 }}
            />
          </div>
        </SchemaSettings.Item>
      ) : null}
      {['link'].includes(openModeValue) ? (
        <SchemaSettings.Item>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            {/* {t('链接地址')} */}
            <Space.Compact size="middle" style={{ width: '400px' }}>
              <Input ref={toRef} placeholder="链接地址..." defaultValue={fieldSchema?.['x-component-props']?.['to']} />
              <Button
                type="primary"
                onClick={() => {
                  const value = toRef.current.input.value;
                  field.componentProps.to = value;
                  const schema = {
                    'x-uid': fieldSchema['x-uid'],
                  };
                  schema['x-component-props'] = fieldSchema['x-component-props'] || {};
                  schema['x-component-props'].to = value;
                  fieldSchema['x-component-props'].to = value;
                  dn.emit('patch', {
                    schema: schema,
                  });
                  dn.refresh();
                }}
              >
                确定
              </Button>
            </Space.Compact>
          </div>
        </SchemaSettings.Item>
      ) : null}
    </>
  );
};
