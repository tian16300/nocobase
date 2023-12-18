import React, { useEffect, useState } from 'react';
import { Form } from '@formily/antd-v5';
import {
  Action,
  ActionContextProvider,
  CollectionProvider,
  CreateAction,
  FormBlockProvider,
  GeneralSchemaDesigner,
  SchemaComponent,
  actionDesignerCss,
  linkageAction,
  useActionContext,
  useApplyBlockContext,
  useCollection,
  useFilterByTk,
  useFormBlockContext,
  useFormBlockProps,
  useFormBlockType,
  useLocalVariables,
  useRecord,
  useSchemaTemplate,
  useVariables,
} from '@nocobase/client';
import { createActionForm } from './schema/createActionForm';
import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';

/**
 * 申请按钮显示 提交申请  撤销  再次提交申请
 * 提交申请功能区域  用户点击提交申请 出现表单填写区域 申请标题  申请理由 附件 图片
 */
export const useApprovalApplyFormBlockProps = () => {
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema: actionFieldSchema } = useActionContext();
  const fieldSchema = actionFieldSchema ? actionFieldSchema : useFieldSchema();
  // const addChild = fieldSchema?.['x-component-props']?.addChild;
  // const inheritsKeys = fieldSchema?.['x-component-props']?.inheritsKeys || [];
  // const { type } = useFormBlockType();
  // const {name} = useCollection();

  // useEffect(() => {
  //   if (addChild) {
  //     ctx.form?.query('parent').take((field) => {
  //       field.disabled = true;
  //       field.value = new Proxy({ ...record?.__parent }, {});
  //     });
  //     if (inheritsKeys) {
  //       inheritsKeys.forEach((key) => {
  //         ctx.form?.query(key).take((field) => {
  //           const value = record[key];
  //           if (value && typeof value == 'object') {
  //             // field.readPretty = true;
  //             field.value = new Proxy({ ...value }, {});
  //           }
  //         });
  //       });
  //     }
  //   }
  // });
  useEffect(() => {
    ctx.form?.setInitialValues({
      relatedCollection: record.__collectionName,
      related_data_id: record.__parent.id
    });
  }, []);
  return {                                                                                                      
    form: ctx.form,
  };
};
export const useApplyFormActionProps = () => {
  return {
    openMode: 'modal',
    type: 'primary',
    component: 'CreateRecordAction',
    icon: 'PlusOutlined',
  };
};
export const ApplyAction: any = observer(
  (props: any) => {
    const [visible, setVisible] = useState(false);
    const collection = useCollection();
    const fieldSchema = useFieldSchema();
    const field: any = useField();
    const [currentCollection, setCurrentCollection] = useState('approval_apply');
    const linkageRules: any[] = fieldSchema?.['x-linkage-rules'] || [];
    const values = useRecord();
    const ctx = useActionContext();
    const variables = useVariables();
    const localVariables = useLocalVariables({ currentForm: { values } as any });

    useEffect(() => {
      field.stateOfLinkageRules = {};
      linkageRules
        .filter((k) => !k.disabled)
        .forEach((v) => {
          v.actions?.forEach((h) => {
            linkageAction({
              operator: h.operator,
              field,
              condition: v.condition,
              variables,
              localVariables,
            });
          });
        });
    }, [field, linkageRules, localVariables, variables]);
    return (
      <div className={actionDesignerCss}>
        <ActionContextProvider value={{ ...ctx, visible, setVisible }}>
          <CollectionProvider name={currentCollection}>
            <CreateAction
              {...props}
              onClick={(name) => {
                setVisible(true);
                setCurrentCollection(currentCollection);
              }}
            />
            <RecursionField schema={fieldSchema} basePath={field.address} onlyRenderProperties />
          </CollectionProvider>
        </ActionContextProvider>
      </div>
    );
  },
  { displayName: 'ApplyAction' },
);

export  const useCreateActionProps = () => {
  // const { onClick } = useCAP();
  const actionField: any = useField();
  const { getPrimaryKey } = useCollection();
  const primaryKey = getPrimaryKey();
  return {
    async onClick() {
      
    
    },
  };
};

ApplyAction.Designer = Action.Designer;
