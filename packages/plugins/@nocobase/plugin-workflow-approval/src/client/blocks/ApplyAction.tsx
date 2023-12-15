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
  useFormBlockProps,
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
  const ctx = useFormBlockProps();
  //  return 'xxx发起的工作流名称申请';
  const { apply, workflow, formActionType } = useApplyBlockContext();
  return {
    ...ctx,
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
export const ApplyAction: any =  observer(
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
);;

ApplyAction.Designer = Action.Designer;
