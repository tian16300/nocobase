import { Field } from '@formily/core';
import { observer, useField, useForm } from '@formily/react';
import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useRecord } from '../../../record-provider';
import { useCompile } from '../../../schema-component';
import { useCollectionManager } from '../../hooks';
import { IField } from '../../interfaces/types';

export const SourceForeignKey = observer(
  () => {
    const record = useRecord();
    const { getCollection } = useCollectionManager();
    const collection = record?.collectionName ? getCollection(record.collectionName) : record;
    const field = useField<Field>();
    const form = useForm();
    const { getCollectionFields } = useCollectionManager();
    return (
      <div>
        <Select
          allowClear
          placeholder={'留空时，自动生成 FK 字段'}
          disabled={field.disabled}
          value={field.value}
          options={getCollectionFields(collection.name)
            .filter((field) => field.type)
            .map((field) => {
              return {
                label: field?.uiSchema?.title || field.name,
                value: field.name,
              };
            })}
        />
      </div>
    );
  },
  { displayName: 'SourceForeignKey' },
);

export const ThroughForeignKey = observer(
  () => {
    const field = useField<Field>();
    const form = useForm();
    const { getCollectionFields } = useCollectionManager();
    return (
      <div>
        <Select
          allowClear
          popupMatchSelectWidth={false}
          placeholder={'留空时，自动生成 FK 字段'}
          disabled={field.disabled}
          value={field.value}
          options={getCollectionFields(form.values.through)
            .filter((field) => field.type)
            .map((field) => {
              return {
                label: field?.uiSchema?.title || field.name,
                value: field.name,
              };
            })}
        />
      </div>
    );
  },
  { displayName: 'ThroughForeignKey' },
);

export const TargetForeignKey = observer(
  () => {
    const field = useField<Field>();
    const form = useForm();
    const { getCollectionFields } = useCollectionManager();
    return (
      <div>
        <Select
          allowClear
          popupMatchSelectWidth={false}
          placeholder={'留空时，自动生成 FK 字段'}
          disabled={field.disabled}
          value={field.value}
          options={getCollectionFields(form.values.target)
            .filter((field) => field.type)
            .map((field) => {
              return {
                label: field?.uiSchema?.title || field.name,
                value: field.name,
              };
            })}
        />
      </div>
    );
  },
  { displayName: 'TargetForeignKey' },
);

export const SourceCollection = observer(
  () => {
    const record = useRecord();
    const { getCollection } = useCollectionManager();
    const collection = record?.collectionName ? getCollection(record.collectionName) : record;
    const compile = useCompile();
    return (
      <div>
        <Select
          disabled
          popupMatchSelectWidth={false}
          value={collection.name}
          options={[{ value: collection.name, label: compile(collection.title) }]}
        />
      </div>
    );
  },
  { displayName: 'SourceCollection' },
);

export const SourceKey = observer(
  (props: any) => {
    const form = useForm();
    const record = useRecord();
    const { getCollection } = useCollectionManager();
    const collection = record?.collectionName ? getCollection(record.collectionName) : record;
    const compile = useCompile();
    const fields = collection.fields
      .filter(({ type }) => {
        return ['bigInt', 'sequence', 'string'].includes(type);
      })
      .map((field) => {
        return {
          label: compile(field?.uiSchema?.title),
          value: field.name,
        };
      });
    const { value, defaultValue = record?.sourceKey || 'id' } = props;

    return (
      <div>
        <Select
          value={value}
          defaultValue={defaultValue}
          options={fields}
          onChange={(value) => {
            form.setValues({
              ...form.values,
              sourceKey: value
            })
          }}
        />
      </div>
    );
  },
  { displayName: 'SourceKey' },
);

export const TargetKey = observer(
  (props: any) => {
    const form = useForm();
    const record = useRecord();
    const field: IField = useField();
    const target = record?.target || field.query('target').get('value');
    const sourceKey = record?.sourceKey || field.query('sourceKey').get('value');
    const { getCollection, getCollectionField } = useCollectionManager();
    const collection = record?.collectionName ? getCollection(record.collectionName) : record;
    const compile = useCompile();
    const options = useMemo(() => {
      if (target) {
        const source = collection?.name;
        let types = ['bigInt', 'sequence', 'string'];
        if (sourceKey) {
          const sourceField = getCollectionField(`${source}.${sourceKey}`);
          types = [sourceField?.type];
        }

        const fields = getCollection(target).fields;
        return fields
          .filter(({ type }) => {
            return types.includes(type);
          })
          .map((field) => {
            return {
              label: compile(field?.uiSchema?.title || field.name),
              value: field.name,
            };
          });
      } else {
        return [];
      }
    }, [target, sourceKey, collection?.name]);
    const { value, defaultValue = record?.targetKey || record?.foreignKey || 'id' } = props;
    return (
      <div>
        <Select
          value={value}
          defaultValue={defaultValue}
          options={options}
          allowClear
          onChange={(value) => {
            // field.value = value;
           
            // props?.onchange?.(value)
            form.setValues({
              ...form.values,
              targetKey: value
            })
            
          }}
        />
      </div>
    );
  },
  { displayName: 'TargetKey' },
);
