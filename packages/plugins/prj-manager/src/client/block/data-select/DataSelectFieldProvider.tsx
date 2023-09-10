import {
  DetailsBlockProvider,
  RecordProvider,
  useBlockRequestContext,
  IField,
  FixedBlockWrapper,
  css,
} from '@nocobase/client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { mergeFilter, removeNullCondition } from '@nocobase/client';
import { forEach, uid } from '@nocobase/utils';
import { createForm } from '@formily/core';
import { Spin } from 'antd';
export const DataSelectBlockContext = createContext<any>({});
const useDataSelectBlockRecord = () => {
  const { record } = useDataSelectBlockContext();
  return record;
};
const blockDoFilter = async (block, useCondition) => {
  const param = block.service.params?.[0] || {};
  // 保留原有的 filter
  const storedFilter = block.service.params?.[1]?.filters || {};
  const otherFilter = useCondition(storedFilter, block.defaultFilter);
  const mergedFilter = mergeFilter([
    ...Object.values({ ...storedFilter, ...otherFilter }).map((filter) => removeNullCondition(filter)),
    block.defaultFilter,
  ]);
  return await block.doFilter(
    {
      ...param,
      page: 1,
      filter: mergedFilter,
    },
    { filters: storedFilter },
  );
};

export const useDataSelectBlockContext = () => {
  return useContext(DataSelectBlockContext);
};

export const useFormSelectBlockProps = () => {
  const ctx = useDataSelectBlockContext();
  return {
    form: ctx?.form,
    layout: 'inline',
    size: 'large'
  };
};

export const useFormSelectOptionsProps = (props) => {
  const { resource, action, params, service } = useDataSelectBlockContext();
  const { filter } = params;
  // const field: IField = useField();
  return {
    ...props,
    multiple: false,
    service: {
      resource,
      action,
      params: {
        filter,
        appends: ['status'],
      },
    },
    fieldNames: {
      label: 'title',
      value: 'id',
    },
    onChange: async (val) => {
      service.params[0].filter = {
        $and: [
          {
            id: {
              $eq: val,
            },
          },
        ],
      };
      service.loading = true;
      await service.refresh();
      service.loading = false;

    },
  };
};
const schemaForEach = (schema, callback) => {
  forEach(schema.properties, (field, key) => {
    callback(field, key);
    if (field.properties) {
      schemaForEach(field, callback);
    }
  });
};
const InnerRecordProvider = (props) => {
  const { form, setRecord, service } = useDataSelectBlockContext();
  const field = useField();
  useEffect(() => {
    const id = uid();
    form.addEffects(id, () => {
      // onFormValuesChange((form) => {
      //   // setRecord(form.values);
      //   debugger;
      // });
    });
    return () => {
      form.removeEffects(id);
    };
  }, [form]);
  return <>{props.children}</>;
};
const isExistInSchema = (uid, fieldSchema) => {
  if (fieldSchema['x-uid'] == uid) {
    return true;
  } else {
    let flag = null;
    const props = fieldSchema.properties || {};
    const values = Object.values(props);
    for (let i = 0, len = values.length; i < len; i++) {
      const p = values[i];
      flag = isExistInSchema(uid, p);
      if (flag) {
        break;
      }
    }
    return flag;
  }
};
const InternalDataSelectFieldProvider = (props) => {
  const { readPretty, buid, field } = props;
  const fieldSchema = useFieldSchema();
  const form = useMemo(
    () =>
      createForm({
        readPretty,
      }),
    [],
  );
  const params = { ...props.params };
  const { service } = useBlockRequestContext();
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  field.loaded = true;
  // const [record, setRecord] = useState(service?.data?.data[0]);
  const record = useMemo(() => {
    return service.data.data[0];
  }, [service?.data?.data[0]])
  useEffect(() => {
    const id = uid();
    form.addEffects(id, () => {
      if (!service.loading) {
        form.setInitialValues(record || {});
      }
    });
    return () => {
      form.removeEffects(id);
    };
  }, [fieldSchema, service?.loading]);

  return (
    <DataSelectBlockContext.Provider
      value={{
        ...props,
        field,
        form,
        service,
        record,
        // setRecord,
        params,
        buid,
      }}
    >
      <InnerRecordProvider {...props}></InnerRecordProvider>
    </DataSelectBlockContext.Provider>
  );
};
export const DataSelectFieldProvider = (props) => {
  const params = { ...props.params };
  const field = useField();
  const fieldSchema = useFieldSchema();
  return (
    <div className={css`
     height: calc(100vh - 52px - 40px - 24px*2 - 10px);
     > div {
      height:100%;
      > .ant-nb-card-item{
        height: 100%;
        > .card {
          height: 100%;
          margin-bottom: 0;
        }

      }
     }
    `}>
      <DetailsBlockProvider
        uid="data-select-field"
        {...props}
        recordIsDynamic
        useRecord={useDataSelectBlockRecord}
        params={params}
        runWhenParamsChanged
      >
        <InternalDataSelectFieldProvider
          {...props}
          field={field}
          fieldSchema={fieldSchema}
        ></InternalDataSelectFieldProvider>
      </DetailsBlockProvider>
    </div>
  );
};
DataSelectFieldProvider.displayName = 'DataSelectDesigner';
