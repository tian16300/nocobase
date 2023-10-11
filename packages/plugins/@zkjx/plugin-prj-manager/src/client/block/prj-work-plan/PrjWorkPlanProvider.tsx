import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlockProvider,
  GanttBlockProvider,
  useBlockRequestContext,
  useCollectionManager,
} from '@nocobase/client';
import {  useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { usePrjWorkPlanProcessData } from './scopes';
import { Field } from '@nocobase/database';

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

  const defaultSort = (a, b) => {
    return a.id - b.id;
  };
  const getGroupField = (collection,group)=>{
    const groupCollectionField = getCollectionField([collection,group].join('.'));
    const obj = {
      ...groupCollectionField
    };
    const target = obj.target;
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

  };
  const groupField:any = getGroupField(collection,group);
  const { target } = groupField;
  const options = {
    collection: target,
    resource: target,
    action: 'list',
  }
  const getBlockParams = (groupField,record)=>{
    const { target } = groupField;
    let obj:any = {
      filter: {},
      paginate: false,
    };
    if (target == 'prj_plan') {
      obj.sort = 'id';
      obj.appends = ['prj','stage', 'status'];
      obj.filter = {
        $and: [
          record?{
            prj: {
              id: {
                $eq: record.id
              },
            },
          }:{},
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
            dicCode: {
              $eq: dicCode
            },
          },
        ],
      };
      obj.appends = [];
    }
    return obj;
  }
  const params = getBlockParams(groupField,record);
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
  const field = useField<Field>();
  const {  groupField, sort , ...others } = props;

  const { record, service } = useDataSelectBlockContext();
  const ctx = useBlockRequestContext();
  if (!ctx.service || ctx.service.loading  || !service || service.loading  || !record || !record.id) {
    return null;
  }
  field.loading = ctx.service.loading;
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
    if (!ctx.service?.loading) {
      setParentData(ctx.service?.data?.data);
    }
  }, [ctx.service?.loading]);
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
      <GanttBlockProvider {...others} params={params} sort={sort}  groupField={groupFieldCtx} groupData={parentData} rowKey="rowKey"></GanttBlockProvider>
    </>
  );
};
export const usePrjWorkProviderContext = () => {
  return useContext(PrjWorkProviderContext);
};
export const usePrjWorkFormProviderContext = () => {
  return useContext(PrjWorkFormProviderContext);
};
