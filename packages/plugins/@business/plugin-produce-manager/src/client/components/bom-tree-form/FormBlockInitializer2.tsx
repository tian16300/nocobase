import { FormOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, createFormBlockSchema, useBlockAssociationContext, useCollection, useRecordCollectionDataSourceItems, useSchemaInitializer, useSchemaInitializerItem, useSchemaTemplateManager } from '@nocobase/client';
import React from 'react';


export const FormBlockInitializer2 = () => {
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
              association,
              collection: collection.name,
              action: 'get',
              useSourceId: '{{ useSourceIdFromParentRecord }}',
              useParams: '{{ useParamsFromRecord }}',
              actionInitializers: 'UpdateFormActionInitializers',
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
              association,
              collection: collection.name,
              action: 'get',
              useSourceId: '{{ useSourceIdFromParentRecord }}',
              useParams: '{{ useParamsFromRecord }}',
              actionInitializers: 'UpdateFormActionInitializers',
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('FormItem', null, collection?.name)}
    />
  );
};
