import { ISchema } from '@formily/react';
import { defaultProps, operators } from './properties';
import { IField } from './types';

export const checkbox: IField = {
  name: 'checkbox',
  type: 'object',
  group: 'choices',
  order: 1,
  title: '{{t("Checkbox")}}',
  availableTypes: ['boolean'],
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    'uiSchema.x-component': {
      type: 'string',
      'title':'展示形式',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        {
          label: '{{t("Checkbox")}}',
          value: 'Checkbox',
        },
        { label: '{{t("Switch")}}', value: 'Switch' },
      ],
      default: 'Checkbox',
    },
  },  
  default: {
    type: 'boolean',
    // name,
    uiSchema: {
      type: 'boolean',
      'x-component': 'Checkbox',

    }
  },
  filterable: {
    operators: operators.boolean,
  },
  schemaInitialize(schema: ISchema, { block }) {
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'] = schema['x-component-props'] || {};
      schema['x-component-props']['ellipsis'] = true;
    }
  },
};
