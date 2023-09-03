import { defaultProps, operators } from './properties';
import { IField } from './types';

export const color: IField = {
  name: 'color',
  type: 'object',
  group: 'basic',
  order: 10,
  title: '{{t("Color")}}',
  default: {
    type: 'string',
    uiSchema: {
      type: 'string',
      'x-component': 'ColorSelect',
      'x-component': 'ColorSelect',
      default: '#1677FF',
    },
  },
  availableTypes: ['string'],
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    'uiSchema.x-component': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        {
          label: '自定义颜色',
          value: 'ColorPicker',
        },
        {
          label: '颜色选择',
          value: 'ColorSelect',
        },
      ],
    },
  },
  filterable: {
    operators: operators.string,
  },
};
