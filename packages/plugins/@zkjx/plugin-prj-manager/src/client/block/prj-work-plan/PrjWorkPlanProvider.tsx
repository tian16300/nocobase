import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AsyncDataProvider,
  BlockProvider,
  GanttBlockContext,
  GanttBlockProvider,
  IField,
  TableBlockProvider,
  useAsyncData,
  useBlockRequestContext,
  useGanttBlockContext,
} from '@nocobase/client';
import { connect, observer, useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { createForm, onFormReact } from '@formily/core';
import { usePrjWorkPlanFormDefValue } from './hooks';
import { dayjs } from '@nocobase/utils';
// import Card from 'packages/core/client/src/board/Card';
import { Card } from 'antd';
import { usePrjWorkPlanProcessData } from './scopes';

const PrjWorkProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});

const PrjWorkPlanProviderInner = (props) => {
  const { fieldNames, timeRange } = props;
  const field = useField();
  const { resource, service, __parent } = useBlockRequestContext();

  return (
    <GanttBlockContext.Provider
      value={{
        field,
        service,
        resource,
        fieldNames,
        timeRange,
      }}
    >
      {props.children}
    </GanttBlockContext.Provider>
  );
};
export const PrjWorkPlanProvider = (props) => {
  const { record, service } = useDataSelectBlockContext();
  if (!service || service.loading || !record || !record.id) {
    return null;
  }
  // const [recordId, setRecordId] = useState(record.id);
  const options: any = {
    collection: 'prj_plan',
    resource: 'prj_plan',
    action: 'list',
    // fieldNames: {
    //   id: 'id',
    //   title: 'stage',
    //   start: 'start',
    //   end: 'end',
    //   range: 'day',
    // },
    // params: {
    //   paginate: false,
    //   filter: {
    //     $and: [
    //       {
    //         prj: {
    //           id: {
    //             $eq: record.id,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
  };
  const appends = ['stage', 'status'];

  // Object.assign(props, ...options);
  // props.params= options.params;

  // return <GanttBlockProvider {...props} params={options.params}></GanttBlockProvider>;
  const params = {
    filter: {
      $and: [
        {
          prj: {
            id: {
              $eq: record.id,
            },
          },
        },
      ],
    },
    tree: true,
    paginate: false,
    sort: 'id',
    // sort: 'stage_dicId',
    // , sort: props.fieldNames.start
  };
  // const taskOptions: any = {
  //   collection: 'task',
  //   resource: 'task',
  //   action: 'list',
  // };
  const preProcessData = usePrjWorkPlanProcessData;
  useEffect(() => {
    params.filter = {
      $and: [
        {
          prj: {
            id: {
              $eq: record.id,
            },
          },
        },
      ],
    };
  }, [record.id]);
  /* 首先获取 项目阶段 */
  /* 获取项目任务 */
  return (
    <>
      <BlockProvider block="prj-plan" {...options} params={{ ...params, appends }} preProcessData={preProcessData}>
        <PrjWorkPlanGanttProvider {...props} preProcessData={preProcessData}></PrjWorkPlanGanttProvider>
      </BlockProvider>
    </>
  );
};
const PrjWorkPlanGanttProvider = (props) => {
  const { record, service } = useDataSelectBlockContext();
  const ctx = useBlockRequestContext();
  if (!service || service.loading || !record || !record.id) {
    return null;
  }
  if (ctx.service.loading) {
    return null;
  }
  const params = {
    filter: {
      $and: [
        {
          prj: {
            id: {
              $eq: record.id,
            },
          },
        },
      ],
    },
    tree: true,
    paginate: false,
    // sort: 'stage_dicId',
    // , sort: props.fieldNames.start
  };
  const [parentData, setParentData] = useState([]);
  const groupField = {
    name: 'prjStage',
    target: 'prj_plan',
    sourceKey: 'id',
    targetKey: 'id',
    title: 'stage.label',
    blockCtx: {
      resource: ctx.resource,
      service: ctx.service,
    },
  };

  useEffect(() => {
    if (ctx.service?.data?.data) {
      setParentData(ctx.service?.data?.data);
    }
  }, [ctx.service?.data?.data]);
  useEffect(() => {
    params.filter = {
      $and: [
        {
          prj: {
            id: {
              $eq: record.id,
            },
          },
        },
      ],
    };
  }, [record.id]);
  /* 首先获取 项目阶段 */
  /* 获取项目任务 */
  return (
    <>
      <GanttBlockProvider {...props} params={params} groupField={groupField} groups={parentData} rowKey="rowKey">
        <PrjWorkPlanInnerProvider {...props} groups={parentData}></PrjWorkPlanInnerProvider>
      </GanttBlockProvider>
    </>
  );
};
const PrjWorkPlanInnerProvider = (props) => {
  const { groups } = props;
  const { __parent } = useBlockRequestContext();
  const ctx = useGanttBlockContext();
  const field: IField = useField();
  if (ctx.service.loading || __parent.service.loading) {
    field.loading = true;
  } else {
    field.loading = false;
  }
  return (
    <PrjWorkProviderContext.Provider value={{ ...ctx, field, groups }}>
      {props.children}
    </PrjWorkProviderContext.Provider>
  );
};
const PrjWorkFormProvider = connect((props) => {
  const { service } = useDataSelectBlockContext();
  const form = createForm({
    effects() {
      const defVal = usePrjWorkPlanFormDefValue();
      onFormReact((form) => {
        form.values = defVal;
      });
    },
  });
  if (service.loading) {
    return;
  }
  return (
    <PrjWorkFormProviderContext.Provider
      value={{
        form: form,
      }}
    >
      {props.children}
    </PrjWorkFormProviderContext.Provider>
  );
});

export const usePrjWorkProviderContext = () => {
  return useContext(PrjWorkProviderContext);
};
export const usePrjWorkFormProviderContext = () => {
  return useContext(PrjWorkFormProviderContext);
};
