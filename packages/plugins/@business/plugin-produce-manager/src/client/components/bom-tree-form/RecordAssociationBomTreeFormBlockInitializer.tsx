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
export const RecordAssociationBomTreeFormBlockInitializer = () => {
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
    'x-decorator': 'BomTreeForm.Provider',
    'x-acl-action': `${resource || collection}:list`,
    'x-decorator-props': {
      collection,
      resource: resource || collection,
      action: 'list',
      params: {
        // pageSize,
        tree: true,
        paginate: false,
        sort: ["bom_code"]
      },
      rowKey,
      showIndex: true,
      dragSort: false,
      disableTemplate: disableTemplate ?? false,
      blockType,
      ...others,
    },
    'x-component': 'BomTreeForm',
    'x-designer': 'BomTreeForm.Designer',
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
      content: {
        type: 'object',
        'x-decorator': 'BomTreeForm.Content',
        'x-decorator-props': {},
        // 'x-settings': 'TreeFormContentSettings',
        properties: {
          tree: {
            type: 'array',
            'x-decorator': 'CardItem',
            'x-component': 'BomTreeForm.Tree',
            properties: {
              recordActions: {
                type: 'void',
                title: '{{ t("Actions") }}',
                'x-component': 'ActionBar',
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
          table: createTableBlockSchema({
            collection:'bom_wl',
            resource:'prj.bomMaterials',
            association:'prj.bomMaterials',
            action:'list',
            className:'bom_wl_table',
            actionVisible:false
          }),
          countTable: createTableBlockSchema({
            collection:'bom_count_wl',
            resource:'prj.bom_wl_count',
            association:'prj.bom_wl_count',
            action:'list',
            className:'bom_count_wl_table',
            actionVisible:false
          }),
          detail: {
            type: 'void',
            'x-initializer': 'RecordBlockInitializers',
            'x-decorator': 'BomTreeForm.Form',
            'x-decorator-props': {
              useProps: '{{ useBomTreeFormFormBlockProps }}',
            },
            'x-component': 'Grid',
            'x-reactions': [
              {
                dependencies: ['.tree'],
                fulfill: {
                  state: {
                    visible: '{{ $deps[0] && ($deps[0].length !== 0) }}',
                    value: '{{ $deps[0]?.[0] }}',
                  },
                },
              },
            ],
          },
          form: {
            type: 'void',
            'x-initializer': 'CreateFormBlockInitializers',
            'x-decorator': 'BomTreeForm.Form',
            'x-decorator-props': {
              useProps: '{{ useBomTreeFormFormBlockProps }}',
            },
            'x-component': 'Grid',
            'x-reactions': [
              {
                dependencies: ['.tree'],
                fulfill: {
                  state: {
                    visible: '{{ $deps[0] && ($deps[0].length !== 0) }}',
                    value: '{{ $deps[0]?.[0] }}',
                  },
                },
              },
            ],
          }
        },
      },
    },
  };
};



