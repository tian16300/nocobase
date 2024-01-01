import {
  SchemaInitializerItem,
  createTableBlockSchema,
  useCollection,
  useCollectionManager,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@nocobase/client';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
export const RecordAssociationTreeFormBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { getCollection } = useCollectionManager();
  const field = itemConfig.field;
  const collection = getCollection(field.target);
  const { name } = useCollection();
  const pCollection = name;
  const resource = `${field.collectionName}.${field.name}`;
  return (
    <SchemaInitializerItem
      icon={<FormOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          insert(
            createShema({
              rowKey: collection.filterTargetKey,
              collection: field.target,
              resource,
              association: resource,
              pCollection,
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('BomTree', itemConfig, field.target, resource)}
    />
  );
};
const createShema = (options) => {
  const {
    collection,
    resource,
    rowKey,
    tableActionInitializers,
    tableColumnInitializers,
    tableActionColumnInitializers,
    tableBlockProvider,
    disableTemplate,
    TableBlockDesigner,
    blockType,
    pageSize = 20,
    ...others
  } = options;

  return {
    type: 'void',
    'x-decorator': 'TreeFormBlockProvider',
    'x-acl-action': `${resource || collection}:list`,
    'x-decorator-props': {
      collection,
      resource: resource || collection,
      action: 'list',
      params: {
        // pageSize,
        pagination: false
      },
      rowKey,
      showIndex: true,
      dragSort: false,
      disableTemplate: disableTemplate ?? false,
      blockType,
      ...others,
    },
    'x-component': 'TreeForm',
    'x-designer': 'TreeFormBlockDesigner',
    properties: {
      toolBar: {
        type: 'void',
        'x-initializer': 'TableActionInitializers',
        'x-component': 'ActionBar',
        'x-component-props': {
          style: {
            marginBottom: 'var(--nb-spacing)',
          },
        },
        properties: {},
      },
      content:{
        type: 'object',
        'x-decorator': 'TreeForm.Content',
        'x-decorator-props':{ },
        'x-settings': 'TreeFormContentSettings',
        properties: {
          tree:{
             type:'string',
             'x-decorator': 'CardItem',
             'x-component':'TreeForm.Tree'
          },
          table:{
            type:'array',
            'x-initializer': 'TableColumnInitializers',
            'x-component': 'TableV2',
            'x-component-props': {
              rowKey: 'id',
              rowSelection: {
                type: 'checkbox',
              },
              useProps: '{{ useTableBlockProps }}',
            },
            'reactions':[{
              dependencies: ['.tree'],
              fulfill: {
                state: {
                  visible: '{{ !$deps[0] || ($deps[0] == "") }}',
                },
              },
            }],
            properties: {
              actions: {
                type: 'void',
                title: '{{ t("Actions") }}',
                'x-action-column': 'actions',
                'x-decorator': 'TableV2.Column.ActionBar',
                'x-component': 'TableV2.Column',
                'x-designer': 'TableV2.ActionColumnDesigner',
                'x-initializer': 'TableActionColumnInitializers',
                properties: {
                  actions: {
                    type: 'void',
                    'x-decorator': 'DndContext',
                    'x-component': 'Space',
                    'x-component-props': {
                      split: '',
                    },
                    properties: {},
                  },
                },
              },
            },
          },
          form:{
            'x-initializer': 'RecordBlockInitializers',
            'x-component': 'Grid',
            'reactions':[{
              dependencies: ['.tree'],
              fulfill: {
                state: {
                  visible: '{{ $deps[0] && ($deps[0] !== "") }}',
                },
              },
            }]
          }
        },
      },
    },
  };
};
