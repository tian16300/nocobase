import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';
import { useApplyActionContext } from '../blocks/apply-action/Apply.Action';
import { useActionContext, useAPIClient, useBlockRequestContext, useCurrentUserContext } from '@nocobase/client';
import { message } from 'antd';
import { dayjs } from '@nocobase/utils';
import { useMemo, useState } from 'react';
export const useApprovalAction = (props: any) => {
  const { workflow, collection, apply, setApply, formActionType, record } = useApplyActionContext();
  const api = useAPIClient();
  const data = useCurrentUserContext();
  const currentUser = data?.data?.data;
  const { service } = useBlockRequestContext();
 

  return {
    async run() {
      const applyValues = {
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
        /* 未审核 提交审核 */
        if (formActionType == 1) {
          new Promise((resolve, reject) => {
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
                        resolve(res);
                      });
                  }
                });
            } else {
              api
                .resource('approval_apply')
                .update({
                  filterByTk: apply.id,
                  values: {
                    status: '0',
                    jobIsEnd: false,
                    workflowKey: workflow?.key || apply?.workflowKey,
                  },
                })
                .then((res) => {
                  resolve(res);
                });
            }
          }).then((res: any) => {
            if (res.status == 200) {
              message.success('提交成功');
              setApply(res.data?.data?.[0] || {});
              service?.run();
            }
          });
        }else{
          message.error('其它操作目前还未支持');
        }
      }
    },
  };
};
