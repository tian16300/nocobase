import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import {
  Action,
  Icon,
  actionDesignerCss,
  useAPIClient,
  useApplyBlockContext,
  useCompile,
  useTableBlockContext,
  useTableSelectorContext,
} from '@nocobase/client';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { AddApplyAction } from './AddApplyAction';
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
      {/* 创新新申请 */}
      {formActionType == 1 && <AddApplyAction />}
      {/* 未审批完成 */}
      {formActionType == 2 && <CancelApplyAction />}
      {/* 审批完成  */}
      {formActionType == 3 && <ReAddApplyAction />}
      {props.children?.[1]}
    </div>
  );
};
