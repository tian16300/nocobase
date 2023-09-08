import {
  DetailsBlockProvider,
  RecordProvider,
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
import { forEach, uid } from '@nocobase/utils';
import { createForm } from '@formily/core';
import { Spin } from 'antd';

export const DataSelectBlockContext = createContext<any>({
  block: [],
  setRecord(record){
    this.record = record;
  }
});
const useDataSelectBlockRecord = ()=>{
  const {record} = useDataSelectBlockContext();  
  return {...record};
}
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
    layout: 'inline'
  };
};

export const useFormSelectOptionsProps = (props) => {
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
const schemaForEach = (schema, callback) => {
  forEach(schema.properties, (field, key) => {
    callback(field, key);
    if (field.properties) {
      schemaForEach(field, callback)
    }
  });

}
const InnerRecordProvider = (props) => {
  const { record } = useDataSelectBlockContext();
  // const sourceId = useMemo(() => {
  //   return record['id']
  // }, [record]);
  /**
   * 遍历props.children
   */
  return <RecordProvider record={record}>
    {props.children}
  </RecordProvider>;
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
          //
          const flag = isExistInSchema(block.uid, fieldSchema);
          //shi fou xianshi 
          const blockVisible = true;
          if (flag && blockVisible) {
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
        // setRecord(value);

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
          buid
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
  return (
    <DetailsBlockProvider {...props} recordIsDynamic useRecord={useDataSelectBlockRecord}  params={params} runWhenParamsChanged>
      <InternalDataSelectFieldProvider {...props} field={field} fieldSchema={fieldSchema}></InternalDataSelectFieldProvider>
    </DetailsBlockProvider>
  );
};
DataSelectFieldProvider.displayName = 'DataSelectDesigner';

