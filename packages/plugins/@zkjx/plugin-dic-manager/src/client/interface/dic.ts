import { IField, interfacesProperties, operators } from '@nocobase/client';
import { ISchema } from '@formily/react';
const { defaultProps } = interfacesProperties;
const valueText = '{{($deps[0] && $deps[0]!=="")?{"$and":[{"dicCode":{"$eq":$deps[0]}}]}:{}}}';
export const dic: IField = {
  name: 'dic',
  type: 'object',
  group: 'advanced',
  order: 5,
  title: '数据字典',
  sortable: true,
  isAssociation: true,
  isForeignKey: true,
  default: {
    type: 'belongsTo',
    // "interface": "dic",
    target: 'dicItem',
    uiSchema: {
      type:'object',
      'x-component': 'AssociationField',
      'x-component-props': {
        multiple: false,
        fieldNames: {
          label: 'label',
          value: 'id',
          icon: 'icon',
          color: 'color',
        },
        service: {
          params: {
            filter: {},
          },
        },
      },
      "x-read-pretty": true
    },
  },
  availableTypes: ['belongsTo'],
  hasDefaultValue: false,
  properties: {
    ...defaultProps,
    dicCode: {
      type: 'string',
      title: '选择字典',
      'x-component': 'RemoteSelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        multiple: false,
        manual: false,
        fieldNames: {
          label: 'title',
          value: 'code'
        },
        service: {
          resource: 'dic',
          action: 'list'
        },
      }
    },
    'uiSchema.x-component-props.service.params.filter': {
      type: 'object',
      title: '过滤参数',
      'x-decorator': 'FormItem',
      'x-component': 'Input.JSON',
      'x-component-props': {
        rows: 5,
      },
      // 'x-display': false,
      'x-reactions': [
        {
          dependencies: ['dicCode'],
          fulfill: {
            state: {
              value: valueText,
            },
          },
        },
      ],
    },
    'uiSchema.x-component-props.multiple': {
      type: 'boolean',
      title: '{{t("Allow multiple")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: false,
    },
    grid: {
      type: 'void',
      'x-component': 'Grid',
      properties: {
        row1: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col12: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                foreignKey: {
                  type: 'string',
                  title: '{{t("Foreign key")}}',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-disabled': true,
                  'x-reactions': [
                    {
                      dependencies: ['name'],
                      fulfill: {
                        state: {
                          value: '{{$deps[0]+"_dicId"}}',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    defaultId: {
      'x-component': 'RemoteSelect',
      'x-decorator': 'FormItem',
      title: '默认值',
      'x-component-props': {
        multiple: false,
        manual: false,
        fieldNames: {
          label: 'label',
          value: 'id',
          icon: 'icon',
          color: 'color',
        },
        service: {
          resource: 'dicItem',
          action: 'list',
          params: {
            filter: {},
          },
        },
      },
      'x-reactions': [
        {
          dependencies: ['dicCode'],
          fulfill: {
            schema: {
              'x-component-props.service.params.filter': valueText,
            },
          },
        },
      ],
    }
    //TODO
    // ,
    // 'defaultValue': {
    //   type: 'object',
    //   title: '过滤参数',
    //   'x-decorator': ['FormItem'],
    //   'x-component': 'Input.JSON',
    //   'x-component-props': {
    //     rows: 5,
    //   },
    //   // 'x-display': false,
    //   'x-reactions': [
    //     {
    //       dependencies: ['defaultId'],
    //       fulfill: {
    //         // state: {
    //         //   value: '{{useGetDicItemById($deps[0])}}',
    //         // },
    //         run: '{{useGetDicItemById($self, $deps[0])}}'
    //       },
          
    //     },
    //   ],
    // },
  },
  filterable: {
    nested: true,
    // children: []
    // operators: operators.id,
  },
  schemaInitialize(schema: ISchema, { readPretty, block, targetCollection }) {
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'] = schema['x-component-props'] || {};
      schema['x-component-props']['ellipsis'] = true;
      schema['x-component-props']['mode'] = 'Tag';
      schema['x-component-props']['tagColorField'] = 'color';
      schema['x-component-props']['tagIconField'] = 'icon';
      // 预览文件时需要的参数
      schema['x-component-props']['size'] = 'small';
    }
    if (targetCollection?.titleField && schema['x-component-props']) {
      schema['x-component-props'].fieldNames = schema['x-component-props'].fieldNames || {
        label: 'label',
        value: 'id',
      };
      // schema['x-component-props'].fieldNames.label = targetCollection.titleField;
    }
  },
  invariable: true,
  titleUsable: true,
  sortName:(field)=>{
    return field.foreignKey;
  }
};
