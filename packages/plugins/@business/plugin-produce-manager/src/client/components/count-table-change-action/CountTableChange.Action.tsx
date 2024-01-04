import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import { Icon, actionDesignerCss, useCompile, useProps, useTableBlockContext, useTableSelectorContext, useToken } from '@nocobase/client';
import { Button, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useBomTreeFormBlockContext } from '../bom-tree-form/Provider';

export const CountTableChangeAction = (props) => {
  // const { useProps, ...others } = props;
  // const others1 = useProps?.() || {};
  // const { expandFlag, size, setExpandFlag } = { ...others, ...others1 } as any;
  const schema = useFieldSchema();
  const ctxSelector = useTableSelectorContext();
  const ctxBlock = useTableBlockContext();
  const isTableSelector = schema.parent?.parent?.['x-decorator'] === 'TableSelectorProvider';
  const ctx = isTableSelector ? ctxSelector : ctxBlock;
  const { titleExpand, titleCollapse, iconExpand, iconCollapse } = schema['x-component-props'] || {};
  // const [expandAll, setExpandAll] = useState((ctx?.expandFlag ? true : false) || expandFlag);
  const compile = useCompile();
  const { table, countTable,iconTable, iconCountTable} = useProps(props);
  const { viewType, setViewType, loading, setLoading } = useBomTreeFormBlockContext();
  const [count, setIsCount] = useState(viewType.type === 'countTable');
  const { token } = useToken();
  const handleChange = (value) => {
    setLoading(true);
    if(value == 'table'){
      setIsCount(false);
      setViewType({
        view: 'table',
        action: 'list',
      });
    }
    else{
      setIsCount(true);
      setViewType({
        view: 'countTable',
        action: 'list',
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  const iconStyle={
    fontSize: token.fontSize+'px'
  };
  return (
    <div className={actionDesignerCss}>
      {
        // <Button
        //   size={size}
        //   onClick={_handleActionClick}
        //   icon={<Icon type={expandAll ? iconCollapse : iconExpand} />}
        //   type={props.type}
        // >
        //   {props.children?.[1]}
        //   <span>{expandAll ? compile(titleCollapse) : compile(titleExpand)}</span>
        // </Button>
        <>
          <Radio.Group defaultValue={viewType.view} buttonStyle="solid" onChange={handleChange}>
            <Radio.Button value="table" >
              {/* <Icon type={iconTable} style={
              iconStyle
            }/> */}
            {table}
            </Radio.Button>
            <Radio.Button value="countTable">
              {/* <Icon type={iconCountTable} style={
             iconStyle
            }/> */}
              {countTable}
            </Radio.Button>
          </Radio.Group>
          {props.children?.[1]}
        </>
      }
    </div>
  );
};
