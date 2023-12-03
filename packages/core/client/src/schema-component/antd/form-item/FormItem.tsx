import { css, cx } from '@emotion/css';
import { ArrayCollapse, FormLayout, FormItem as Item } from '@formily/antd-v5';
import { Field } from '@formily/core';
import { ISchema, observer, useField, useFieldSchema } from '@formily/react';
import { Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ACLCollectionFieldProvider } from '../../../acl/ACLProvider';
import { useFormActiveFields } from '../../../block-provider';
import { useFormBlockContext } from '../../../block-provider/FormBlockProvider';
import { Collection, useCollection, useCollectionManager } from '../../../collection-manager';
import { useRecord } from '../../../record-provider';
import { GeneralSchemaItems } from '../../../schema-items/GeneralSchemaItems';
import { GeneralSchemaDesigner, SchemaSettings, isPatternDisabled } from '../../../schema-settings';
import { ActionType } from '../../../schema-settings/LinkageRules/type';
import { VariableInput, getShouldChange } from '../../../schema-settings/VariableInput/VariableInput';
import useIsAllowToSetDefaultValue from '../../../schema-settings/hooks/useIsAllowToSetDefaultValue';
import { useIsShowMultipleSwitch } from '../../../schema-settings/hooks/useIsShowMultipleSwitch';
import { useLocalVariables, useVariables } from '../../../variables';
import useContextVariable from '../../../variables/hooks/useContextVariable';
import { useCompile, useDesignable, useFieldModeOptions } from '../../hooks';
import { isSubMode } from '../association-field/util';
import { BlockItem } from '../block-item';
import { removeNullCondition } from '../filter';
import { DynamicComponentProps } from '../filter/DynamicComponent';
import { getTempFieldState } from '../form-v2/utils';
import { HTMLEncode } from '../input/shared';
import { useColorFields } from '../table-v2/Table.Column.Designer';
import { FilterFormDesigner } from './FormItem.FilterFormDesigner';
import { EditDataBlockSelectorAction, useEnsureOperatorsValid } from './SchemaSettingOptions';
import useLazyLoadAssociationFieldOfForm from './hooks/useLazyLoadAssociationFieldOfForm';
import useLazyLoadDisplayAssociationFieldsOfForm from './hooks/useLazyLoadDisplayAssociationFieldsOfForm';
import useParseDefaultValue from './hooks/useParseDefaultValue';
import { Designer } from './FormItem.Designer';

export const FormItem: any = observer(
  (props: any) => {
    useEnsureOperatorsValid();
    const field = useField<Field>();
    const schema = useFieldSchema();
    const contextVariable = useContextVariable();
    const variables = useVariables();
    const { addActiveFieldName } = useFormActiveFields() || {};
    useEffect(() => {
      variables?.registerVariable(contextVariable);
    }, [contextVariable]);

    // 需要放在注冊完变量之后
    useParseDefaultValue();
    useLazyLoadDisplayAssociationFieldsOfForm();
    useLazyLoadAssociationFieldOfForm();

    useEffect(() => {
      addActiveFieldName?.(schema.name as string);
    }, [addActiveFieldName, schema.name]);

    const showTitle = schema['x-decorator-props']?.showTitle ?? true;
    const extra = useMemo(() => {
      return typeof field.description === 'string' ? (
        <div
          dangerouslySetInnerHTML={{
            __html: HTMLEncode(field.description).split('\n').join('<br/>'),
          }}
        />
      ) : (
        field.description
      );
    }, [field.description]);
    const className = useMemo(() => {
      return cx(
        css`
          & .ant-space {
            flex-wrap: wrap;
          }
        `,
        {
          [css`
            > .ant-formily-item-label {
              display: none;
            }
          `]: showTitle === false,
        },
      );
    }, [showTitle]);

    return (
      <ACLCollectionFieldProvider>
        <BlockItem className={'nb-form-item'}>
          <Item className={className} {...props} extra={extra} />
        </BlockItem>
      </ACLCollectionFieldProvider>
    );
  },
  { displayName: 'FormItem' },
);

FormItem.Designer = Designer;

export function isFileCollection(collection: Collection) {
  return collection?.template === 'file';
}

FormItem.FilterFormDesigner = FilterFormDesigner;

function useIsAddNewForm() {
  const record = useRecord();
  const isAddNewForm = _.isEmpty(_.omit(record, ['__parent', '__collectionName']));

  return isAddNewForm;
}
