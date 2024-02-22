import { ArrayTable, FormButtonGroup, FormDrawer, FormLayout, Submit } from '@formily/antd-v5';
import { onFieldValueChange } from '@formily/core';
import { ISchema, SchemaOptionsContext, useField, useForm, useFormEffects } from '@formily/react';
import {
  Cron,
  IField,
  SchemaComponent,
  SchemaComponentOptions,
  css,
  interfacesProperties,
  useCompile,
  useToken,
  Select
} from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import { Button, Select as AntdSelect, Tag } from 'antd';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACE, lang } from './locale';

function RuleTypeSelect(props) {
  const compile = useCompile();

  const { setValuesIn } = useForm();
  const index = ArrayTable.useIndex();

  useFormEffects(() => {
    onFieldValueChange(`patterns.${index}.type`, (field) => {
      setValuesIn(`patterns.${index}.options`, {});
    });
  });

  return (
    <AntdSelect popupMatchSelectWidth={false} {...props}>
      {Object.keys(RuleTypes).map((key) => (
        <AntdSelect.Option key={key} value={key}>
          {compile(RuleTypes[key].title)}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  );
}
function SelectField(props){
  const { useCurrentFields } = props;
  const compile = useCompile();
  /* 支持字典 文本 单选  下拉单选 */
  const fields = useCurrentFields().filter((field)=>{
    return ['dic','input','select','radioGroup', 'obo'].includes(field?.interface);
  }).map((field)=>{
    return {
      label: compile(field?.uiSchema?.title|| field.name),
      value: field.name,
      interface: field.interface,
      foreignKey:field?.foreignKey
    }
  });
  const { setValuesIn } = useForm();
  const index = ArrayTable.useIndex();

  useFormEffects(() => {
    onFieldValueChange(`patterns.${index}.type`, (field) => {
      setValuesIn(`patterns.${index}.options`, {});
    });
  });

  return <Select objectValue allowClear options={fields} {...props}></Select>


}
function RuleOptions() {
  const compile = useCompile();
  const { values } = useForm();
  const index = ArrayTable.useIndex();
  const { type, options } = values.patterns[index];
  const ruleType = RuleTypes[type];
  return (
    <div
      className={css`
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
      `}
    >
      {Object.keys(options)
        .filter((key) => typeof options[key] !== 'undefined' && ruleType.optionRenders[key])
        .map((key) => {
          const Component = ruleType.optionRenders[key];
          const { title } = ruleType.fieldset[key];
          return Component ? (
            <dl
              key={key}
              className={css`
                margin: 0;
                padding: 0;
              `}
            >
              <dt>{compile(title)}</dt>
              <dd
                className={css`
                  margin-bottom: 0;
                `}
              >
                <Component key={key} value={options[key]} />
              </dd>
            </dl>
          ) : null;
        })}
    </div>
  );
}

const RuleTypes = {
  string: {
    title: `{{t("Fixed text", { ns: "${NAMESPACE}" })}}`,
    optionRenders: {
      value(options = { value: '' }) {
        return <code>{options.value}</code>;
      },
    },
    fieldset: {
      value: {
        type: 'string',
        title: `{{t("Text content", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  },
  integer: {
    title: `{{t("Autoincrement", { ns: "${NAMESPACE}" })}}`,
    optionRenders: {
      digits: function Digits({ value }) {
        return <code>{value}</code>;
      },
      start: function Start({ value }) {
        return <code>{value}</code>;
      },
      cycle: Cron.ReadPretty,
    },
    fieldset: {
      digits: {
        type: 'number',
        title: `{{t("Digits", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          min: 1,
          max: 10,
        },
        required: true,
        default: 1,
        'x-reactions': {
          target: 'start',
          fulfill: {
            schema: {
              'x-component-props.max': '{{ 10 ** $self.value - 1 }}',
            },
          },
        },
      },
      start: {
        type: 'number',
        title: `{{t("Start from", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          min: 0,
        },
        required: true,
        default: 0,
        // 'x-reactions': {
        //   dependencies: ['.start', '.base'],
        //   fulfill: {
        //     schema: {
        //       'x-component-props.max': '{{ ($deps[1] ?? 10) ** ($deps[0] ?? 1) - 1 }}'
        //     }
        //   }
        // }
      },
      cycle: {
        type: 'string',
        title: `{{t("Reset cycle", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        ['x-component']({ value, onChange }) {
          const shortValues = [
            { label: 'No reset', value: 0 },
            { label: 'Daily', value: 1, cron: '0 0 * * *' },
            { label: 'Every Monday', value: 2, cron: '0 0 * * 1' },
            { label: 'Monthly', value: 3, cron: '0 0 1 * *' },
            { label: 'Yearly', value: 4, cron: '0 0 1 1 *' },
            { label: 'Customize', value: 5, cron: '* * * * *' },
          ];
          const option =
            typeof value === 'undefined'
              ? shortValues[0]
              : shortValues.find((item) => {
                  return item.cron == value;
                }) || shortValues[5];
          return (
            <fieldset>
              <AntdSelect value={option.value} onChange={(v) => onChange(shortValues[v].cron)}>
                {shortValues.map((item) => (
                  <AntdSelect.Option key={item.value} value={item.value}>
                    {lang(item.label)}
                  </AntdSelect.Option>
                ))}
              </AntdSelect>
              {option.value === 5 ? <Cron value={value} onChange={onChange} clearButton={false} /> : null}
            </fieldset>
          );
        },
        default: null,
      },
    },
  },
  date: {
    title: `{{t("Date", { ns: "${NAMESPACE}" })}}`,
    optionRenders: {
      format(options = { value: 'YYYYMMDD' }) {
        return <code>{options.value}</code>;
      },

    },
    fieldset: {
      format: {
        type: 'string',
        title: `{{t("Date format", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'required': true
      },
    },
  },
  field:{
    title: `{{t("Field", { ns: "${NAMESPACE}" })}}`,
    optionRenders: {
      textLen({value}){
        return <code>{value && (<>长度: {value} 位</>)}</code>;
      },
      value( { value}) {
        return <code>{value?<Tag>{value?.label}</Tag>:''}</code>;
      }
    },
    fieldset: {
      textLen:{
        type: 'number',
        title: `{{t("Digits", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          min: 1,
          max: 10,
        },
        required: true,
        default: 2,
        'x-reactions': {
          target: 'start',
          fulfill: {
            schema: {
              'x-component-props.max': '{{ 10 ** $self.value - 1 }}',
            },
          },
        }
      },
      value: {
        type: 'string',
        title: `{{t("Select field", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': SelectField,
        'x-component-props':{
          useCurrentFields: '{{ getCurrentFields }}'
        },
        'required': true
      }
    }
  }
};

export function RuleConfigForm(props) {
  const { t } = useTranslation();
  const compile = useCompile();
  const schemaOptions = useContext(SchemaOptionsContext);
  const { values, setValuesIn } = useForm();
  const index = ArrayTable.useIndex();
  const { type, options } = values.patterns[index];
  const ruleType = RuleTypes[type];
  const { token } = useToken();
  const getCurrentFields = useCallback(()=>{
    const {currentFields} = props;
    return currentFields;
  },[props.currentFields]) ;
  return ruleType?.fieldset ? (
    <Button
      type="link"
      onClick={() => {
        // fix https://nocobase.height.app/T-2868
        FormDrawer({ title: compile(ruleType.title), zIndex: token.zIndexPopupBase + 1000 }, () => {
          return (
            <FormLayout layout="vertical">
              <SchemaComponentOptions scope={{...schemaOptions.scope,getCurrentFields}} components={schemaOptions.components}>
                <SchemaComponent
                  schema={{
                    type: 'object',
                    'x-component': 'fieldset',
                    properties: ruleType.fieldset,
                  }}
                />
              </SchemaComponentOptions>
              <FormDrawer.Footer>
                <FormButtonGroup
                  className={css`
                    justify-content: flex-end;
                  `}
                >
                  <Submit
                    onSubmit={(values) => {
                      return values;
                    }}
                  >
                    {t('Submit')}
                  </Submit>
                </FormButtonGroup>
              </FormDrawer.Footer>
            </FormLayout>
          );
        })
          .open({
            initialValues: options,
          })
          .then((values) => {
            setValuesIn(`patterns.${index}`, { type, options: { ...values } });
          })
          .catch((err) => {
            error(err);
          });
      }}
    >
      {t('Configure')}
    </Button>
  ) : null;
}

export const sequence: IField = {
  name: 'sequence',
  type: 'object',
  group: 'advanced',
  order: 3,
  title: `{{t("Sequence", { ns: "${NAMESPACE}" })}}`,
  description: `{{t("Automatically generate codes based on configured rules, supporting combinations of dates, numbers, and text.", { ns: "${NAMESPACE}" })}}`,
  sortable: true,
  default: {
    type: 'sequence',
    uiSchema: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {},
    },
  },
  availableTypes: ['string'],
  hasDefaultValue: false,
  filterable: {
    operators: interfacesProperties.operators.string,
  },
  titleUsable: true,
  schemaInitialize(schema: ISchema, { block, field }) {
    if (block === 'Form') {
      Object.assign(schema['x-component-props'], {
        disabled: !field.inputable,
      });
    }
    return schema;
  },
  properties: {
    ...interfacesProperties.defaultProps,
    unique: interfacesProperties.unique,
    patterns: {
      type: 'array',
      title: `{{t("Sequence rules", { ns: "${NAMESPACE}" })}}`,
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      items: {
        type: 'object',
        properties: {
          sort: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 50, title: '', align: 'center' },
            properties: {
              sort: {
                type: 'void',
                'x-component': 'ArrayTable.SortHandle',
              },
            },
          },
          type: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: `{{t("Type", { ns: "${NAMESPACE}" })}}` },
            // 'x-hidden': true,
            properties: {
              type: {
                type: 'string',
                name: 'type',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': RuleTypeSelect,
              },
            },
          },
          options: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: `{{t("Rule content", { ns: "${NAMESPACE}" })}}` },
            properties: {
              options: {
                type: 'object',
                name: 'options',
                'x-component': RuleOptions,
              },
            },
          },
          operations: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: `{{t("Operations", { ns: "${NAMESPACE}" })}}`,
              dataIndex: 'operations',
              fixed: 'right',
              className: css`
                > *:not(:last-child) {
                  margin-right: 0.5em;
                }
                button {
                  padding: 0;
                }
              `,
            },
            properties: {
              config: {
                type: 'void',
                properties: {
                  options: {
                    type: 'object',
                    'x-component': RuleConfigForm,
                     'x-component-props':{
                       'currentFields':'{{ useCurrentFields() }}'
                     }
                  },
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayTable.Addition',
          'x-component-props': {
            defaultValue: { type: 'integer', options: { digits: 2, start: 1 } },
          },
          title: `{{t("Add rule", { ns: "${NAMESPACE}" })}}`,
        },
      },
    },
    inputable: {
      type: 'boolean',
      title: `{{t("Inputable", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
    },
    match: {
      type: 'boolean',
      title: `{{t("Match rules", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-reactions': {
        dependencies: ['inputable'],
        fulfill: {
          state: {
            value: '{{$deps[0] && $self.value}}',
            visible: '{{$deps[0] === true}}',
          },
        },
      },
    },
  },
};
