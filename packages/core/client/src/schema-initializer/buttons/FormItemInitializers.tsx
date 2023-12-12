import React from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaInitializerChildren } from '../../application';
import { SchemaInitializer } from '../../application/schema-initializer/SchemaInitializer';
import { useCompile } from '../../schema-component';
import {
  gridRowColWrap,
  useAssociatedFormItemInitializerFields,
  useFilterAssociatedFormItemInitializerFields,
  useFilterFormItemInitializerFields,
  useFilterInheritsFormItemInitializerFields,
  useFormItemInitializerFields,
  useInheritsFormItemInitializerFields,
} from '../utils';
const ParentCollectionFields = () => {
  const inheritFields = useInheritsFormItemInitializerFields();
  const { t } = useTranslation();
  const compile = useCompile();
  if (!inheritFields?.length) return null;
  const res = [];
  inheritFields.forEach((inherit) => {
    Object.values(inherit)[0].length &&
      res.push({
        type: 'itemGroup',
        divider: true,
        title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
        children: Object.values(inherit)[0],
      });
  });
  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

const AssociatedFields = () => {
  const associationFields = useAssociatedFormItemInitializerFields({
    readPretty: true,
    block: 'Form',
  });
  const { t } = useTranslation();
  if (associationFields.length === 0) return null;
  const schema: any = [
    {
      type: 'itemGroup',
      title: t('Display association fields'),
      children: associationFields,
    },
  ];
  return <SchemaInitializerChildren>{schema}</SchemaInitializerChildren>;
};

// 表单里配置字段
export const formItemInitializers = new SchemaInitializer({
  name: 'FormItemInitializers',
  wrap: gridRowColWrap,
  icon: 'SettingOutlined',
  title: '{{t("Configure fields")}}',
  items: [
    {
      type: 'itemGroup',
      name: 'displayFields',
      title: '{{t("Display fields")}}',
      useChildren: useFormItemInitializerFields,
    },
    {
      name: 'parentCollectionFields',
      Component: ParentCollectionFields,
    },
    {
      name: 'associationFields',
      Component: AssociatedFields,
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      
      title: '批量选择',
      name:'dataBlockSelectorAction',
      Component: 'DataBlockSelectorAction.Initializer',
      schema: {
        type: 'void',
        title: `批量选择`,
        'x-decorator': 'FormItem',
        'x-designer': 'FormItem.Designer',
        'x-component': 'DataBlockSelectorAction',
        properties: {
          selector: {
            type: 'void',
            title: '{{ t("Select record") }}',
            'x-component': 'RecordPicker.Selector',
            'x-component-props': {
              className: 'nb-record-picker-selector',
            },
            properties: {
              grid: {
                type: 'void',
                'x-component': 'Grid',
                'x-initializer': 'TableSelectorInitializers',
              },
              footer: {
                'x-component': 'Action.Container.Footer',
                'x-component-props': {},
                properties: {
                  actions: {
                    type: 'void',
                    'x-component': 'ActionBar',
                    'x-component-props': {},
                    properties: {
                      submit: {
                        title: '{{ t("Submit") }}',
                        'x-action': 'submit',
                        'x-component': 'Action',
                        'x-component-props': {
                          type: 'primary',
                          htmlType: 'submit',
                          useProps: '{{ useDataBlockSelectorProps }}',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },    
    {
      type: 'item',
      title: '{{t("按钮操作")}}',
      name:'customizeAction',
      Component: 'CustomizeActionInitializer',
      schema: {
        type: 'void',
        title: '{{ t("按钮操作") }}',
        'x-component': 'Action',
        'x-designer': 'FormItem.Designer',
        'x-component-props': {
        },
      },
    },
    {
      name: 'addText',
      title: '{{t("Add text")}}',
      Component: 'BlockInitializer',
      schema: {
        type: 'void',
        'x-editable': false,
        'x-decorator': 'FormItem',
        'x-designer': 'Markdown.Void.Designer',
        'x-component': 'Markdown.Void',
        'x-component-props': {
          content: '{{t("This is a demo text, **supports Markdown syntax**.")}}',
        },
      },
    },
  ],
});

export const FilterParentCollectionFields = () => {
  const inheritFields = useFilterInheritsFormItemInitializerFields();
  const { t } = useTranslation();
  const compile = useCompile();
  const res = [];
  if (inheritFields?.length > 0) {
    inheritFields.forEach((inherit) => {
      Object.values(inherit)[0].length &&
        res.push({
          divider: true,
          type: 'itemGroup',
          title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
          children: Object.values(inherit)[0],
        });
    });
  }

  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

export const FilterAssociatedFields = () => {
  const associationFields = useFilterAssociatedFormItemInitializerFields();
  const { t } = useTranslation();
  const res: any[] = [
    {
      type: 'itemGroup',
      title: t('Display association fields'),
      children: associationFields,
    },
  ];
  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

export const filterFormItemInitializers = new SchemaInitializer({
  name: 'FilterFormItemInitializers',
  wrap: gridRowColWrap,
  icon: 'SettingOutlined',
  title: '{{t("Configure fields")}}',
  items: [
    {
      type: 'itemGroup',
      name: 'displayFields',
      title: '{{t("Display fields")}}',
      useChildren: useFilterFormItemInitializerFields,
    },
    {
      name: 'parentCollectionFields',
      Component: FilterParentCollectionFields,
    },
    {
      name: 'associationFields',
      Component: FilterAssociatedFields,
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      title: '{{t("Add text")}}',
      Component: 'BlockItemInitializer',
      name: 'addText',
      schema: {
        type: 'void',
        'x-editable': false,
        'x-decorator': 'FormItem',
        'x-designer': 'Markdown.Void.Designer',
        'x-component': 'Markdown.Void',
        'x-component-props': {
          content: '{{t("This is a demo text, **supports Markdown syntax**.")}}',
        },
      },
    },
  ],
});
