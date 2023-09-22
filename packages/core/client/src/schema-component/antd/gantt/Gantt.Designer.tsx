import { ISchema, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FixedBlockDesignerItem, useCompile, useDesignable } from '../..';
import { useGanttBlockContext } from '../../../block-provider';
import { useCollection } from '../../../collection-manager';
import { useCollectionFilterOptions } from '../../../collection-manager/action-hooks';
import { GeneralSchemaDesigner, SchemaSettings } from '../../../schema-settings';
import { useSchemaTemplate } from '../../../schema-templates';

const useOptions = (type = 'string') => {
  const compile = useCompile();
  const { fields } = useCollection();
  const options = fields
    ?.filter((field) => field.type === type)
    ?.map((field) => {
      return {
        value: field.name,
        label: compile(field?.uiSchema?.title),
      };
    });
  return options;
};
const useTitleFields=()=>{
  const compile = useCompile();
  const { fields } = useCollection();
  const options = fields
    ?.filter((field) => ((field.type === 'string') || ['dic'].includes(field.interface)))
    ?.map((field) => {
      return {
        value: ['dic'].includes(field.interface)?[field.name,'label'].join('.'):field.name,
        label: compile(field?.uiSchema?.title),
      };
    });
  return options;

}

export const GanttDesigner = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { name, title, fields } = useCollection();
  const dataSource = useCollectionFilterOptions(name);
  const { service } = useGanttBlockContext();
  const { dn } = useDesignable();
  const compile = useCompile();
  const { t } = useTranslation();
  const template = useSchemaTemplate();
  const defaultFilter = fieldSchema?.['x-decorator-props']?.params?.filter || {};
  const fieldNames = fieldSchema?.['x-decorator-props']?.['fieldNames'] || {};
  const defaultResource = fieldSchema?.['x-decorator-props']?.resource;
  return (
    <GeneralSchemaDesigner template={template} title={title || name}>
      <SchemaSettings.BlockTitleItem />
      <FixedBlockDesignerItem />
      <SchemaSettings.SelectItem
        title={t('Title field')}
        value={fieldNames.title}
        options={useTitleFields()}
        onChange={(title) => {
          const fieldNames = field.decoratorProps.fieldNames || {};
          fieldNames['title'] = title;
          field.decoratorProps.params = fieldNames;
          fieldSchema['x-decorator-props']['params'] = fieldNames;
          // Select切换option后value未按照预期切换，固增加以下代码
          fieldSchema['x-decorator-props']['fieldNames'] = fieldNames;
          service.refresh();
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettings.SelectItem
        title={t('Time scale')}
        value={fieldNames.range || 'day'}
        options={[
          { label: compile('{{t("Hour")}}'), value: 'hour', color: 'orange' },
          { label: compile('{{t("Quarter of day")}}'), value: 'quarterDay', color: 'default' },
          { label: compile('{{t("Half of day")}}'), value: 'halfDay', color: 'blue' },
          { label: compile('{{t("Day")}}'), value: 'day', color: 'yellow' },
          { label: compile('{{t("Week")}}'), value: 'week', color: 'pule' },
          { label: compile('{{t("Month")}}'), value: 'month', color: 'green' },
          { label: compile('{{t("QuarterYear")}}'), value: 'quarterYear', color: 'red' },
          { label: compile('{{t("Year")}}'), value: 'year', color: 'green' },
        ]}
        onChange={(range) => {
          const fieldNames = field.decoratorProps.fieldNames || {};
          fieldNames['range'] = range;
          field.decoratorProps.params = fieldNames;
          fieldSchema['x-decorator-props']['params'] = fieldNames;
          // Select切换option后value未按照预期切换，固增加以下代码
          fieldSchema['x-decorator-props']['fieldNames'] = fieldNames;
          service.refresh();
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettings.SelectItem
        title={t('Start date field')}
        value={fieldNames.start}
        options={useOptions('date')}
        onChange={(start) => {
          const fieldNames = field.decoratorProps.fieldNames || {};
          fieldNames['start'] = start;
          field.decoratorProps.fieldNames = fieldNames;
          fieldSchema['x-decorator-props']['fieldNames'] = fieldNames;
          service.refresh();
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettings.SelectItem
        title={t('End date field')}
        value={fieldNames.end}
        options={useOptions('date')}
        onChange={(end) => {
          const fieldNames = field.decoratorProps.fieldNames || {};
          fieldNames['end'] = end;
          field.decoratorProps.fieldNames = fieldNames;
          fieldSchema['x-decorator-props']['fieldNames'] = fieldNames;
          service.refresh();
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettings.SelectItem
        title={t('Progress field')}
        value={fieldNames.progress}
        options={useOptions('float')}
        onChange={(progress) => {
          const fieldNames = field.decoratorProps.fieldNames || {};
          fieldNames['progress'] = progress;
          field.decoratorProps.fieldNames = fieldNames;
          fieldSchema['x-decorator-props']['fieldNames'] = fieldNames;
          service.refresh();
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettings.ModalItem
        title={t('设置面板属性')}
        schema={
          {
            type: 'object',
            title: t('设置面板属性'),
            properties: {
              leftSize: {
                'title':'左侧宽度',
                'x-component': 'Percent',
                'x-decorator': 'FormItem'
              },
            },
          } as ISchema
        }
        initialValues={
          {
            leftSize:  fieldSchema['x-decorator-props'].leftSize
          }
        }
        onSubmit={({ leftSize }) => {
          field.decoratorProps.leftSize  =  leftSize;
          fieldSchema['x-decorator-props']['leftSize'] = leftSize;
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
        }}
      />
      <SchemaSettings.ModalItem
        title={t('Set the data scope')}
        schema={
          {
            type: 'object',
            title: t('Set the data scope'),
            properties: {
              filter: {
                default: defaultFilter,
                enum: dataSource,
                'x-component': 'Filter',
                'x-component-props': {},
              },
            },
          } as ISchema
        }
        initialValues={
          {
            // title: field.title,
            // icon: field.componentProps.icon,
          }
        }
        onSubmit={({ filter }) => {
          const params = field.decoratorProps.params || {};
          params.filter = filter;
          field.decoratorProps.params = params;
          fieldSchema['x-decorator-props']['params'] = params;
          service.run({ ...service?.params?.[0], filter });
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
        }}
      />
      <SchemaSettings.Divider />
      <SchemaSettings.Template componentName={'Gantt'} collectionName={name} resourceName={defaultResource} />
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
