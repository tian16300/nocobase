// 主要处理新建和编辑的场景

import React from 'react';

import { CardItem, CollectionProvider, SchemaComponent, SchemaComponentProvider, useDesignable, useSchemaInitializerRender, useSchemaOptionsContext } from '@nocobase/client';


import { observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useApprovalSettingContext } from '../AddProvalSetting';

const AddBlockButton = observer(() => {
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
  return render();
});
const SchemaConfigSetting = (props) => {  
  const { collection } = props;
  return (
    <CollectionProvider name={collection}>
    {props.children}
    <AddBlockButton />
  </CollectionProvider>
  );
};

export const DesignSchemaView = () => {
  const { form } = useApprovalSettingContext();
  const { scope, components } = useSchemaOptionsContext();
  const collection = form.values.collection;
  const schema = {
    name:'root',
    type: 'object',
    required: true,
    'x-decorator': 'FormItem',
    'x-component': 'SchemaConfigSetting',
    'x-component-props': {
      collection: collection
    },
    properties: {
      form: {
        type: 'void',
        'x-decorator': 'FormBlockProvider',
        'x-decorator-props': {
          resourceName: collection,
          collection: collection,
        },
        'x-acl-action': ``,
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
        },
      },
    },
  };
  const {designable} = useDesignable();
  return (
    <SchemaComponentProvider components={{ ...components, SchemaConfigSetting, AddBlockButton }} scope={{ ...scope }} designable={designable}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
