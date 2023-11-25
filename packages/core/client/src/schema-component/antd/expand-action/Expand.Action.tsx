import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useCompile } from '../../hooks';
import { useTableBlockContext, useTableSelectorContext } from '../../../block-provider';
import { Icon } from '../../../icon';
const actionDesignerCss = css`
  position: relative;
  &:hover {
    .general-schema-designer {
      display: block;
    }
  }
  .general-schema-designer {
    position: absolute;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    background: var(--colorBgSettingsHover);
    border: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    > .general-schema-designer-icons {
      position: absolute;
      right: 2px;
      top: 2px;
      line-height: 16px;
      pointer-events: all;
      .ant-space-item {
        background-color: var(--colorSettings);
        color: #fff;
        line-height: 16px;
        width: 16px;
        padding-left: 1px;
        align-self: stretch;
      }
    }
  }
`;

export const ExpandAction = (props) => {
  const { expandFlag, size } = props;
  const schema = useFieldSchema();
  const ctxSelector = useTableSelectorContext();
  const ctxBlock = useTableBlockContext();
  const isTableSelector = schema.parent?.parent?.['x-decorator'] === 'TableSelectorProvider';
  const ctx = isTableSelector ? ctxSelector : ctxBlock;
  const { titleExpand, titleCollapse, iconExpand, iconCollapse } = schema['x-component-props'] || {};
  const [expandAll, setExpandAll] = useState((ctx?.expandFlag? true : false)|| expandFlag)
  const compile = useCompile();
  return (
    <div className={actionDesignerCss}>
      {(
        <Button 
        size={size}
          onClick={() => {
            setExpandAll(!expandAll);
            if(ctx && typeof ctx?.setExpandFlag === 'function'){
              ctx?.setExpandFlag(!expandAll);
            }
            if(typeof props?.setExpandFlag === 'function'){
              props?.setExpandFlag(!expandAll);
            }
          }}
          icon={<Icon type={expandAll ? iconCollapse : iconExpand} />}
          type={props.type}
        >
          {props.children?.[1]}
          <span>{expandAll ? compile(titleCollapse) : compile(titleExpand)}</span>
        </Button>
      )}
    </div>
  );
};
