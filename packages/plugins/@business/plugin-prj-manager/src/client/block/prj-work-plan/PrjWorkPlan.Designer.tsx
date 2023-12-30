import {
  FixedBlockDesignerItem,
  GeneralSchemaDesigner,
  SchemaSettings,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsDataScope,
  SchemaSettingsDivider,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
  SchemaSettingsSelectItem,
  SchemaSettingsTemplate,
  useCollection,
  useCompile,
  useDesignable,
  useFormBlockContext,
  useSchemaTemplate,
} from '@nocobase/client';
import { ISchema, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGanttBlockContext } from '@nocobase/plugin-gantt/client';

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
const useTitleFields = () => {
  const compile = useCompile();
  const { fields } = useCollection();
  const options = fields
    ?.filter((field) => field.type === 'string' || ['dic'].includes(field.interface))
    ?.map((field) => {
      return {
        value: ['dic'].includes(field.interface) ? [field.name, 'label'].join('.') : field.name,
        label: compile(field?.uiSchema?.title),
      };
    });
  return options;
};
const useGroupFields = () => {
  const compile = useCompile();
  const { fields } = useCollection();
  const options = fields
    ?.filter((field) => ['m2o', 'dic'].includes(field.interface) && 'parent' !== field.name)
    ?.map((field) => {
      return {
        label: compile(field?.uiSchema?.title),
        value: field.name,
      };
    });
  return options;
};

export const PrjWorkPlanDesigner = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { form } = useFormBlockContext();
  const { name, title } = useCollection();
  const { service } = useGanttBlockContext();
  const { dn } = useDesignable();
  const compile = useCompile();
  const { t } = useTranslation();
  const template = useSchemaTemplate();
  const fieldNames = fieldSchema?.['x-decorator-props']?.['fieldNames'] || {};
  const defaultResource = fieldSchema?.['x-decorator-props']?.resource;
  const groupValue = fieldSchema?.['x-decorator-props']?.['group'];
  let tableSchema = null;
  fieldSchema.properties.view.mapProperties((s) => {
    if (s['x-component'] == 'PrjWorkPlan.Table') {
      tableSchema = s;
    }
  });
  return (
    <GeneralSchemaDesigner template={template} title={title || name}>
      <SchemaSettingsBlockTitleItem />
      <FixedBlockDesignerItem />
      <SchemaSettingsSelectItem
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
      <SchemaSettingsSelectItem
        title={t('默认分组')}
        value={groupValue}
        options={useGroupFields()}
        onChange={(group) => {
          field.decoratorProps.group = group;
          fieldSchema['x-decorator-props']['group'] = group;
          // Select切换option后value未按照预期切换，固增加以下代码
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
      <SchemaSettingsSelectItem
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
      <SchemaSettingsSelectItem
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
      <SchemaSettingsSelectItem
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
      <SchemaSettingsSelectItem
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
      <SchemaSettingsModalItem
        title={t('设置其他属性')}
        schema={
          {
            type: 'object',
            title: t('设置其他属性'),
            properties: {
              rightSize: {
                title: '面板右侧宽度',
                'x-component': 'Percent',
                'x-decorator': 'FormItem',
              },
              prjStageVersionLink: {
                title: '项目历史计划链接',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          } as ISchema
        }
        initialValues={{
          rightSize: fieldSchema['x-decorator-props'].rightSize,
          prjStageVersionLink: tableSchema['x-component-props'].prjStageVersionLink,
        }}
        onSubmit={async ({ rightSize, prjStageVersionLink }) => {
          field.decoratorProps.rightSize = rightSize;
          fieldSchema['x-decorator-props']['rightSize'] = rightSize;
          if (tableSchema) {
            tableSchema['x-component-props'] = tableSchema['x-component-props'] || {};
            tableSchema['x-component-props'].prjStageVersionLink = prjStageVersionLink;
            await dn.emit('patch', {
              schema: {
                ['x-uid']: tableSchema['x-uid'],
                'x-component-props': tableSchema['x-component-props'],
              },
            });
          }
          await dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
        }}
      />

      <SchemaSettingsDataScope
        collectionName={name}
        defaultFilter={fieldSchema?.['x-decorator-props']?.params?.filter || {}}
        form={form}
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
      <SchemaSettingsDivider />
      <SchemaSettingsTemplate componentName={'PrjWorkPlan'} collectionName={name} resourceName={defaultResource} />
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
