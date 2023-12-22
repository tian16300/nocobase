import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import {
  Action,
  Icon,
  useAPIClient,
  useApplyBlockContext,
  useCompile,
  useTableBlockContext,
  useTableSelectorContext,
} from '@nocobase/client';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { AddApplyAction } from './AddApplyAction';
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

/**
 * 未提交申请 撤销  隐藏
 * @param props 将 status 修改 5
 * @returns
 */
/**
 * 修改申请 撤销  再次申请
 * @param props 
 * @returns 
 */
const CancelApplyAction = (props) => {
  const { apply } = useApplyBlockContext();
  const api = useAPIClient();
  const handleCancleApply = async () => {
    const res =  await api.resource('approval_apply').update({
      filterByTk: apply.id,
      values:{ status: '5' }
    });
    if(res.status == 200){
      message.success('撤销成功');
    }
  };
  const  confirm: any = {
    title: '撤销审批',
    content: '确认撤销该申请？'
};
  return <Action title='撤销' confirm={confirm} onClick={handleCancleApply}></Action>
};
const ReAddApplyAction = (props) => {
  return <Button>再次申请</Button>;
};
export const ApplyAction = (props) => {
  const { formActionType } = useApplyBlockContext();
  return (
    <div className={actionDesignerCss}>
      {formActionType == 1 && <AddApplyAction />}
      {formActionType == 2 && <CancelApplyAction />}
      {formActionType == 3 && <ReAddApplyAction />}
    </div>
  );
};
