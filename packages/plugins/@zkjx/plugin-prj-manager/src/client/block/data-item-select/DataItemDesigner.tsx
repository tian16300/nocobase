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
  SchemaSettingOptions
} from '@nocobase/client';
import { useDataItemSelectBlockContext } from './DataItemSelectFieldProvider';




export const DataItemDesigner = () => {
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
      <SchemaSettingOptions.EditTitle />
      <SchemaSettingOptions.EditTitleField />
      {/* {collection?.tree && collectionField?.collectionName === collectionField?.target && (
        <SchemaSettings.SwitchItem
          title={t('Tree table')}
          defaultChecked={true}
          checked={treeCollection ? field.decoratorProps.treeTable !== false : false}
          onChange={(flag) => {
            field.decoratorProps.treeTable = flag;
            fieldSchema['x-decorator-props'].treeTable = flag;
            const params = {
              ...service.params?.[0],
              tree: flag ? true : null,
            };
            dn.emit('patch', {
              schema: fieldSchema,
            });
            dn.refresh();
            service.run(params);
          }}
        />
      )}
      <SchemaSettings.DataScope
        collectionName={name}
        defaultFilter={fieldSchema?.['x-decorator-props']?.params?.filter || {}}
        form={form}
        onSubmit={onDataScopeSubmit}
      />
      {<FixedBlockDesignerItem /> }
      <SchemaSettings.ModalItem
        title={t('Set default sorting rules')}
        components={{ ArrayItems }}
        schema={
          {
            type: 'object',
            title: t('Set default sorting rules'),
            properties: {
              sort: {
                type: 'array',
                default: sort,
                'x-component': 'ArrayItems',
                'x-decorator': 'FormItem',
                items: {
                  type: 'object',
                  properties: {
                    space: {
                      type: 'void',
                      'x-component': 'Space',
                      properties: {
                        sort: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.SortHandle',
                        },
                        field: {
                          type: 'string',
                          enum: sortFields,
                          required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: {
                              width: 260,
                            },
                          },
                        },
                        direction: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Radio.Group',
                          'x-component-props': {
                            optionType: 'button',
                          },
                          enum: [
                            {
                              label: t('ASC'),
                              value: 'asc',
                            },
                            {
                              label: t('DESC'),
                              value: 'desc',
                            },
                          ],
                        },
                        remove: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.Remove',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    title: t('Add sort field'),
                    'x-component': 'ArrayItems.Addition',
                  },
                },
              },
            },
          } as ISchema
        }
        onSubmit={({ sort }) => {
          const sortArr = sort.map((item) => {
            return item.direction === 'desc' ? `-${item.field}` : item.field;
          });
          const params = field.decoratorProps.params || {};
          params.sort = sortArr;
          field.decoratorProps.params = params;
          fieldSchema['x-decorator-props']['params'] = params;
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': fieldSchema['x-decorator-props'],
            },
          });
          service.run({ ...service.params?.[0], sort: sortArr });
        }}
      />
      <SchemaSettings.ConnectDataBlocks type={FilterBlockType.TABLE} emptyDescription={t('No blocks to connect')} />
      {supportTemplate && <SchemaSettings.Divider />}
      {supportTemplate && (
        <SchemaSettings.Template componentName={'Select'} collectionName={name} resourceName={defaultResource} />
      )} */}
      <SchemaSettings.Divider />
      <SchemaSettings.Remove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

DataItemDesigner.displayName = 'DataItemDesigner';