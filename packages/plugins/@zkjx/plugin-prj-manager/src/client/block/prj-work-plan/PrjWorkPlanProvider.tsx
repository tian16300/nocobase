import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlockProvider,
  GanttBlockProvider,
  IField,
  useBlockRequestContext,
  useCollectionManager,
  useGanttBlockContext,
} from '@nocobase/client';
import { connect,  useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { createForm, onFormReact } from '@formily/core';
import { usePrjWorkPlanFormDefValue } from './hooks';
import { usePrjWorkPlanProcessData } from './scopes';

const PrjWorkProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});

export const PrjWorkPlanProvider = (props) => {
  const [group, setGroup] = useState(props.group);
  const { getCollectionField } = useCollectionManager();
  const { record, service } = useDataSelectBlockContext();
  if (!service || service.loading || !record || !record.id) {
    return null;
  }
  const collection = props.resource || props.collection;

  const groupCollectionField = getCollectionField([collection,group].join('.'));
  const { target } = groupCollectionField;
  const defaultSort = (a, b) => {
    return a.id - b.id;
  };
  const groupField = useMemo(()=>{
    const groupCollectionField = getCollectionField([collection,group].join('.'));
    const obj = {
      ...groupCollectionField
    };
    if (target == 'prj_plan') {
      obj.title = 'stage.label';
      obj.sort = defaultSort;
    } else if (target == 'users') {
      obj.title = 'nickname';
      obj.sort = (a, b) => {
        const aChildLen = (a.children || []).length;
        const bChildLen = (b.children || []).length;
        return bChildLen - aChildLen;
      };
    } else if (target == 'dicItem') {
      obj.title = 'label';
      obj.sort = defaultSort;
    }

    return obj;

  },[collection,group]);
  const options = useMemo(()=>{
    const { target } = groupCollectionField;
    return {
      collection: target,
      resource: target,
      action: 'list',
    }
  },[groupField]);
 
  const params = useMemo(()=>{
    const {target} = groupField;
    let obj:any = {
      filter: {},
      paginate: false,
    };
    if (target == 'prj_plan') {
      obj.sort = 'id';
      obj.appends = ['prj','stage', 'status'];
      obj.filter = {
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
    } else if (target == 'users') {
      obj.appends = [];
      obj.filter = {};
    } else if (target == 'dicItem') {
      const dicCode = groupField.dicCode;
      obj.filter = {
        $and: [
          {
            dic: {
              code: {
                $eq: dicCode,
              },
            },
          },
        ],
      };
      obj.appends = [];
    }
    return obj;
  },[groupField, record.id]);
  const preProcessData = usePrjWorkPlanProcessData;
  /* 首先获取 项目阶段 */
  /* 获取项目任务 */
  return (
    <>
      <BlockProvider
        block="prj-group"
        {...options}
        params={params}
        runWhenParamsChanged
      >
        <PrjWorkPlanGanttProvider
          {...props}
          groupField={groupField}
          group={group}
          setGroup={setGroup}
          preProcessData={preProcessData}
        ></PrjWorkPlanGanttProvider>
      </BlockProvider>
    </>
  );
};
const PrjWorkPlanGanttProvider = (props) => {
  const { sort, groupField, ...others } = props;

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
    sort: sort,
    appends: ['prj','prjStage','prjStage.stage','user','status','dependencies'],
  };
  const [parentData, setParentData] = useState([]);
  const groupFieldCtx = {
    ...groupField,
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
      <GanttBlockProvider {...others} params={params} sort={sort} groupField={groupFieldCtx} groupData={parentData} rowKey="rowKey">
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
