import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCompile } from '../../schema-component';
import { SchemaInitializer } from '../SchemaInitializer';
import {
  gridRowColWrap,
  useAssociatedFormItemInitializerFields,
  useFilterAssociatedFormItemInitializerFields,
  useFilterFormItemInitializerFields,
  useFilterInheritsFormItemInitializerFields,
  useFormItemInitializerFields,
  useInheritsFormItemInitializerFields,
} from '../utils';

// 表单里配置字段
export const FormItemInitializers = (props: any) => {
  const { t } = useTranslation();
  const { insertPosition, component } = props;
  const associationFields = useAssociatedFormItemInitializerFields({
    readPretty: true,
    block: 'Form',
  });
  const inheritFields = useInheritsFormItemInitializerFields();
  const compile = useCompile();
  const fieldItems: any[] = [
    {
      type: 'itemGroup',
      title: t('Display fields'),
      children: useFormItemInitializerFields(),
    },
  ];
  if (inheritFields?.length > 0) {
    inheritFields.forEach((inherit) => {
      Object.values(inherit)[0].length &&
        fieldItems.push(
          {
            type: 'divider',
          },
          {
            type: 'itemGroup',
            title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
            children: Object.values(inherit)[0],
          },
        );
    });
  }
  associationFields.length > 0 &&
    fieldItems.push(
      {
        type: 'divider',
      },
      {
        type: 'itemGroup',
        title: t('Display association fields'),
        children: associationFields,
      },
    );

  fieldItems.push(
    {
      type: 'divider',
    },
    {
      type: 'item',
      title: '批量选择',
      component: 'DataBlockSelectorInitializer',
      schema: {
        title: '批量选择',
        type: 'void',
        'x-editable': false,
        'x-decorator': 'FormItem',
        'x-designer': 'FormItem.Designer',
        'x-component': 'Action',
        'x-component-props': {
          openMode: 'drawer',
          type: 'primary',
          component: 'DataBlockSelectorAction',
          icon: 'PlusOutlined',
        },
        properties: {
          drawer: {
            "type": "void",
            'x-component': 'Action.Drawer',
            "title": "{{ t(\"Select record\") }}",
            "x-component-props": {
                "className": "nb-record-picker-selector"
            },
            "properties": {
                "grid": {
                    "type": "void",
                    "x-component": "Grid",
                    "x-initializer": "TableSelectorInitializers",
                },
                "footer": {
                    "x-component": "Action.Drawer.Footer",
                    "x-component-props": {},
                    "properties": {
                        "actions": {
                            "type": "void",
                            "x-component": "ActionBar",
                            "x-component-props": {},
                            "properties": {
                                "submit": {
                                    "title": "{{ t(\"Submit\") }}",
                                    "x-component": "Action",
                                    "x-designer": "Action.Designer",
                                    "x-component-props": {
                                        "type": "primary",
                                        "useProps": "{{ useDataBlockSelectorProps }}"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        },
      },
    },
    {
      type: 'item',
      title: t('Add text'),
      component: 'BlockInitializer',
      schema: {
        type: 'void',
        'x-editable': false,
        'x-decorator': 'FormItem',
        'x-designer': 'Markdown.Void.Designer',
        'x-component': 'Markdown.Void',
        'x-component-props': {
          content: t('This is a demo text, **supports Markdown syntax**.'),
        },
      },
    },
  );
  return (
    <SchemaInitializer.Button
      wrap={gridRowColWrap}
      icon={'SettingOutlined'}
      items={fieldItems}
      insertPosition={insertPosition}
      component={component}
      title={component ? null : t('Configure fields')}
    />
  );
};

export const FilterFormItemInitializers = (props: any) => {
  const { t } = useTranslation();
  const { insertPosition, component } = props;
  const associationFields = useFilterAssociatedFormItemInitializerFields();
  const inheritFields = useFilterInheritsFormItemInitializerFields();
  const compile = useCompile();
  const fieldItems: any[] = [
    {
      type: 'itemGroup',
      title: t('Display fields'),
      children: useFilterFormItemInitializerFields(),
    },
  ];
  if (inheritFields?.length > 0) {
    inheritFields.forEach((inherit) => {
      Object.values(inherit)[0].length &&
        fieldItems.push(
          {
            type: 'divider',
          },
          {
            type: 'itemGroup',
            title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
            children: Object.values(inherit)[0],
          },
        );
    });
  }

  associationFields.length > 0 &&
    fieldItems.push(
      {
        type: 'divider',
      },
      {
        type: 'itemGroup',
        title: t('Display association fields'),
        children: associationFields,
      },
    );

  // fieldItems.push(
  //   {
  //     type: 'divider',
  //   },
  //   {
  //     type: 'item',
  //     title: t('Add text'),
  //     component: 'BlockInitializer',
  //     schema: {
  //       type: 'void',
  //       'x-editable': false,
  //       'x-decorator': 'FormItem',
  //       'x-designer': 'Markdown.Void.Designer',
  //       'x-component': 'Markdown.Void',
  //       'x-component-props': {
  //         content: t('This is a demo text, **supports Markdown syntax**.'),
  //       },
  //     },
  //   },
  // );
  return (
    <SchemaInitializer.Button
      wrap={gridRowColWrap}
      icon={'SettingOutlined'}
      items={fieldItems}
      insertPosition={insertPosition}
      component={component}
      title={component ? null : t('Configure fields') + '123'}
    />
  );
};
