import { createFormBlockSchema, css, gridRowColWrap } from '@nocobase/client';
import { uid } from '@nocobase/utils';

export const createActionForm = ({ title }) => {
  const fields = [
    {
      name: 'applyReason',
    },
    {
      name: 'files',
      'x-component-props': {
        action: 'attachments:create?attachmentField=approval_apply.files',
      },
    },
  ];
  let fieldProps = {};

  fields.forEach((field) => {
    const name = `row_${uid()}`;
    fieldProps[name] = gridRowColWrap({
      type: 'string',
      'x-designer': 'FormItem.Designer',
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-collection-field': `approval_apply.${field.name}`,
      ...field,
    });
  });
  const template = {
    type: 'void',
    'x-component': 'Grid',
    'x-initializer': 'CreateFormBlockInitializers',
    'x-uid': uid(),
    properties: fieldProps,
  };
  const schema = {
    type: 'void',
    'x-action': 'create',
    'x-acl-action': 'create',
    title,
    'x-designer': 'Action.Designer',
    'x-component': 'Action',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      openMode: 'modal',
      openSize: 'small',
    },
    'x-uid': uid(),
    properties: {
      drawer: {
        type: 'void',
        title: '提交审核',
        'x-component': 'Action.Container',
        'x-component-props': {},
        'x-uid': uid(),
        properties: {
          [uid()]: {
            ...createFormBlockSchema({
              collection: 'approval_apply',
              template,
              actions: {
                submit: {
                  title: '提交',
                  'x-component': 'Action',
                  'x-component-props': {
                    type: 'primary',
                    useAction: '{{ useSubmitAction }}',
                  },
                },
                cancel: {
                  title: '取消',
                  'x-component': 'Action',
                  'x-component-props': {
                    useAction: '{{ useCloseAction }}',
                  },
                },
              },
              cardStyle: {
                className: css`
                  &.ant-card:not(.ant-card-bordered) {
                    box-shadow: none;
                  }
                  .ant-card-body {
                    padding-bottom: 0;
                  }
                `,
              },
            }),
            'x-uid': uid(),
          },
        },
      },
    },
  };
  return schema;
};
