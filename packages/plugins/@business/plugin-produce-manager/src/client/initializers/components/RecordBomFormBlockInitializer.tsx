import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useBlockAssociationContext, useCollection, useRecordCollectionDataSourceItems, useSchemaInitializer, useSchemaInitializerItem, useSchemaTemplateManager } from '@nocobase/client';
export const RecordBomFormBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { onCreateBlockSchema, componentType, createBlockSchema, targetCollection, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const currentCollection = useCollection();
  const collection = targetCollection || currentCollection;
  const association = useBlockAssociationContext();
  return (
    <SchemaInitializerItem
      icon={<FormOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          if (item.template.componentName === 'FormItem') {
            const blockSchema = createFormBlockSchema({
              // association,
              collection: collection.name,
              // action: 'get',
              // useSourceId: '{{ useSourceIdFromParentRecord }}',
              // useParams: '{{ useParamsFromRecord }}',
              actionInitializers: 'CreateFormActionInitializers',
              template: s,
            });
            if (item.mode === 'reference') {
              blockSchema['x-template-key'] = item.template.key;
            }
            insert(blockSchema);
          } else {
            insert(s);
          }
        } else {
          insert(
            createFormBlockSchema({
              // association,
              collection: collection.name,
              // action: 'get',
              // useSourceId: '{{ useSourceIdFromParentRecord }}',
              // useParams: '{{ useParamsFromRecord }}',
              actionInitializers: 'CreateFormActionInitializers',
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('FormItem')}
    />
  );
};
import { Field, Form } from '@formily/core';
import { ISchema, Schema, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@nocobase/utils';
const createFormBlockSchema = (options) => {
  const {
    formItemInitializers = 'FormItemInitializers',
    actionInitializers = 'FormActionInitializers',
    collection,
    resource,
    association,
    action,
    actions = {},
    'x-designer': designer = 'FormV2.Designer',
    template,
    title,
    cardStyle,
    ...others
  } = options;
  const resourceName = resource || association || collection;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action-props': {
      skipScopeCheck: !action,
    },
    'x-acl-action': action ? `${resourceName}:update` : `${resourceName}:create`,
    'x-decorator': 'BomFormBlockProvider',
    'x-decorator-props': {
      // ...others,
      // action,
      resource: resourceName,
      collection,
      // association,
      // action: 'get',
      // useParams: '{{ useParamsFromRecord }}',
    },
    'x-designer': designer,
    'x-component': 'CardItem',
    'x-component-props': {
      title,
      ...cardStyle
    },
    properties: {
      [uid()]: 
      {
        type: 'void',
        'x-decorator': 'CardItem',
        'x-component': 'FormV2',
        'x-component-props': {
          useProps: '{{ useFormBlockProps }}',
        },
        properties: {
          grid: template || {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': formItemInitializers,
            properties: {},
          },
          actions: {
            type: 'void',
            'x-initializer': actionInitializers,
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                marginTop: 24,
              },
            },
            properties: actions,
          },
        },

      },
    },
  };
  return schema;
};
