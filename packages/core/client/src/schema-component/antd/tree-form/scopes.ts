import { useField, useFieldSchema, useForm } from '@formily/react';
import { useRecord, useRecordIndex } from '../../../record-provider';
import { IField, useActionContext, useFilterByTk, useFormBlockContext, useFormBlockType } from '@nocobase/client';
import { useEffect, useState } from 'react';
import { useTreeFormBlockContext } from './TreeFormMain';

export const useTreeFormBlockProps = () => {
  const schema: any = useFieldSchema();
  const collection = schema.properties?.tree?.['x-decorator-props']?.collection;
  const [selectedRowKeys, setSelectedRowkeys] = useState(null);
  return {
    collection,
    selectedRowKeys,
    setSelectedRowkeys,
  };
};
export const useTreeFormAddChildActionProps = () => {
  const form = useForm();
  const recordValue = useRecord();
  // const fieldSchema = useFieldSchema();
  // const addFormFieldSchema = fieldSchema.parent.parent.parent.properties.form.properties.add.properties.form;
  // const field = useField();
  const { collection, record, setRecord, setUserAction } = useTreeFormBlockContext();

  return {
    onClick: (value) => {
      setUserAction('createAndAddChild');
      // field.query('form.add.form').take((addForm: any)=>{

      // });

      // createFormFieldSchema['x-component-props']= createFormFieldSchema?.['x-component-props'] ||{};
      // createFormFieldSchema['x-component-props'].addChild = true;
      // createFormFieldSchema['x-component-props'].initialValues= {
      //     parent: record
      // };
      // console.log('recordIndex', record);
      // form.query('form.create').take((create: any)=>{
      //     create.setVisible(true);
      // })
    },
  };
};
export const useTreeFormCreateActionProps = () => {
  const { collection, record, setRecord, setUserAction } = useTreeFormBlockContext();
  return {
    onClick: (value) => {
      setUserAction('create');
    },
  };
};
export const useTreeFormShowForm = () => {
  const record = useRecord();
  console.log('record', record);
  return 'create';
};
export const useTreeFormExpandActionProps = () => {
  const { expandAll, setExpandAll } = useTreeFormBlockContext();
  return {
    expandFlag: expandAll,
    setExpandFlag: setExpandAll
  };
};

export const useTreeFormBlockTreeItemProps = () => {
  const { collection, record, setRecord } = useTreeFormBlockContext();
  return {
    onSelect: (key, row) => {
      // const [key] = rowKeys;
      setRecord(row);
    },
  };
};
export const useTreeFormCreateProps = () => {
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema: actionFieldSchema } = useActionContext();
  const fieldSchema = actionFieldSchema ? actionFieldSchema : useFieldSchema();
  const addChild = fieldSchema?.['x-component-props']?.addChild;
  const inheritsKeys = fieldSchema?.['x-component-props']?.inheritsKeys || [];
  const { type } = useFormBlockType();

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(ctx.service?.data?.data);
    }
  }, [ctx?.service?.loading]);
  useEffect(() => {
    if (type == 'update') {
      ctx?.service?.run();
      // if (setRefreshAction) {
      //   setRefreshAction(!refreshAction);
      // }
    }
  }, [JSON.stringify(record), type]);
  useEffect(() => {
    if (type == 'create') {
      if (addChild) {
        ctx.form?.query('parent').take((field) => {
          // field.readPretty = true;
          field.value = new Proxy({ ...record }, {});
        });
      }
      if (inheritsKeys) {
        inheritsKeys.forEach((key) => {
          ctx.form?.query(key).take((field) => {
            const value = record[key];
            if (value && typeof value == 'object') {
              // field.readPretty = true;
              field.value = new Proxy({ ...value }, {});
            }
          });
        });
      }
      // if (setRefreshAction) {
      //   setRefreshAction(!refreshAction);
      // }
    }
  }, [JSON.stringify(record), type, addChild, inheritsKeys]);
  return {
    form: ctx.form,
  };
};

export const useTreeFormRefreshActionProps = () => {
  const { blockCtx } = useTreeFormBlockContext();
  return {
    onClick: () => {
      if (blockCtx.service) {
        blockCtx.service.loading = true;
      }
      blockCtx?.service?.refresh();
    },
  };
};
export { useTreeFormBlockContext };
