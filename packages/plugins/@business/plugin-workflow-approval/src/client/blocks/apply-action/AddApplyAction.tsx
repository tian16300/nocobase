import React from 'react';
import { FormDialog, FormItem, FormLayout, Input } from '@formily/antd-v5';
import { createSchemaField } from '@formily/react';
import { Button } from 'antd';
import { dayjs, uid } from '@nocobase/utils';
import {
  CollectionField,
  CollectionProvider,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useApplyBlockContext,
  useBlockRequestContext,
  useCurrentUserContext,
  useRecord,
  useSchemaComponentContext,
  useTableBlockContext,
} from '@nocobase/client';
import {  message } from 'antd';

// const SchemaField = createSchemaField({
//   components: {
//     FormItem,
//     Input,
//   },
// });
const schema = {
  type: 'object',
  properties: {
    applyReason: {
      type: 'string',
      'x-designer': 'FormItem.Designer',
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-collection-field': 'approval_apply.applyReason',
      'x-component-props': {},
    },
    files: {
      type: 'string',
      name: 'files',
      'x-designer': 'FormItem.Designer',
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-collection-field': 'approval_apply.files',
      'x-component-props': {
        action: 'attachments:create?attachmentField=approval_apply.files',
      },
    },
  },
};
export const AddApplyAction = (props) => {
  const { workflow, collection, apply } = useApplyBlockContext();
  const { components, scope } = useSchemaComponentContext();
  // const ctx = useTableBlockContext();
  const data = useCurrentUserContext();
  const currentUser = data?.data?.data;
  const record = useRecord();
  const api = useAPIClient();
  const handleSubmit = (form, next) => {
    api
      .request({
        url: 'approval_apply:create',
        method: 'POST',
        data: {
          ...apply,
          ...form.values
        },
      })
      .then((res) => {
        if (res.status == 200) {
          // ctx?.service?.refresh();
          api.resource('approval_apply').update({
            filterByTk: res.data.data.id,
            values: {
              status: '0',
            },
          }).then((res) => {
            message.success('申请成功');
            next(form);
          });
        }
      });
  };
  
  return (
    <FormDialog.Portal>
      <Button
        onClick={() => {
          const dialog = FormDialog('提交申请', () => {
            return (
              <FormLayout labelCol={6} wrapperCol={10} layout={'vertical'}>
                <CollectionProvider name="approval_apply">
                  <SchemaComponent
                    schema={schema}
                    components={{ ...components, CollectionField }}
                    scope={scope}
                    onlyRenderProperties
                  ></SchemaComponent>
                </CollectionProvider>
                <FormDialog.Footer>
                  <span
                    onClick={() => {
                      dialog.close();
                    }}
                    style={{ marginLeft: 4 }}
                  ></span>
                </FormDialog.Footer>
              </FormLayout>
            );
          });
          dialog
            .forOpen((payload, next) => {
              setTimeout(() => {
              
                next({
                  initialValues: {
                    relatedCollection: collection.name,
                    related_data_id: record.id,
                    applyTitle:currentUser.nickname+'发起的'+workflow?.title+'申请',
                    applyUser_id:currentUser.id,
                    applyUser_deptId:currentUser.userId,
                    applyTime:dayjs().toISOString(),
                    status: null,
                    workflowKey: workflow?.key
                  },
                });
              }, 300);
            })
            .forConfirm((form, next) => {
              /*提交表单 */
              handleSubmit(form, next);
            })
            .forCancel((payload, next) => {
              setTimeout(() => {
                next(payload);
              }, 300);
            })
            .open()
            .then();
        }}
      >
        提交申请
      </Button>
    </FormDialog.Portal>
  );
};
