import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';
import { useApplyActionContext } from '../blocks/apply-action/Apply.Action';
import {
  getFormValues,
  isVariable,
  TableFieldResource,
  transformVariableValue,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollection,
  useCompile,
  useCurrentUserContext,
  useFilterByTk,
  useFormActiveFields,
  useFormBlockContext,
  useLocalVariables,
  useParamsFromRecord,
  useVariables,
} from '@nocobase/client';
import { message } from 'antd';
import { dayjs } from '@nocobase/utils';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const useApprovalAction = (props: any) => {
  const { workflow, collection, apply, setApply, formActionType, record } = useApplyActionContext();
  const api = useAPIClient();
  const userContext = useCurrentUserContext();
  const currentUser = userContext?.data?.data;
  const form = useForm();
  const filterByTk = useFilterByTk();
  const { field, resource, __parent } = useBlockRequestContext();
  const actionSchema = useFieldSchema();
  const { fields, getField, name } = useCollection();
  const actionField = useField();
  const { updateAssociationValues, service } = useFormBlockContext();
  const data = useParamsFromRecord();
  const variables = useVariables();
  const localVariables = useLocalVariables({ currentForm: form });
  const { getActiveFieldsName } = useFormActiveFields() || {};

  return {
    async run() {
      const {
        assignedValues: originalAssignedValues = {},
        overwriteValues,
        skipValidator,
        triggerWorkflows,
      } = actionSchema?.['x-action-settings'] ?? {};

      const assignedValues = {};
      const waitList = Object.keys(originalAssignedValues).map(async (key) => {
        const value = originalAssignedValues[key];
        const collectionField = getField(key);

        if (process.env.NODE_ENV !== 'production') {
          if (!collectionField) {
            throw new Error(`useUpdateActionProps: field "${key}" not found in collection "${name}"`);
          }
        }

        if (isVariable(value)) {
          const result = await variables?.parseVariable(value, localVariables);
          if (result) {
            assignedValues[key] = transformVariableValue(result, { targetCollectionField: collectionField });
          }
        } else if (value != null && value !== '') {
          assignedValues[key] = value;
        }
      });
      await Promise.all(waitList);

      if (!skipValidator) {
        await form.submit();
      }
      const fieldNames = fields.map((field) => field.name);
      const values = getFormValues({
        filterByTk,
        field,
        form,
        fieldNames,
        getField,
        resource,
        actionFields: getActiveFieldsName?.('form') || [],
      });
      actionField.data = field.data || {};
      actionField.data.loading = true;
      const getFormBlockService = (__parent, collectionName) => {
        const pColName = __parent?.props?.collection || __parent?.props?.resource;
        if (collectionName == pColName) {
          return __parent.service;
        } else if (__parent.__parent) {
          return getFormBlockService(__parent.__parent, collectionName);
        }
        return null;
      };

      new Promise((resolve, reject) => {
        resource
          .update({
            filterByTk,
            values: {
              ...values,
              ...overwriteValues,
              ...assignedValues,
            },
            ...data,
            updateAssociationValues,
            // TODO(refactor): should change to inject by plugin
            triggerWorkflows: triggerWorkflows?.length
              ? triggerWorkflows.map((row) => [row.workflowKey, row.context].filter(Boolean).join('!')).join(',')
              : undefined,
          })
          .then((res) => {
            if (res.status == 200) {
              /* 保存当前表单 */
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
                                status: '-1',
                                jobIsEnd: false,
                                workflowKey: workflow?.key || apply?.workflowKey,
                                updatedBy: currentUser.id,
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
                          status: '-1',
                          jobIsEnd: false,
                          workflowKey: workflow?.key || apply?.workflowKey,
                        },
                      })
                      .then((res) => {
                        resolve(res);
                      });
                  }
                } else if (formActionType == 2 && apply?.id) {
                  /* 撤销申请 */
                  api
                    .resource('approval_apply')
                    .update({
                      filterByTk: apply.id,
                      values: {
                        status: '3',
                        jobIsEnd: false,
                        workflowKey: workflow?.key || apply?.workflowKey,                        
                        updatedBy: currentUser.id
                      },
                    })
                    .then((res) => {
                      resolve(res);
                    });
                }
              }
            }
          });
      })
        .then((res: any) => {
          if (res.status == 200) {
            message.success('提交成功');          
            service?.run?.();
            __parent?.service?.refresh?.();
            setApply(res.data?.data?.[0] || {}); 
          }
        })
        .finally(() => {
          actionField.data.loading = false;
        });
    },
  };
};
