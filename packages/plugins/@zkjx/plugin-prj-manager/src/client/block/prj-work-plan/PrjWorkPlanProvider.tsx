import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BlockProvider,
  GanttBlockProvider,
  css,
  useAPIClient,
  useBlockRequestContext,
  useCollectionManager,
  useFilterBlock,
  useRecord,
} from '@nocobase/client';
import { useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { usePrjWorkPlanProcessData } from './scopes';
import { Field } from '@nocobase/database';
import { Spin } from 'antd';

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

  const defaultSort = (a, b) => {
    return a.id - b.id;
  };
  const getGroupField = (collection, group) => {
    const groupCollectionField = getCollectionField([collection, group].join('.'));
    const obj = {
      ...groupCollectionField,
    };
    const target = obj.target;
    if (target == 'prj_plan_latest') {
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
  const getBlockParams = (groupField, record) => {
    const { target } = groupField;
    let obj: any = {
      filter: {},
      paginate: false,
    };
    if (target == 'prj_plan_latest') {
      obj.sort = 'id';
      obj.appends = ['prj', 'stage', 'status'];
      obj.filter = {
        $and: [
          record
            ? {
                prj: {
                  id: {
                    $eq: record.id,
                  },
                },
              }
            : {},
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
              $eq: dicCode,
            },
          },
        ],
      };
      obj.appends = [];
    }
    return obj;
  };
  const preProcessData = usePrjWorkPlanProcessData;

  const groupField: any = useMemo(() => {
    return getGroupField(collection, group);
  }, [collection, group]);
  /* 首先获取 项目阶段 */
  const options = useMemo(() => {
    const { target } = groupField;
    return {
      collection: target,
      resource: target,
      action: 'list',
    };
  }, [groupField]);
  const params = useMemo(() => {
    return {
      ...getBlockParams(groupField, record),
    };
  }, [groupField]);

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

  /* 获取项目任务 */
  return (
    <div
      ref={containerRef}
      className={css`
        width: 100%;
        height: 100%;
      `}
    >
      {service.loading || !record?.id ? (
        <Spin />
      ) : (
        <BlockProvider name={options.collection} {...options} params={params}>
          <PrjWorkPlanGanttProvider
            {...props}
            rightSize={rightSize}
            setRightSize={setRightSize}
            editing={editing}
            setEditing={setEditing}
            groupField={groupField}
            group={group}
            setGroup={setGroup}
            preProcessData={preProcessData}
            isFullscreen={isFullscreen}
            setIsFullScreen={setIsFullScreen}
            getPopupContainer={getPopupContainer}
            name={collection}
          ></PrjWorkPlanGanttProvider>
        </BlockProvider>
      )}
    </div>
  );
};
const PrjWorkPlanGanttProvider = (props) => {
  const field = useField<Field>();
  const { groupField, sort, groupData, editing, setEditing, isFullscreen, setIsFullScreen, ...others } = props;
  const { service } = useBlockRequestContext();
  const ctx = useBlockRequestContext();
  field.loading = service.loading;
  const record = useRecord();
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
    appends: ['prj', 'prjStage', 'user', 'status', 'dependencies'],
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
      setParentData(ctx.service?.data?.data || []);
    }
  }, [ctx.service?.loading]);
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
      {record?.id && !service.loading ? (
        <GanttBlockProvider
          {...others}
          setEditing={setEditing}
          editing={editing}
          isFullscreen={isFullscreen}
          setIsFullScreen={setIsFullScreen}
          params={{...params,filter: {
            $and: [
              {
                prj: {
                  id: {
                    $eq: record.id,
                  },
                },
              },
            ],
          }}}
          sort={sort}
          groupField={groupFieldCtx}
          groupData={parentData}
          rowKey="rowKey"
        ></GanttBlockProvider>
      ) : (
        <Spin />
      )}
    </PrjWorkPlanProviderContext.Provider>
  );
};
export const usePrjWorkPlanProviderContext = () => {
  return useContext(PrjWorkPlanProviderContext);
};
export const usePrjWorkFormProviderContext = () => {
  return useContext(PrjWorkFormProviderContext);
};
