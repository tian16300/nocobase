import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import { Icon, actionDesignerCss, useCompile, useProps, useRecord, useTableBlockContext, useTableSelectorContext } from '@nocobase/client';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useBomTreeFormBlockContext } from '../bom-tree-form/Provider';

export const BomTreeAddAction = (props) => {
  const {size, type} = useProps(props)
  const {setViewType, loading, setLoading, currentRecord, setCurrentRecord, setFormRecord} = useBomTreeFormBlockContext();
  const record = useRecord();

  const _handleActionClick = () => {
    if(currentRecord?.id && !['GZ','DY'].includes(currentRecord.type)){
      message.warning('只能在工站或者单元下面增加BOM');
      return;
    }
    setLoading(true);
    // const prj = currentRecord?.prj || record;
    // const formRecord:any = {
    //   prj: prj,
    //   prjId: prj.id,
    //   __collectionName: 'bom'
    // }
    // if(currentRecord?.id){
    //   formRecord.parent = currentRecord;
    //   formRecord.parentId = currentRecord.id;
    // }

    // setFormRecord(formRecord);
    setViewType({
      view:'form',
      action:'create'
    })
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  return (
    <div className={actionDesignerCss}>
      {
        <Button
          size={size}
          onClick={_handleActionClick}
          type={type}
        >
          {props.children?.[1]}
          新增BOM
        </Button>
      }
    </div>
  );
};
