import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BlockProvider,
  css,
  useAPIClient,
  useBlockRequestContext,
  useCollectionManager,
  useFilterBlock,
  useFilterByTk,
  useRecord,
  useRequest,
  useResource,
  useResourceAction,
} from '@nocobase/client';
import { useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { usePrjWorkPlanProcessData } from './scopes';
import { Field } from '@nocobase/database';
import { Spin } from 'antd';
import { GanttBlockProvider } from '@nocobase/plugin-gantt/client';

const PrjWorkPlanProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});



export const PrjWorkPlanProvider = (props) => {
  const {
    form = {
      group: {},
      sort: {},
      range: {},
    },
  } = props;

  const [group, setGroup] = useState(form.group?.default);

  const { getCollectionField } = useCollectionManager();
  const { record, service } = useDataSelectBlockContext();

  if (!service || service.loading || !record || !record.id) {
    return null;
  }
  const collection = props.resource || props.collection;

  
 
  const preProcessData = usePrjWorkPlanProcessData;

  

  const [editing, setEditing] = useState(false);
  const [isFullscreen, setIsFullScreen] = useState(false);
  const [rightSize, setRightSize] = useState(props.rightSize);
  useEffect(() => {
    setRightSize(props.rightSize);
  }, [props.rightSize]);
  const containerRef = useRef<HTMLDivElement>();
  const getPopupContainer = () => {
    return containerRef.current;
  };
  const getGroupResourceAndField = (name, resourceOf)=>{
    let resource, field;
    if(name == 'prjStage'){
      field = {
        ...getCollectionField('task.prjStage'),
        title:'stage.label'
      }
      resource = {
        resource: 'prj.plans',
        resourceOf,
        action: 'list',
        params: {
          pagination: false,
          appends: ['stage', 'status'],
          sort: 'id'
        },
      }
    }else if(name == 'status'){
      resource = {
        resource: 'dicItem',
        action:'list',
        params: {
          pagination: false,
          sort: 'id',
          filter:{
            dicCode:"task_status"
          }
        }
      }
      field = {
        ...getCollectionField('task.status'),
        title:'label'
      }

    }else if(name == 'user'){
      resource = {
        resource: 'users',
        action:'list',
        params: {
          pagination: false,
          sort: 'id'
        }
      }
      field = {
        ...getCollectionField('task.user'),
        title:'nickname'
      }
    }
    return {
      resource,
      field
    }

  }
 const filterByTk = useFilterByTk();
  // const groupField = getCollectionField([props.resource, props.form.group].join('.'));
  const {resource, field} = getGroupResourceAndField(form.group?.default, filterByTk);
  const [groupResource, setGroupResource] = useState(resource);
  const [groupField, setGroupField] = useState(field);

  useEffect(()=>{
    const {resource, field} = getGroupResourceAndField(group, filterByTk);
    setGroupResource(resource)
    setGroupField(field);
  },[group]);
 

  /* 获取项目任务 */
  return (
    <div
      ref={containerRef}
      className={css`
        width: 100%;
        height: 100%;
      `}
    >
      <PrjWorkPlanGanttProvider
        {...props}
        rightSize={rightSize}
        setRightSize={setRightSize}
        editing={editing}
        setEditing={setEditing}
        groupField={groupField}
        groupResource={groupResource}
        group={group}
        setGroup={setGroup}
        preProcessData={preProcessData}
        isFullscreen={isFullscreen}
        setIsFullScreen={setIsFullScreen}
        getPopupContainer={getPopupContainer}
        name={collection}
      ></PrjWorkPlanGanttProvider>
    </div>
  );
};
const PrjWorkPlanGanttProvider = (props) => {
  const field = useField<Field>();
  const { groupField, sort, groupData, editing, setEditing, isFullscreen, setIsFullScreen,groupResource, ...others } = props;
  const { service } = useBlockRequestContext();
  // const ctx = useBlockRequestContext();
  // field.loading = service.loading;
  // const record = useRecord();
  // const params = {
  //   tree: true,
  //   paginate: false,
  //   sort: sort,
  //   appends: ['prj', 'prjStage', 'user', 'status', 'dependencies'],
  // };
  // const [parentData, setParentData] = useState([]);

  // useEffect(() => {
  //   if (!ctx.service?.loading) {
  //     setParentData(ctx.service?.data?.data || []);
  //   }
  // }, [ctx.service?.loading]);
  // useEffect(() => {
  //   params.filter = {
  //     $and: [
  //       {
  //         prj: {
  //           id: {
  //             $eq: record.id,
  //           },
  //         },
  //       },
  //     ],
  //   };
  // }, [record.id]);
  /* 首先获取 项目阶段 */
  /* 获取项目任务 */
  // useEffect(()=>{
  //   console.log('editable 变化了', editable);
  // },[editable]);
  /* 获取项目阶段 */
  // const resource = useResource('prj.plans');
  
  
  const groupService: any = useRequest(
    groupResource,
    {
      uid: 'group',
    },
  );
  useEffect(()=>{
    if(!groupService.loading)
    groupService?.run();
  },[JSON.stringify(groupResource)])
  
  const groupFieldCtx = {
    ...groupField,
    blockCtx: {
      // resource: 'prj.plans',
      service: groupService,
    },
    // title: 'stage.label',
  };
  return (
    <PrjWorkPlanProviderContext.Provider
      value={{
        editing,
        setEditing,
        service,
        isFullscreen,
        setIsFullScreen,
        groupFieldCtx,
      }}
    >
     { !groupService.loading?
     <GanttBlockProvider
        {...others}
        setEditing={setEditing}
        editing={editing}
        isFullscreen={isFullscreen}
        setIsFullScreen={setIsFullScreen}
        sort={sort}
        params={{
          appends: ['prjStage', 'prjStage.stage', 'prjStage.status', 'user', 'status', 'dependencies'],
        }}
        groupField={groupFieldCtx}
        groupData={groupService?.data?.data}
        rowKey="rowKey"
      ></GanttBlockProvider>:<></>}
    </PrjWorkPlanProviderContext.Provider>
  );
};
export const usePrjWorkPlanProviderContext = () => {
  return useContext(PrjWorkPlanProviderContext);
};
export const usePrjWorkFormProviderContext = () => {
  return useContext(PrjWorkFormProviderContext);
};
