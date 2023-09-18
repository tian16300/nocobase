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
  FilterDynamicComponent,
  removeNullCondition
} from '@nocobase/client';
import { useDataSelectBlockContext } from './DataSelectFieldProvider';


export const DataSelectDesigner = () => {
  const { name, title, sortable } = useCollection();
  const { getCollectionField, getCollection } = useCollectionManager();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const dataSource = useCollectionFilterOptions(name);
  const sortFields = useSortFields(name);
  const { service } = useDataSelectBlockContext();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const compile = useCompile();
  const defaultFilter = fieldSchema?.['x-decorator-props']?.params?.filter || {};
  const defaultSort = fieldSchema?.['x-decorator-props']?.params?.sort || [];
  const defaultResource = fieldSchema?.['x-decorator-props']?.resource;
  const supportTemplate = !fieldSchema?.['x-decorator-props']?.disableTemplate;
  const sort = defaultSort?.map((item: string) => {
    return item?.startsWith('-')
      ? {
        field: item.substring(1),
        direction: 'desc',
      }
      : {
        field: item,
        direction: 'asc',
      };
  });
  const template = useSchemaTemplate();
  const collection = useCollection();
  const { dragSort, resource } = field.decoratorProps;
  const treeCollection = resource?.includes('.')
    ? getCollection(getCollectionField(resource)?.target)?.tree
    : !!collection?.tree;
  const dataScopeSchema = useMemo(() => {
    return {
      type: 'object',
      title: t('Set the data scope'),
      properties: {
        filter: {
          default: defaultFilter,
          // title: '数据范围',
          enum: compile(dataSource),
          'x-component': 'Filter',
          'x-component-props': {
            dynamicComponent: (props) => FilterDynamicComponent({ ...props }),
          },
        },
      },
    } as ISchema;
  }, [dataSource, defaultFilter]);
  const onDataScopeSubmit = useCallback(
    ({ filter }) => {
      filter = removeNullCondition(filter);
      const params = field.decoratorProps.params || {};
      params.filter = filter;
      field.decoratorProps.params = params;
      fieldSchema['x-decorator-props']['params'] = params;
      const filters = service.params?.[1]?.filters || {};
      service.run(
        { ...service.params?.[0], filter: mergeFilter([...Object.values(filters), filter]), page: 1 },
        { filters },
      );
      dn.emit('patch', {
        schema: {
          ['x-uid']: fieldSchema['x-uid'],
          'x-decorator-props': fieldSchema['x-decorator-props'],
        },
      });
    },
    [field],
  );

  return (
    <GeneralSchemaDesigner template={template} title={title || name}>
      <SchemaSettings.BlockTitleItem />
      <SchemaSettings.ModalItem title={t('Set the data scope')} schema={dataScopeSchema} onSubmit={onDataScopeSubmit} />
      {/* <FixedBlockDesignerItem /> */}
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
      )}
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

DataSelectDesigner.displayName = 'DataSelectDesigner';