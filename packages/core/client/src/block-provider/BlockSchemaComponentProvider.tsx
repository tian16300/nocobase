import React from 'react';
import { Plugin } from '../application/Plugin';
import { SchemaComponentOptions, useDataBlockSelectorProps, useSubmitApprovalActionProps, useTreeFormAddChildActionProps, useTreeFormBlockProps, useTreeFormBlockTreeItemProps, useTreeFormCreateActionProps, useTreeFormCreateProps, useTreeFormExpandActionProps, useTreeFormFilterProps, useTreeFormRefreshActionProps, useTreeFormSaveAsNewVersionProps, useTreeFormShowForm } from '../schema-component';
import { RecordLink, useParamsFromRecord, useSourceIdFromParentRecord, useSourceIdFromRecord } from './BlockProvider';
import { DetailsBlockProvider, useDetailsBlockProps } from './DetailsBlockProvider';
import { FilterFormBlockProvider } from './FilterFormBlockProvider';
import { FormBlockProvider, useFormBlockProps } from './FormBlockProvider';
import { FormFieldProvider, useFormFieldProps } from './FormFieldProvider';
import { TableBlockProvider, useTableBlockProps } from './TableBlockProvider';
import { TableFieldProvider, useTableFieldProps } from './TableFieldProvider';
import { TableSelectorProvider, useTableSelectorProps } from './TableSelectorProvider';
import { useGroupTableBlockProps, useGroupTableProps } from '../schema-component/antd/group-table/GroupTable.Decorator';
import * as bp from './hooks';

// TODO: delete this, replaced by `BlockSchemaComponentPlugin`
export const BlockSchemaComponentProvider: React.FC = (props) => {
  return (
    <SchemaComponentOptions
      components={{
        TableFieldProvider,
        TableBlockProvider,
        TableSelectorProvider,
        FormBlockProvider,
        FilterFormBlockProvider,
        FormFieldProvider,
        DetailsBlockProvider,
        // KanbanBlockProvider,
        RecordLink,
      }}
      scope={{
        ...bp,
        useSourceIdFromRecord,
        useSourceIdFromParentRecord,
        useParamsFromRecord,
        useFormBlockProps,
        useFormFieldProps,
        useDetailsBlockProps,
        useTableFieldProps,
        useTableBlockProps,
        useTableSelectorProps,
        // useKanbanBlockProps,
        // useGanttBlockProps
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};

export class BlockSchemaComponentPlugin extends Plugin {
  async load() {
    this.addComponents();
    this.addScopes();
  }

  addComponents() {
    this.app.addComponents({
      TableFieldProvider,
      TableBlockProvider,
      TableSelectorProvider,
      FormBlockProvider,
      FilterFormBlockProvider,
      FormFieldProvider,
      DetailsBlockProvider,
      // KanbanBlockProvider,
      RecordLink,
    });
  }

  addScopes() {
    this.app.addScopes({
      ...bp,
      useSourceIdFromRecord,
      useSourceIdFromParentRecord,
      useParamsFromRecord,
      useFormBlockProps,
      useFormFieldProps,
      useDetailsBlockProps,
      useTableFieldProps,
      useTableBlockProps,
      useTableSelectorProps,
      // useKanbanBlockProps,
      // useGanttBlockProps, 
      // useGanttFormGroupFieldProps,     
      // useGanttFormSortFieldProps,
      // useGanttFormRangeFieldProps,
      useGroupTableProps,
      useGroupTableBlockProps,
      useTreeFormBlockProps,
      useTreeFormAddChildActionProps,
      useTreeFormCreateActionProps,
      useTreeFormShowForm,
      useDataBlockSelectorProps,
      useTreeFormBlockTreeItemProps,
      useTreeFormExpandActionProps,
      useTreeFormCreateProps,
      useTreeFormRefreshActionProps,
      useTreeFormFilterProps,
      useTreeFormSaveAsNewVersionProps,
      useSubmitApprovalActionProps
    });
  }
}
