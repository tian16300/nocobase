import { TableOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollectionManager } from '../../collection-manager';
import { useGlobalTheme } from '../../global-theme';
import { FormDialog, SchemaComponent, SchemaComponentOptions } from '../../schema-component';
import { useSchemaTemplateManager } from '../../schema-templates';
import { SchemaInitializer } from '../SchemaInitializer';
import { createCalendarBlockSchema, createGanttBlockSchema, useRecordCollectionDataSourceItems } from '../utils';

export const RecordAssociationGanttBlockInitializer = (props) => {
  const { item, onCreateBlockSchema, componentType, createBlockSchema, insert, ...others } = props;
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { getCollection } = useCollectionManager();
  const field = item.field;
  const collection = getCollection(field.target);
  const resource = `${field.collectionName}.${field.name}`;
  const { theme } = useGlobalTheme();

  return (
    <SchemaInitializer.Item
      icon={<TableOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          const collectionFields = collection?.fields || [];
          const appends=[];
          const stringFields = collectionFields
            ?.filter((field) => ['string'].includes(field.type))
            ?.map((field) => {
              return {
                label: field?.uiSchema?.title,
                value: field.name,
              };
            });
            const dicFields = collectionFields
            ?.filter((field) => ['dic'].includes(field.interface))
            ?.map((field) => {
              appends.push(field.name);
              return {
                label: field?.uiSchema?.title,
                value: [field.name,'label'].join('.'),
              };
            });
            const titleFields = [
              ...stringFields,
              ...dicFields
            ]
          const dateFields = collectionFields
            ?.filter((field) => field.type === 'date')
            ?.map((field) => {
              return {
                label: field?.uiSchema?.title,
                value: field.name,
              };
            });
          const numberFields = collectionFields
            ?.filter((field) => field.type === 'float')
            ?.map((field) => {
              return {
                label: field?.uiSchema?.title,
                value: field.name,
              };
            });
          const values = await FormDialog(
            t('Create gantt block'),
            () => {
              return (
                <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
                  <FormLayout layout={'vertical'}>
                    <SchemaComponent
                      schema={{
                        properties: {
                          title: {
                            title: t('Title field'),
                            enum: titleFields,
                            required: true,
                            'x-component': 'Select',
                            'x-decorator': 'FormItem',
                          },
                          start: {
                            title: t('Start date field'),
                            enum: dateFields,
                            required: true,
                            default: 'createdAt',
                            'x-component': 'Select',
                            'x-decorator': 'FormItem',
                          },
                          end: {
                            title: t('End date field'),
                            enum: dateFields,
                            required: true,
                            'x-component': 'Select',
                            'x-decorator': 'FormItem',
                          },
                          progress: {
                            title: t('Progress field'),
                            enum: numberFields,
                            'x-component': 'Select',
                            'x-decorator': 'FormItem',
                          },
                          range: {
                            title: t('Time scale'),
                            enum: [
                              { label: '{{t("Hour")}}', value: 'hour', color: 'orange' },
                              { label: '{{t("Quarter of day")}}', value: 'quarterDay', color: 'default' },
                              { label: '{{t("Half of day")}}', value: 'halfDay', color: 'blue' },
                              { label: '{{t("Day")}}', value: 'day', color: 'yellow' },
                              { label: '{{t("Week")}}', value: 'week', color: 'pule' },
                              { label: '{{t("Month")}}', value: 'month', color: 'green' },
                              { label: '{{t("Year")}}', value: 'year', color: 'green' },
                              { label: '{{t("QuarterYear")}}', value: 'quarterYear', color: 'red' },
                            ],
                            default: 'day',
                            'x-component': 'Select',
                            'x-decorator': 'FormItem',
                          },
                        },
                      }}
                    />
                  </FormLayout>
                </SchemaComponentOptions>
              );
            },
            theme,
          ).open({
            initialValues: {},
          });
          insert(
            createGanttBlockSchema({
              collection: field.target,
              resource,
              association: resource,
              appends,
              fieldNames: {
                ...values,
              },
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('Gantt', item, field.target, resource)}
    />
  );
};
