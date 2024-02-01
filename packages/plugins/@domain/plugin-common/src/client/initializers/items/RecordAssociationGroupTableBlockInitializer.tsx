import React, { useContext } from 'react';
import { TableOutlined } from '@ant-design/icons';
import {
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaInitializerItem,
  css,
  useCollectionManager,
  useGlobalTheme,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { ArrayItems, FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import { createGroupTableSchema } from '../../utils';
export const RecordAssociationGroupTableBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { getCollection, getCollectionFields, getCollectionField } = useCollectionManager();
  const field = itemConfig.field;
  const collection = getCollection(field.target);
  const resource = `${field.collectionName}.${field.name}`;
  const fields = getCollectionFields(collection.name);
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();

  const groupFields = fields
    .filter((field) => {
      return ['m2o', 'm2m'].includes(field.interface);
    })
    .map((field) => {
      return {
        label: t(field?.uiSchema?.title),
        value: field.name,
      };
    });
    
  return (
    <SchemaInitializerItem
      icon={<TableOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          const values = await FormDialog(
            t('创建分组表格区块'),
            () => {
              return (
                <SchemaComponentOptions scope={options.scope} components={{ ...options.components, ArrayItems }}>
                  <FormLayout
                    layout={'vertical'}
                    className={css`
                      .columnActions-item,
                      .fields-array-items {
                        .ant-formily-item-feedback-layout-loose {
                          margin-bottom: 8px;
                        }
                      }
                      .fields-array-items {
                        > .ant-formily-item-control {
                          max-height: 600px;
                          overflow: auto;
                        }
                      }
                    `}
                  >
                    <SchemaComponent
                      schema={{
                        properties: {
                          group: {
                            title: '分组字段',
                            enum: groupFields,
                            required: true,
                            'x-component': 'Select',
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
            initialValues: {
              group: '',
            },
          });
          const groupCollection = getCollectionField(`${collection.name}.${values.group}`)?.target;
          const groupAssociation = getCollectionFields(field.collectionName).filter((field) => {
            return field?.target === groupCollection
          })?.[0];
          const _groupResource = `${field.collectionName}.${groupAssociation?.name}`;
          insert(
            createGroupTableSchema({
              collection: field.target,
              groupCollection,
              ...values,   
              groupResource:{
                collection: groupCollection,
                resource: _groupResource,
                association: _groupResource
              },
              tableResource:{
                rowKey: collection.filterTargetKey,
                collection: field.target,
                resource,
                association: resource
              }
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('Group Table', itemConfig, field.target, resource)}
    />
  );
};
