import { css } from '@emotion/css';
import { useFieldSchema } from '@formily/react';
import {
  Action,
  CollectionProvider,
  Icon,
  SchemaComponent,
  actionDesignerCss,
  useAPIClient,
  useActionContext,
  useApplyBlockContext,
  useCompile,
  useCurrentUserContext,
  useFormBlockContext,
  useRecord,
  useSchemaComponentContext,
  useTableBlockContext,
  useTableSelectorContext,
} from '@nocobase/client';
import { Button, message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { AddApplyAction } from './AddApplyAction';
import { createActionForm } from '../schema/utils';
const ApplyActionContext = createContext<any>({});
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
    const res = await api.resource('approval_apply').update({
      filterByTk: apply.id,
      values: {
        status: '3',
        // result: {
        //   _: apply,
        //   form: {
        //     userAction: '-4'
        //   }
        // }
      },
    });
    if (res.status == 200) {
      message.success('撤销成功');
    }
  };
  const confirm: any = {
    title: '撤销审批',
    content: '确认撤销该申请？',
  };
  return <Action title="撤销" confirm={confirm} onClick={handleCancleApply}></Action>;
};
const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const useSubmitAction = () => {
  const { workflow, collection, apply, record } = useApplyActionContext();
  const { setVisible } = useActionContext();
  const data = useCurrentUserContext();
  const currentUser = data?.data?.data;
  const { form, service } = useFormBlockContext();
  const api = useAPIClient();
  const serviceUid = [collection.name, 'apply'].join('_');
  return {
    async run() {
      const applyValues = {
        ...form.values,
        applyTitle: currentUser.nickname + '发起的' + workflow?.title + '申请',
        applyUser_id: currentUser.id,
        applyUser_deptId: currentUser.userId,
        applyTime: dayjs().toISOString(),
      };
      const params = {
        ...applyValues,
        relatedCollection: collection.name,
        related_data_id: record.id,
        workflowKey: workflow?.key,
      };
      if (!workflow) {
        message.error('未找到审批流程,请联系管理员');
        return;
      } else {
        if (!apply?.id) {
          api
            .resource('approval_apply')
            .create({
              values: params,
            })
            .then((res) => {
              if (res.status == 200) {
                const filterByTk = res.data.data.id;
                api
                  .resource('approval_apply')
                  .update({
                    filterByTk,
                    values: {
                      status: '0',
                      jobIsEnd: false,
                      workflowKey: workflow?.key || apply?.workflowKey,
                    },
                  })
                  .then((res) => {
                    message.success('提交申请成功');
                    setVisible(false);
                    api.service(serviceUid)?.refresh();
                    service?.refresh();
                  });
              }
            });
        } else {
          api
            .resource('approval_apply')
            .update({
              filterByTk: apply.id,
              values: {
                ...form.values,
                status: '0',
                jobIsEnd: false,
                workflowKey: workflow?.key || apply?.workflowKey,
              },
            })
            .then((res) => {
              message.success('提交申请成功');
              setVisible(false);
              api.service(serviceUid)?.refresh();
              service?.refresh();
            });
        }
      }
    },
  };
};
/**
 * 审批完成
 * @param props
 * @returns
 */
const AddApplyAction = ({ title, name }) => {
  const ctx = useSchemaComponentContext();
  const schema = {
    name,
    ...createActionForm({
      title,
    }),
  };
  return (
    <>
      <SchemaComponent
        schema={schema}
        components={{ ...ctx.components }}
        scope={{ useCloseAction, useSubmitAction, ...ctx.scope }}
      ></SchemaComponent>
    </>
  );
};
import { observer } from '@formily/react';
import { dayjs } from '@nocobase/utils';
import { JOB_STATUS } from '@nocobase/plugin-workflow/client';
export const ApplyAction = observer((props) => {
  const { formActionType, ...others } = useApplyBlockContext();
  const record = useRecord();

  return (
    <ApplyActionContext.Provider value={{ formActionType, record, ...others }}>
      <CollectionProvider name="approval_apply">
        <div className={actionDesignerCss}>
          {/* 创新新申请 */}
          {formActionType == 1 && <AddApplyAction title="提交申请" name="addApply" {...others} />}
          {/* 未审批完成 */}
          {/* {formActionType == 2 && <CancelApplyAction />} */}
          {/* 审批完成  */}
          {formActionType == 3 && <AddApplyAction title="再次申请" name="reAddApply" {...others} />}
          {props.children?.[1]}
        </div>
      </CollectionProvider>
    </ApplyActionContext.Provider>
  );
});
const useApplyActionContext = () => {
  return useContext(ApplyActionContext);
};
