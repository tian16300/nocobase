import { ArrayItems } from '@formily/antd-v5';
import { ISchema, useField, useFieldSchema } from '@formily/react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterBlockType,
  GeneralSchemaDesigner,
  SchemaSettings,
  mergeFilter,
  useCollection,
  useCollectionFilterOptions,
  useCollectionManager,
  useCompile,
  useDesignable,
  useSchemaTemplate,
  useSortFields,
  removeNullCondition,
  useFormBlockContext,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsDivider,
  SchemaSettingsRemove
} from '@nocobase/client';
import { useDataItemSelectBlockContext } from './DataItemSelectFieldProvider';




export const DataItemSelectDesigner = () => {
  const { name, title, sortable } = useCollection();
  // const { getCollectionField, getCollection } = useCollectionManager();
  // const field = useField();
  // const fieldSchema = useFieldSchema();
  // const { form } = useFormBlockContext();
  // const dataSource = useCollectionFilterOptions(name);
  // const sortFields = useSortFields(name);
  // const { service } = useDataItemSelectBlockContext();
  // const { t } = useTranslation();
  // const { dn } = useDesignable();
  // const compile = useCompile();
  // const defaultFilter = fieldSchema?.['x-decorator-props']?.params?.filter || {};
  // const defaultSort = fieldSchema?.['x-decorator-props']?.params?.sort || [];
  // const defaultResource = fieldSchema?.['x-decorator-props']?.resource;
  // const supportTemplate = !fieldSchema?.['x-decorator-props']?.disableTemplate;
  // const sort = defaultSort?.map((item: string) => {
  //   return item?.startsWith('-')
  //     ? {
  //       field: item.substring(1),
  //       direction: 'desc',
  //     }
  //     : {
  //       field: item,
  //       direction: 'asc',
  //     };
  // });
 
  // const collection = useCollection();
  // const { dragSort, resource } = field.decoratorProps;
  // const collectionField = resource && typeof resource == 'string' && getCollectionField(resource);
  // const treeCollection = resource?.includes('.') ? getCollection(collectionField?.target)?.tree : !!collection?.tree;
  // const onDataScopeSubmit = useCallback(
  //   ({ filter }) => {
  //     filter = removeNullCondition(filter);
  //     const params = field.decoratorProps.params || {};
  //     params.filter = filter;
  //     field.decoratorProps.params = params;
  //     fieldSchema['x-decorator-props']['params'] = params;
  //     const filters = service.params?.[1]?.filters || {};
  //     service.run(
  //       { ...service.params?.[0], filter: mergeFilter([...Object.values(filters), filter]), page: 1 },
  //       { filters },
  //     );
  //     dn.emit('patch', {
  //       schema: {
  //         ['x-uid']: fieldSchema['x-uid'],
  //         'x-decorator-props': fieldSchema['x-decorator-props'],
  //       },
  //     });
  //   },
  //   [dn, field.decoratorProps, fieldSchema, service],
  // );
  const template = useSchemaTemplate();

  return (
    <GeneralSchemaDesigner template={template} title={title || name}>
      <SchemaSettingsBlockTitleItem />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

DataItemSelectDesigner.displayName = 'DataItemSelectDesigner';