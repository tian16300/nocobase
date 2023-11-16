import { uid } from '@nocobase/utils';

export default (collection) => {
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [uid()]: {
            type: 'void',
            'x-decorator': 'FilterFormBlockProvider',
            'x-decorator-props': {
              resource: collection,
              collection: collection,
            },
            'x-designer': 'FormV2.FilterDesigner',
            'x-component': 'CardItem',
            'x-filter-targets': [],
            'x-filter-operators': {},
            properties: {
              [uid()]: {
                type: 'void',
                'x-component': 'FormV2',
                'x-component-props': {
                  layout: 'inline',
                  useProps: '{{ useFormBlockProps }}',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'FilterFormItemInitializers',
                    properties: {},
                  },
                  actions: {
                    type: 'void',
                    'x-initializer': 'FilterFormActionInitializers',
                    'x-component': 'ActionBar',
                    'x-component-props': {
                      layout: 'one-column',
                      style: {
                        float: 'right',
                      },
                    },
                    properties: {
                        submit:{
                            "title": "{{ t(\"Filter\") }}",
                            "x-action": "submit",
                            "x-component": "Action",
                            "x-designer": "Action.Designer",
                            "x-component-props": {
                                "type": "primary",
                                "useProps": "{{ useFilterBlockActionProps }}"
                            },
                            "x-action-settings": {},
                            "type": "void",
                            'x-hidden': true
                        }                        
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
