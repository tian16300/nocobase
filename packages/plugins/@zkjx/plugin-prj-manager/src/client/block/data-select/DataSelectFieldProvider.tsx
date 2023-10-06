import { DetailsBlockProvider, useBlockRequestContext, css } from '@nocobase/client';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { mergeFilter } from '@nocobase/client';
import { forEach, uid } from '@nocobase/utils';
import { createForm } from '@formily/core';
import { Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
export const DataSelectBlockContext = createContext<any>({});
const useDataSelectBlockRecord = () => {
  const { record } = useDataSelectBlockContext();
  return record;
};
export const useDataSelectBlockContext = () => {
  return useContext(DataSelectBlockContext);
};

export const useFormSelectBlockProps = () => {
  const ctx = useDataSelectBlockContext();
  return {
    form: ctx?.form,
    layout: 'inline',
    size: 'large',
    className: css`
      .ant-formily-item-control-content-component {
        display: flex;
        align-items: center;
      }
    `,
  };
};

export const useFormSelectOptionsProps = (props) => {
  const { resource, action, params, service } = useDataSelectBlockContext();
  const { filter = [], sort = [] } = params;
  return {
    ...props,
    multiple: false,
    service: {
      resource,
      action,
      params: {
        filter,
        sort,
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
  return (
    <div
      className={css`
        .ant-tabs-tabpane {
          &,
          & .ant-nb-gantt {
            height: calc(100vh - 50px - 52px - 24px * 2 - 24px * 2 - 52px - 46px - 16px);
          }
        }
      `}
    >
      {props.children}
    </div>
  );
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
  const { buid, field } = props;
  const form = createForm({});
  const params = { ...props.params };
  const { service } = useBlockRequestContext();
  const record = useMemo(() => {
    return service?.data?.data[0];
  }, [service?.data?.data]);
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
  }, [service?.loading, form, record]);

  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  field.loaded = true;
  return (
    <DataSelectBlockContext.Provider
      value={{
        ...props,
        field,
        form,
        service,
        record,
        params,
        buid,
      }}
    >
      <InnerRecordProvider {...props}></InnerRecordProvider>
    </DataSelectBlockContext.Provider>
  );
};
export const DataSelectFieldProvider = (props) => {
  //首次加载使用 id
  const [searchParams] = useSearchParams();
  const params = { ...props.params };
  const field = useField();
  const fieldSchema = useFieldSchema();
  const id = searchParams.get('id');
  let filterArr = [];
  if (params.filter) {
    filterArr = [...Object.values(params.filter)];
  }
  if (id) {
    filterArr.push({
      id: {
        $eq: id,
      },
    });
  }
  if (filterArr.length > 0) {
    params.filter = mergeFilter(filterArr);
  }
  return (
    <div
      className={css`
        height: calc(100vh - 52px - 40px - 24px * 2 - 10px);
        > div {
          height: 100%;
          > .ant-nb-card-item {
            height: 100%;
            > .card {
              height: 100%;
              margin-bottom: 0;
            }
          }
        }
      `}
    >
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
