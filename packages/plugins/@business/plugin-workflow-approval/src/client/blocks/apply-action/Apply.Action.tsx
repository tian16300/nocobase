import {
  Action,
  CollectionProvider,
  useApplyBlockContext,
  useRecord
} from '@nocobase/client';
import React, { createContext, useContext, useMemo } from 'react';
const ApplyActionContext = createContext<any>({});
/**
 * 未提交申请 撤销  隐藏
 * @param props 将 status 修改 5
 * @returns
 */


export const ApplyAction = (props: any) => {
  const { formActionType, apply, setApply, ...others } = useApplyBlockContext();
  const record = useRecord();
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
  }, [apply?.id, apply?.jobIsEnd]);
  const { children, title, ...btnProps } = props;
  return (
    <ApplyActionContext.Provider value={{ formActionType, record, setApply, ...others }}>
      <CollectionProvider name="approval_apply">
        <Action {...btnProps} title={btnTitle}></Action>
      </CollectionProvider>
    </ApplyActionContext.Provider>
  );
};
export const useApplyActionContext = () => {
  return useContext(ApplyActionContext);
};
