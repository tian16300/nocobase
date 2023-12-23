import { uid } from '@nocobase/utils';

/* 提交申请的操作 schema */
export const createActionForm = () => {
  return {
    type: 'void',
    'x-action': 'create',
    'x-acl-action': 'create',
    title: '提交申请',
    'x-designer': 'Action.Designer',
    'x-component': 'Action',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      openMode: 'modal',
      type: 'primary',
      component: 'ApplyAction',
      openSize: 'small',
    },
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    properties: {
      drawer1: {
        type: 'void',
        title: '{{ t("提交申请") }}',
        'x-component': 'Action.Container',
        'x-component-props': {
          // className: 'nb-action-popup',
        },
        properties: {
          form1: {
            type: 'void',
            'x-decorator': 'BlockItem',
            'x-decorator-props': {},
            'x-component': 'FormV2',
            'x-component-props': {
              useProps: '{{ useApprovalApplyFormBlockProps }}',
            },
            properties: {
              applyReason: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.applyReason',
                'x-component-props': {
                  rows: 12
                },
              },
              files: {
                type: 'string',
                'x-designer': 'FormItem.Designer',
                'x-component': 'CollectionField',
                'x-decorator': 'FormItem',
                'x-collection-field': 'approval_apply.files',
                'x-component-props': {
                  action: 'attachments:create?attachmentField=approval_apply.files',
                },
              },
             
            },
          },
          footer1: {
            type: 'void',
            'x-component': 'Action.Modal.Footer',
            properties: {
              actions: {
                type: 'void',
                'x-initializer': 'CreateFormActionInitializers',
                'x-component': 'ActionBar',
                'x-component-props': {
                  layout: 'one-column',
                  style: {
                    marginTop: 24,
                  },
                },
                properties: {
                  [uid()]: {
                    title: '{{ t("Submit") }}',
                    'x-action': 'submit',
                    'x-component': 'Action',
                    'x-designer': 'Action.Designer',
                    'x-component-props': {
                      type: 'primary',
                      htmlType: 'submit',
                      useProps: '{{ useCreateApplyActionProps }}',
                    },
                  },
                },
                'x-align':'right'
              },
            },
          },
        },
      },
    },
  };
};
