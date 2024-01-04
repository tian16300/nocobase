import {
  CollectionProvider,
  CreateRecordAction,
  RecordProvider,
  actionDesignerCss,
  useRecord,
  useTableBlockContext,
} from '@nocobase/client';
import React, { useMemo } from 'react';
import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';

export const ExpectCgApplyAction = observer((props) => {
  /* 获取项目 */
  const __parent = useRecord();
  const prj = __parent?.__parent;
  const ctx = useTableBlockContext();


  const record = useMemo(() => {
    //物料明细
    if (ctx?.field?.data?.selectedRowKeys) {
      const selectedRows = ctx?.field?.data?.selectedRowKeys;

      const rows = ctx?.service.data?.data?.filter(({ id }) => {
        return selectedRows?.includes(id);
      });
      const list = rows.map((row) => {
        return {
          //bom 字段 与 采购需求 字段的映射关系
          bom_wl: row,
          bom_wl_id: row?.id,
          bom: row.bom,
          bom_id: row.bom_id,       
          wl: row?.wl,
          wl_id: row?.wl_id,   
          unit: row?.base_unit,
          unit_id: row?.base_unit_id,
          prj_wl_stock: row?.prj_wl_stock,
          prj_wl_stock_id: row?.prj_wl_stock_id,
          public_wl_stock: row?.public_wl_stock,
          public_wl_stock_id: row?.public_wl_stock_id,
          prj: prj,
          prjId: prj?.id,
        };
      });

      return {
        prj: prj,
        prjId: prj?.id,
        bom_wl_list: list,
        __parent: prj
      };
    } else {
      return {
        prj: prj,
        prjId: prj?.id,
        bom_wl_list: [],
        __parent: prj
      };
    }
  }, [ctx?.field?.data?.selectedRowKeys]);
  return (
    <CollectionProvider name={'expect_cg_apply'}>
      <div className={actionDesignerCss}>
        <RecordProvider record={record} isMemo={true}>
          <CreateRecordAction {...props}></CreateRecordAction>
          {props.children?.[1]}
        </RecordProvider>
      </div>
    </CollectionProvider>
  );
},{
  displayName:'ExpectCgApply.Action'
});
