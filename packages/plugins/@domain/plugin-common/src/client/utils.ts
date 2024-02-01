import { uid } from '@formily/shared';
export const createGroupTableSchema = (decoratorProps) => {
  const { collection, group,
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
    groupCollection,
    grouResource,
    tableResource,
    ...others
  } = decoratorProps;
  return {
    type: 'void',
    'x-acl-action': `${collection}:list`,
    'x-decorator': 'GroupTable.Decorator',
    'x-decorator-props': {
      ...decoratorProps,
    },
    'x-designer': 'GroupTable.Designer',
    'x-component': 'GroupTable.Wrap',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'GroupTable',
        'x-component-props': {
          useProps: '{{ useGroupTableProps }}',
        },
        properties: {
          group: {
            type: 'string',
            'x-component': 'GroupTable.GroupTree',
            'x-decorator':'TableBlockProvider',
            'x-decorator-props': {
              collection:`${groupCollection}`,
              resource: `${groupCollection}`,
              action: 'list',
              params: {
                paginate: false
              },
              fixedBlock:false,
              ...grouResource
            },
            'x-designer':'GroupTable.GroupTreeDesigner',
            properties: {
              actions: {
                type: 'void',
                'x-initializer': 'TableActionInitializers',
                'x-component': 'ActionBar',
                'x-component-props': {
                  spaceProps: {
                    gap: 4,
                  },
                },
                properties: {},
              },
              recordActions: {
                type: 'void',
                title: '{{ t("Actions") }}',
                'x-decorator': 'GroupTable.GroupRecordActionBar',
                'x-component': 'ActionBar',
                'x-designer': 'GroupTable.GroupRecordActionDesigner',
                'x-initializer': 'GroupTableGroupRecordActionInitializers',
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
            "x-filter-targets": []
          },
          table:{
            type:'void',
            'x-decorator': 'TableBlockProvider',
            'x-acl-action': `${resource || collection}:list`,
            'x-decorator-props': {
              collection,
              resource: resource || collection,
              action: 'list',
              params: {
                pageSize
              },
              rowKey,
              showIndex: true,
              dragSort: false,
              disableTemplate: disableTemplate ?? false,
              blockType,
              fixedBlock:false,
              ...tableResource
            },
            'x-designer': TableBlockDesigner ?? 'TableBlockDesigner',
            'x-component': 'CardItem',
            properties:{
              actions: {
                type: 'void',
                'x-initializer': tableActionInitializers ?? 'TableActionInitializers',
                'x-component': 'ActionBar',
                'x-component-props': {
                  style: {
                    marginBottom: 'var(--nb-spacing)',
                  },
                },
                properties: {},
              },
              [uid()]: {
                type: 'array',
                'x-initializer': 'TableColumnInitializers',
                'x-component': 'TableV2',
                'x-component-props': {
                  rowKey: 'id',
                  rowSelection: {
                    type: 'checkbox',
                  },
                  useProps: '{{ useGroupTableBlockProps }}',
                },
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
    
              }
            }
          }
        },
      },
    },
  };
};
