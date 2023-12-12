// 主要处理新建和编辑的场景

import React, { useEffect, useMemo } from 'react';

import {
  CardItem,
  CollectionProvider,
  SchemaComponent,
  SchemaComponentProvider,
  createDesignable,
  useDesignable,
  useProps,
  useSchemaComponentContext,
  useSchemaInitializerRender,
  useSchemaOptionsContext,
} from '@nocobase/client';

import { observer, useField, useFieldSchema, useForm, RecursionField, Schema } from '@formily/react';
import { useApprovalSettingContext } from '../AddProvalSetting';
import { uid } from '@nocobase/utils';

const AddBlockButton = observer(() => {
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
  return render();
});
export const ApprovalSchemaConfigSetting = ({ children }) => {
  const fieldSchema = useFieldSchema();
  const { refresh } = useSchemaComponentContext();
  const dn = createDesignable({
    refresh,
    current: fieldSchema.properties.form.properties.grid,
  })
  return (
    <div>
      {children}
      <AddBlockButton />
    </div>
  );
};
export const useApprovalSchemaSettingProps = () => {
  return {
    resourceName: 'bom',
    collection: 'bom',
  };
};
export const DesignSchemaView = (props, ref) => {
  const { form, dataModel, schema } = useApprovalSettingContext();
  const { scope, components } = useSchemaOptionsContext();
  const collection = dataModel.collection;
 
  const {designable} = useDesignable();
  // const schema = new Schema(schemaJSON);
  // ref.shema = schema;
  
  
  // const schema = new Schema({
  //   [uid()]:schemaJSON
  // });
  // useEffect(()=>{
  //   setSchemaJSON(schema.toJSON());
  // },[schema.toJSON()])



  return (
    <div>
      <SchemaComponentProvider
        components={{ ...components, ApprovalSchemaConfigSetting }}
        scope={{ ...scope }}
        designable={designable}
      >
        <SchemaComponent schema={schema} />
      </SchemaComponentProvider>
    </div>
  );
};
