import {
  DetailsBlockProvider,
  RecordProvider,
  SchemaComponentOptions,
  SchemaInitializerContext,
  SchemaInitializerProvider,
  useBlockRequestContext,
  IField,
  FixedBlockWrapper,
} from '@nocobase/client';
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { onFieldValueChange } from '@formily/core';
import {
  mergeFilter,
  removeNullCondition,
  useFilterBlock,
} from '@nocobase/client';
import { uid } from '@nocobase/utils';
import { DataSelectBlockInitializer } from './DataSelectBlockInitializer';
import { DataSelectDesigner } from './DataSelectDesigner';
import debounce from 'lodash/debounce';
import { createForm } from '@formily/core';
import { Spin } from 'antd';
// import { DetailsBlockProvider } from '@nocobase/client/src/block-provider/DetailsBlockProvider';

export const DataSelectBlockContext = createContext<any>({
  block: []
});

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
  const ctx = useContext(DataSelectBlockContext);
  return {
    ...ctx
  };
};

const useFormSelectBlockProps = () => {
  const ctx = useDataSelectBlockContext();
  return {
    form: ctx?.form,
  };
};

const useFormSelectOptionsProps = (props) => {
  const { resource, action, params } = useDataSelectBlockContext();
  const { filter } = params;
  const field: IField = useField();
  return {
    ...props,
    multiple: false,
    service: {
      resource,
      action,
      params: {
        filter
      },
    },
    fieldNames: {
      label: 'title',
      value: 'id',
    },
    onChange(value) {
      field.setValue(value);
    }
  };
};
const InnerRecordProvider = (props) => {
  const { record } = useDataSelectBlockContext();
  return <RecordProvider record={record} parent={true}>{props.children}</RecordProvider>;
};
const isExistInSchema = (uid, fieldSchema) => {
  if (fieldSchema['x-uid'] == uid) {
    return true
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
}
const InternalDataSelectFieldProvider = (props) => {
  const { readPretty, buid, field, runIndex } = props;
  const fieldSchema = useFieldSchema();
  const { getDataBlocks } = useFilterBlock();
  // const field = useField<any>();
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
  const records = service?.data?.data || [];
  const record = useMemo(() => {
    return service?.data?.data[0];
  }, [service?.loading]);
  /**
   * refresh children
   */
  useEffect(() => {
    const id = uid();
    const refreshSelf = (value) => {
      const dataBlocks = getDataBlocks();
      /**
       * 筛选 datablocks
       */
      const blocks = dataBlocks.filter((block) => {
        return block.uid == fieldSchema['x-uid'];
      });
      //刷新自己
      return blocks.forEach(async (block) => {
        return await blockDoFilter(block, () => {
          return {
            [uid()]: {
              $and: [
                {
                  ['id']: {
                    $in: [value.id],
                  },
                },
              ],
            },
          };
        });
      });

    }
    const refreshChildren = () => {
      const dataBlocks = getDataBlocks();
      /**
       * 筛选 datablocks
       */
      //刷新子区块
      dataBlocks.forEach(async (block) => {
        if (block.uid !== fieldSchema['x-uid']) {
          let flag = isExistInSchema(block.uid, fieldSchema);
          if (flag) {
            block?.service?.refresh();
          }
        }
      });

    };
    form.addEffects(id, () => {
      // onFormValuesChange((form) => {
      onFieldValueChange('id', async (field) => {
        const value = {
          id: field.value
        };
        await refreshSelf(value);
      });
      if (!service.loading) {
        form.setInitialValues(record || {});
        field.value = record;
        if (record) {
          refreshChildren();
        } else {
          /* 如果没有数据则清空 dataSource */
        }
      }
    });
    return () => {
      form.removeEffects(id);
    };
  }, [fieldSchema, service?.loading]);
  return (
    <FixedBlockWrapper>
      <DataSelectBlockContext.Provider
        value={{
          ...props,
          field,
          form,
          service,
          records,
          record,
          params,
          buid,
          runIndex
        }}
      >
        <InnerRecordProvider {...props}></InnerRecordProvider>
      </DataSelectBlockContext.Provider>
    </FixedBlockWrapper>
  );
};
export const DataSelectFieldProvider = (props) => {
  const params = { ...props.params };
  const field = useField();
  const fieldSchema = useFieldSchema();
  const runIndex = useRef(0);
  runIndex.current++;
  return (

    <DetailsBlockProvider {...props} params={params} runWhenParamsChanged>
      <InternalDataSelectFieldProvider {...props} field={field} fieldSchema={fieldSchema} runIndex={runIndex}></InternalDataSelectFieldProvider>
    </DetailsBlockProvider>
  );
};
DataSelectFieldProvider.displayName = 'DataSelectDesigner';

export const DataSelectProvider = React.memo((props) => {
  const items = useContext<any>(SchemaInitializerContext);
  const children = items.BlockInitializers.items[0].children;
  useEffect(() => {
    if (!children.find((item) => item.component === 'DataSelectBlockInitializer')) {
      children.push({
        key: 'dataSelectBlock',
        type: 'item',
        title: '下拉列表',
        component: 'DataSelectBlockInitializer',
      });
    }
  }, []);
  return (
    <SchemaInitializerProvider>
      <SchemaComponentOptions
        scope={{ useFormSelectBlockProps, useFormSelectOptionsProps }}
        components={{ DataSelectBlockInitializer, DataSelectDesigner, DataSelectFieldProvider }}
      >
        {props.children}
      </SchemaComponentOptions>
    </SchemaInitializerProvider>
  );
});
DataSelectProvider.displayName = 'DataSelectProvider';
