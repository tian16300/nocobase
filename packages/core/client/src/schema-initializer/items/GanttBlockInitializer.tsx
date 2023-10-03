import { FormOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollectionManager } from '../../collection-manager';
import { useGlobalTheme } from '../../global-theme';
import { FormDialog, SchemaComponent, SchemaComponentOptions } from '../../schema-component';
import { createGanttBlockSchema } from '../utils';
import { DataBlockInitializer } from './DataBlockInitializer';

export const GanttBlockInitializer = (props) => {
  const { insert } = props;
  const { t } = useTranslation();
  const { getCollectionFields } = useCollectionManager();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();

  return (
    <DataBlockInitializer
      {...props}
      componentType={'Gantt'}
      icon={<FormOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const collectionFields = getCollectionFields(item.name);
        const appends = [];
        let stringFields = collectionFields
          ?.filter((field) => field.type === 'string')
          ?.map((field) => {
            return {
              label: field?.uiSchema?.title,
              value: field.name,
            };
          });
        /**
         * 扩展字典字段
         */
        const dicFields = collectionFields
          ?.filter((field) => field.interface === 'dic')
          .map((field) => {
            return {
              label: field?.uiSchema?.title,
              value: [field.name, 'label'].join('.'),
            };
          });
        stringFields = stringFields.concat(dicFields);

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
        const groups = collectionFields.filter((field)=>{
          return ['m2o','dic'].includes(field.interface) && 'parent' !== field.name;
        }).map((field) => {
          const isDicField = ['dic'].includes(field.interface);
          return {
            label: field?.uiSchema?.title,
            value: field.name,
          };
        });
        const sort =  collectionFields.filter((field)=>{
          return 'date' == field.type || ['dic'].includes(field.interface);
        }).map((field) => {
          // const isDicField = ['dic'].includes(field.interface);
          return {
            label: field?.uiSchema?.title,
            value: field.name,
          };
        });
        const range =   [
          // { label: '{{t("Hour")}}', value: 'hour', color: 'orange' },
          // { label: '{{t("Quarter of day")}}', value: 'quarterDay', color: 'default' },
          // { label: '{{t("Half of day")}}', value: 'halfDay', color: 'blue' },
          { label: '{{t("Day")}}', value: 'day', color: 'yellow' },
          { label: '{{t("Week")}}', value: 'week', color: 'pule' },
          { label: '{{t("Month")}}', value: 'month', color: 'green' },
          { label: '{{t("QuarterYear")}}', value: 'quarterYear', color: 'red' },
          // { label: '{{t("半年")}}', value: 'halfYear', color: 'red' },
          { label: '{{t("Year")}}', value: 'year', color: 'green' },
        ];
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
                          enum: stringFields,
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
                          enum: range,
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

        Object.values(values).forEach((val: string) => {
          const keys = val.split('.');
          if (keys.length > 1) {
            appends.push(keys.slice(0, keys.length - 1).join('.'));
          }
        });
        insert(
          createGanttBlockSchema({
            collection: item.name,
            fieldNames: {
              ...values,
            },
            fields:{
              groups,
              sort,
              range
            },
            appends: appends
          }),
        );
      }}
    />
  );
};
