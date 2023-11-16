import { uid } from '@nocobase/utils';
import formSchema from './formSchema';

export const createSchema = (props) => {
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
    ...others
  } = props;
  return {
    type: 'array',
    'x-acl-action': `${collection}:list`,
    'x-decorator': 'TreeForm.Decorator',
    'x-decorator-props': {
      collection: `${collection}`,
      resource: `${collection}`,
      action: 'list',
      params: {
        paginate: false,
      },
      name: 'tree-form',
    },
    'x-designer': 'TreeForm.Designer',
    'x-component': 'TreeForm.Main',
    'x-component-props': {
      useProps: '{{ useTreeFormBlockProps }}',
    },
    properties: {
      filterForm:formSchema(collection),
      actions: {
        type: 'void',
        'x-initializer': 'GroupTableGroupActionInitializers',
        'x-component': 'ActionBar',
        'x-component-props': {
          spaceProps: {
            gap: 4,
          },
        },
        properties: {
         
        },
      },
      recordActions: {
        type: 'void',
        title: '{{ t("Actions") }}',
        'x-component': 'ActionBar',
        'x-designer': 'GroupTable.GroupRecordActionDesigner',
        properties: {
          actions: {
            type: 'void',
            'x-decorator': 'DndContext',
            'x-component': 'Space',
            'x-component-props': {
              split: '',
            },
            properties: {
              add: {
                title: '添加',
                'x-action': 'create',
                'x-designer': 'Action.Designer',
                'x-component': 'Action',
                'x-visible': '{{treeTable}}',
                'x-component-props': {
                  icon: 'pluscircleoutlined',
                  type: 'link',
                  size: 'small',
                  addChild: true,
                  useProps: '{{ useTreeFormAddChildActionProps }}',
                },
              },
              delete: {
                title: '{{ t("Delete") }}',
                'x-action': 'destroy',
                'x-component': 'Action',
                'x-designer': 'Action.Designer',
                'x-component-props': {
                  icon: 'DeleteOutlined',
                  type: 'link',
                  size: 'small',
                  confirm: {
                    title: "{{t('Delete record')}}",
                    content: "{{t('Are you sure you want to delete it?')}}",
                  },
                  useProps: '{{ useDestroyActionProps }}',
                },
              },
            },
          },
        },
      },
      form: {
        type: 'void',
        properties: {
          add: {
            type: 'void',
            'x-acl-action-props': {
              skipScopeCheck: false,
            },
            'x-acl-action': `${collection}:create`,
            'x-decorator': 'FormBlockProvider',
            'x-decorator-props': {
              resource: collection,
              collection: collection,
              actionInitializers: 'CreateFormActionInitializers',
            },
            'x-designer': 'FormV2.Designer',
            'x-component': 'CardItem',
            'x-component-props': {
              //   title,
            },
            properties: {
              form: {
                type: 'void',
                'x-component': 'FormV2',
                'x-component-props': {
                  useProps: '{{ useFormBlockProps }}',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'FormItemInitializers',
                    properties: {},
                  },
                  actions: {
                    type: 'void',
                    'x-initializer': 'CreateFormActionInitializers',
                    'x-component': 'ActionBar',
                    'x-component-props': {
                      layout: 'one-column',
                      style: {
                        marginTop: 24,
                      },
                    },
                    properties: {},
                  },
                },
              },
            }
          },
          update: {
            type: 'void',
            'x-acl-action-props': {
              skipScopeCheck: false,
            },
            'x-acl-action': `${collection}:update`,
            'x-decorator': 'FormBlockProvider',
            'x-decorator-props': {
              action: 'get',
              resource: collection,
              collection: collection,
              useParams: '{{ useParamsFromRecord }}',
              actionInitializers: 'UpdateFormActionInitializers',
            },
            'x-designer': 'FormV2.Designer',
            'x-component': 'CardItem',
            'x-component-props': {
              //   title,
            },
            properties: {
              form: {
                type: 'void',
                'x-component': 'FormV2',
                'x-component-props': {
                  useProps: '{{ useFormBlockProps }}',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'FormItemInitializers',
                    properties: {},
                  },
                  actions: {
                    type: 'void',
                    'x-initializer': 'UpdateFormActionInitializers',
                    'x-component': 'ActionBar',
                    'x-component-props': {
                      layout: 'one-column',
                      style: {
                        marginTop: 24,
                      },
                    },
                    properties: {},
                  },
                },
              },
            }
          },
        },
      },
    },
  };
};
