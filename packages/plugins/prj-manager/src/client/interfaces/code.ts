import { ArrayTable, FormButtonGroup, FormDrawer, FormLayout, Submit } from '@formily/antd-v5';
import { onFieldValueChange } from '@formily/core';
import { ISchema, SchemaOptionsContext, useForm, useFormEffects } from '@formily/react';
import {
  Cron,
  IField,
  SchemaComponent,
  SchemaComponentOptions,
  css,
  interfacesProperties,
  useCompile,
} from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import { Button, Select } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACE, lang } from './locale';
export const prjCode: IField = {
    name: 'prjCode',
    type: 'object',
    group: 'advanced',
    order: 3,
    title: `{{t("Sequence", { ns: "${NAMESPACE}" })}}`,
    sortable: true,
    default: {
      type: 'sequence',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
      },
    },
    hasDefaultValue: false,
    filterable: {
      operators: interfacesProperties.operators.string,
    },
    titleUsable: true,
    schemaInitialize(schema: ISchema, { block, field }) {
      if (block === 'Form') {
        Object.assign(schema['x-component-props'], {
          disabled: !field.inputable,
        });
      }
      return schema;
    },
    properties: {
      ...interfacesProperties.defaultProps,
    },
  };