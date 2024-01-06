import {
  IField,
  useAPIClient,
  useApplyBlockContext,
  useBlockRequestContext,
  useCreateActionProps,
  useCurrentUserContext,
  useFilterByTk,
  useFormBlockContext,
  useUpdateActionProps,
} from '@nocobase/client';
import { useBomTreeFormBlockContext } from '../components/bom-tree-form/Provider';
import { useFieldSchema, useField } from '@formily/react';
import { dayjs } from '@nocobase/utils';
export const useSaveBomActionProps = (props: any) => {
  const { viewType } = useBomTreeFormBlockContext();

  if (viewType.action == 'create') {
    const _props = useCreateActionProps();
    return {
      ..._props,
    };
  } else if (viewType.action == 'get') {
    const _props = useUpdateActionProps();
    return {
      ..._props,
    };
  }
};

export const useSaveBomApplyActionProps = (props: any) => {
  const fieldSchema = useFieldSchema();
  const { viewType, onSelect } = useBomTreeFormBlockContext();
  const { workflow, collection, apply } = useApplyBlockContext();
  const { form, service } = useFormBlockContext();
  const userService = useCurrentUserContext();
  const currentUser = userService?.data?.data;
  const api = useAPIClient();
  const filterByTk = useFilterByTk();
  /**
   * 1. 如果是创建，先提交数据后 创建提交申请
   * 2· 如果是更新，查看是否有提交申请, 如果有提交申请 则隐藏提交申请按钮，如果没有提交申请，则显示提交申请按钮
   */
  const actionField = useField();

  const addApply = async (record) => {
    if (record?.id) {
      api
        .request({
          url: 'approval_apply:create',
          method: 'POST',
          data: {
            relatedCollection: collection.name,
            related_data_id: record?.id || filterByTk,
            applyTitle: currentUser.nickname + '发起的' + workflow?.title + '申请',
            applyReason: record?.remark,
            applyUser_id: currentUser.id,
            applyUser_deptId: currentUser.userId,
            applyTime: dayjs().toISOString(),
            status: null,
            workflowKey: workflow?.key,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            //   message.success('申请成功');
            // ctx?.service?.refresh();
            //   next(form);
            // console.log('BOM 审核申请成功');
            api.resource('approval_apply').update({
              filterByTk: res.data.data.id,
              values: {
                status: '0',
              },
            });
          }
        });
    }
  };

  if (viewType.action == 'create') {
    const { onClick: onCreateClick, ...others } = useCreateActionProps();

    return {
      ...others,
      async onClick() {
        await onCreateClick();
        // actionField.setValue('create');
        // fieldSchema.query('submit').visible(false);
        const record = actionField.data.data?.data?.data;
        await addApply(record);
      },
    };
  } else if (viewType.action == 'get') {
    const { onClick: onUpdateClick, ...others } = useUpdateActionProps();
    return {
      ...others,
      hidden: apply?.id && apply?.status != '0',
      async onClick() {
        await onUpdateClick();
        const record = form.values;
        await addApply(record);
        const service = actionField.data.pService;
        service?.refresh?.();
        // actionField.setValue('update');
        // fieldSchema.query('submit').visible(true);
      },
    };
  }
};
