import type { ISchema } from '@formily/react';
import { Schema, useFieldSchema } from '@formily/react';
import { merge } from '@formily/shared';
import {
  SchemaInitializerSwitch,
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

export const FullScreenActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { exists, remove } = useCurrentSchema('fullScreen', 'x-action', itemConfig.find, itemConfig.remove);
  const schema: ISchema = {
    'x-action': 'fullScreen',
    'x-component': 'Action',
    'x-designer': 'FullScreen.Action.Design',
    'x-component-props': {
      titleFullScreen: "{{t('全屏')}}",
      titleNormal: "{{t('取消全屏')}}",
      iconFullScreen: 'FullscreenOutlined',
      iconNormal: 'FullscreenExitOutlined',
      component: 'FullScreen.Action',
      useAction: () => {
        return {
          run() {},
        };
      },
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
