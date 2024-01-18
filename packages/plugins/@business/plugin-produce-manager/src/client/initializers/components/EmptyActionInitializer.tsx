import type { ISchema } from '@formily/react';
import { Schema, useFieldSchema } from '@formily/react';
import { merge } from '@formily/shared';
import {
  SchemaInitializerSwitch,
  css,
  useBlockAssociationContext,
  useBlockRequestContext,
  useCollection,
  useDesignable,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
// import { useFields } from './useFields';

const findSchema = (schema: Schema, key: string, action: string) => {
  return schema.reduceProperties((buf, s) => {
    if (s[key] === action) {
      return s;
    }
    const c = findSchema(s, key, action);
    if (c) {
      return c;
    }
    return buf;
  });
};
const removeSchema = (schema, cb) => {
  return cb(schema);
};
const useCurrentSchema = (action: string, key: string, find = findSchema, rm = removeSchema) => {
  const fieldSchema = useFieldSchema();
  const { remove } = useDesignable();
  const schema = find(fieldSchema, key, action);
  return {
    schema,
    exists: !!schema,
    remove() {
      schema && rm(schema, remove);
    },
  };
};

export const EmptyActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { exists, remove } = useCurrentSchema('emptyValue', 'x-action', itemConfig.find, itemConfig.remove);
  const schema: ISchema = {
    type: 'void',
    'x-designer': 'Action.Designer',
    title: '清空',
    'x-action': 'emptyValue',
    'x-action-settings': {},
    'x-component': 'Action',
    'x-component-props': {
      type: 'default',
      confirm: {
        title: 'Perform the {{title}}',
        content: 'Are you sure you want to perform the {{title}} action?',
      },
      useAction: '{{ useEmptyCollectionFieldAction }}',
    },
  };
  return (
    <SchemaInitializerSwitch
      {...itemConfig}
      checked={exists}
      title={itemConfig.title}
      onClick={() => {
        if (exists) {
          return remove();
        }
        const s = merge(schema || {}, itemConfig.schema || {});
        itemConfig?.schemaInitialize?.(s);
        insert(s);
      }}
    />
  );
};
