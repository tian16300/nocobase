import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlockProvider,
  CollectionProvider,
  FormBlockProvider,
  IField,
  TableBlockProvider,
  TableSelectorProvider,
  WithoutFormFieldResource,
  WithoutTableFieldResource,
  css,
  findFilterTargets,
  mergeFilter,
  removeNullCondition,
  useAPIClient,
  useFilterBlock,
  useParamsFromRecord,
  useRecord,
  useResource,
  useTableBlockContext,
  useTableSelectorContext,
} from '@nocobase/client';
import { RecursionField, useFieldSchema, observer, useField, connect, mapProps, mapReadPretty } from '@formily/react';
import { flattenTree } from '@nocobase/utils';

import { Spin } from 'antd';
const BomTreeFormBlockContext = createContext<any>({});
export const BomTreeFormBlockProvider = (props) => {
  const { children, ...others } = props;
  return (
    // <CollectionProvider name='bom'>
    <TableBlockProvider name="bom-tree" {...others}>
      <InnerTreeFormBlockProvider {...props}></InnerTreeFormBlockProvider>
    </TableBlockProvider>
    // </CollectionProvider>
  );
};
const InnerTreeFormBlockProvider = (props) => {
  // const ctx = useTableSelectorContext();
  const ctx = useTableBlockContext();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const [view, setView] = useState('table');
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  // const [formRecord, setFormRecord] = useState(null);
  const [countTableView, setCountTableView] = useState({
    view: 'table',
    action: 'list',
  });
  const [viewType, setViewType] = useState({
    view: 'table',
    action: 'list',
  });
  const [loading, setLoading] = useState(false);
  const [userCanceled, setUserCanceled] = useState(false);
  const __parent = useRecord();
  const actionFieldSchema = useMemo(() => {
    const props =
      viewType.action == 'create'
        ? {
            isRecord: true,
          }
        : {};
    return {
      type: 'void',
      'x-action': viewType.action,
      'x-component-props': {
        ...(props || {}),
      },
    };
  }, [viewType.action]);
  const { getDataBlocks } = useFilterBlock();
  const onSelect = (keys) => {
    // setLoading(true);
    // setTimeout(() => {

    //   // setLoading(false);
    // }, 300);

    if (viewType.view == 'form') {
      setLoading(true);
    } else {
      onFilter(keys);
    }
    if (keys && keys.length) {
      const data = flattenTree(ctx?.service?.data?.data || [], []);
      const record = data.find(({ id }) => {
        return id == keys[0];
      });
      setSelectedKey(keys[0]);
      setCurrentRecord({
        ...record,
        __parent,
        __collectionName: 'bom',
      });
      if (['GZ', 'DY'].includes(record.type)) {
        setViewType(countTableView);
        ctx.field.data = ctx?.field?.data || {};
        ctx.field.data.selectedRowKeys = keys;
      } else {
        // setView('form');
        setViewType({
          view: 'form',
          action: 'get',
        });
      }
    } else {
      setSelectedKey([]);
      setCurrentRecord(null);
      setViewType(countTableView);
      setUserCanceled(true);
      ctx.field.data = ctx?.field?.data || {};
      ctx.field.data.selectedRowKeys = [];
    }
    if (viewType.view == 'form') {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };
  const onFilter = (value) => {
    const { targets, uid } = findFilterTargets(fieldSchema);
    const dataBlocks = getDataBlocks();
    // 如果是之前创建的区块是没有 x-filter-targets 属性的，所以这里需要判断一下避免报错
    //  if (!targets || !targets.some((target) => dataBlocks.some((dataBlock) => dataBlock.uid === target.uid))) {
    //   // 当用户已经点击过某一行，如果此时再把相连接的区块给删除的话，行的高亮状态就会一直保留。
    //   // 这里暂时没有什么比较好的方法，只是在用户再次点击的时候，把高亮状态给清除掉。
    //   // setSelectedRow((prev) => (prev.length ? [] : prev));
    //   return;
    // }
    // const value = keys;
    dataBlocks.forEach((block) => {
      const target = targets.find((target) => target.uid === block.uid);
      if (!target) return;

      const param = block.service.params?.[0] || {};
      // 保留原有的 filter
      const storedFilter = block.service.params?.[1]?.filters || {};
      // debugger;
      // const

      storedFilter[uid] = {
        $and: [
          {
            [target.field || ctx.rowKey]: {
              [target.field ? '$in' : '$eq']: value,
            },
          },
        ],
      };

      const mergedFilter = mergeFilter([
        ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
        block.defaultFilter,
      ]);

      return block.doFilter(
        {
          ...param,
          page: 1,
          filter: mergedFilter,
        },
        { filters: storedFilter },
      );
    });
  };
  const formRecord = useMemo(() => {
    const isCreateForm = viewType.action == 'create' && viewType.view == 'form';
    const isUpdateForm = viewType.action == 'get' && viewType.view == 'form';
    if(isUpdateForm){
      return currentRecord;
    }
    if(isCreateForm){
      const prj = currentRecord?.prj || __parent;
      const value:any = {
        prj: prj,
        prjId: prj.id,
        __collectionName: 'bom',
        __parent
      }
      if(currentRecord?.id){
        value.parent = currentRecord;
        value.parentId = currentRecord.id;
      }
      return value;
    }else{
      return  {
        __collectionName: 'bom',
        __parent      
      };
    }
   

  },[currentRecord?.id, viewType?.action]);

  return (
    <BomTreeFormBlockContext.Provider
      value={{
        ...ctx,
        view,
        selectedKey,
        currentRecord,
        setView,
        field,
        onSelect,
        viewType,
        setViewType,
        loading,
        setLoading,
        countTableView,
        setCountTableView,
        actionFieldSchema,
        formRecord,
        // setFormRecord,
        onFilter,
        userCanceled
      }}
    >
      {props.children}
    </BomTreeFormBlockContext.Provider>
  );
};
export const useBomTreeFormBlockContext = () => {
  return useContext(BomTreeFormBlockContext);
};

export const BomFormBlockProvider = (props) => {
  const api = useAPIClient();
  const { resource: _resource, ...others } = props;
  // const resource = api.resource('bom');
  // const resource = useResource('bom')
  const { viewType } = useBomTreeFormBlockContext();
  const actionProps =
    viewType.action == 'create'
      ? {}
      : {
          action: 'get',
          useParams: useParamsFromRecord,
        };
  return <FormBlockProvider {...others} name={'bom-form'} resource={_resource} {...actionProps}></FormBlockProvider>;
};

export const BomTreeFormTableBlockProvider = observer((props) => {
  const { children, ...others } = props;
  const fieldSchema = useFieldSchema();
  const { viewType, loading, currentRecord, selectedKey, onFilter } = useBomTreeFormBlockContext();
  const field: IField = useField();

  return (
    <>
      <div
        className={css`
          overflow-x: hidden;
          height: 100%;
          .ant-nb-card-item .card {
            margin-bottom: 0px !important;
          }
          .table-inner-block-wrap {
            height: 633px !important;
          }
        `}
      >
        {/* {props?.children} */}
        <CollectionProvider name="prj">
          {/* {loading ? (
            <div
              className={css`
                padding-top: 40px;
                text-aligh: center;
              `}
            >
              <Spin></Spin>
            </div>
          ) : (
            <>
              {viewType.view == 'table' && (
                <RecursionField name={'table'} schema={fieldSchema.properties.table} basePath={field.address} />
              )}
              {viewType.view == 'countTable' && (
                // <TableBlockProvider >
                <RecursionField
                  name={'countTable'}
                  schema={fieldSchema.properties.countTable}
                  basePath={field.address}
                />
                // </TableBlockProvider>
              )}
            </>
          )} */}
          <>
            {viewType.view == 'table' && (
              <RecursionField name={'table'} schema={fieldSchema.properties.table} basePath={field.address} />
            )}
            {viewType.view == 'countTable' && (
              // <TableBlockProvider >
              <RecursionField name={'countTable'} schema={fieldSchema.properties.countTable} basePath={field.address} />
              // </TableBlockProvider>
            )}
          </>
        </CollectionProvider>
      </div>
    </>
  );
});
