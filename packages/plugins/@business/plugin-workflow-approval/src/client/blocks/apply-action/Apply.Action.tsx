import { Action, CollectionProvider, useApplyBlockContext, useRecord } from '@nocobase/client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const ApplyActionContext = createContext<any>({});
/**
 * 未提交申请 撤销  隐藏
 * @param props 将 status 修改 5
 * @returns
 */

export const ApplyAction = (props: any) => {
  const { apply: applyRecord, ...others } = useApplyBlockContext();
  const record = useRecord();
  let [apply, setApply] = useState<any>(applyRecord);
  useEffect(() => {
    if (applyRecord?.id) {
      setApply(applyRecord);
    }
  }, [applyRecord?.id, applyRecord?.jobIsEnd]);
  const btnTitle = useMemo(() => {
    if (!apply?.id) {
      /* 用户可操作提交申请  */
      return '提交审核';
    } else if (apply && apply.jobIsEnd) {
      /* 审批结束 */
      return '再次申请';
    } else if (apply && !apply.jobIsEnd) {
      /* 审批结束 */
      return '撤销申请';
    }
  }, [JSON.stringify(apply)]);
  const formActionType = useMemo(() => {
    if (!apply?.id) {
      /* 用户可操作提交申请  */
      return 1;
    } else if (apply && apply.jobIsEnd) {
      /* 审批结束 */
      return 3;
    } else if (apply && !apply.jobIsEnd) {
      /* 审批结束 */
      return 2;
    }
  }, [JSON.stringify(apply)]);
  const { children, title, ...btnProps } = props;
  return (
    <ApplyActionContext.Provider value={{ formActionType, record, apply, setApply, ...others }}>
      <CollectionProvider name="approval_apply">
        <Action {...btnProps} title={btnTitle}></Action>
      </CollectionProvider>
    </ApplyActionContext.Provider>
  );
};
export const useApplyActionContext = () => {
  return useContext(ApplyActionContext);
};
