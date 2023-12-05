import React from 'react';
import { GeneralSchemaDesigner } from '../../../schema-settings';
import { useTranslation } from 'react-i18next';
import { useCollection, useCollectionManager } from '../../../collection-manager';
import {
  EditComponent,
  EditDataBlockSelectorAction,
  EditDescription,
  EditOperator,
  EditTitle,
  EditTitleField,
  EditTooltip,
  EditValidationRules,
} from './SchemaSettingOptions';
import { DataBlockSelectorAction } from '..';

export const FilterFormDesigner = () => {
  return <GeneralSchemaDesigner schemaSettings="FilterFormItemSettings"></GeneralSchemaDesigner>;
};
