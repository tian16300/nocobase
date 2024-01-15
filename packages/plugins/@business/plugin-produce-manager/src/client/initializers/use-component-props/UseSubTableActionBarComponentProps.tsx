import type { ISchema } from '@formily/react';
import {
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  css,
  useCollection,
  useCollectionManager,
  useGlobalTheme,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import React, { useContext } from 'react';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
export const UseSubTableActionBarComponentProps = () => {
  //   const itemConfig = useSchemaInitializerItem();
  const { t } = useTranslation();
  const { insert } = useSchemaInitializer();
  const { name } = useCollection();
  const { getCollectionFields } = useCollectionManager();
  const { theme } = useGlobalTheme();
  const fields = getCollectionFields(name)
    .filter((field) => {
      return ['o2m', 'm2m'].includes(field?.interface);
    })
    ?.map((field) => {
      return {
        label: field?.uiSchema?.title,
        value: [name, field.name].join('.'),
        uiSchema: {
          ...field.uiSchema,
          name: field.name,
        },
        interface: field.interface
      };
    });
  const options = useContext(SchemaOptionsContext);
  const createSchema = (collectionField) => {
    const schema: ISchema = {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-designer': 'FormItem.Designer',
      'x-component': 'SubTableActionBarProvider',
      'x-component-props': {
        collectionField: collectionField
      },
      properties: {
        actions: {
          type: 'void',
          'x-initializer': 'SubTableActionInitializers',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {},
          },
          properties: {}
        },
      },
    };
    return schema;
  };
  return {
    titlle: '子表操作栏',
    async onClick() {
      const values = await FormDialog(
        t('添加子表导入'),
        () => {
          return (
            <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
              <FormLayout layout={'vertical'}>
                <SchemaComponent
                  schema={{
                    properties: {
                      field: {
                        title: t('选择子表字段'),
                        enum: fields,
                        required: true,
                        'x-component': 'Select',
                        'x-component-props': {
                          fieldNames: { label: 'label', value: 'value' },
                        },
                        'x-decorator': 'FormItem',
                      },
                    },
                  }}
                />
              </FormLayout>
            </SchemaComponentOptions>
          );
        },
        theme,
      ).open({
        initialValues: {},
      });
      insert(createSchema(values.field));
    },
  };
};
