import { useField, useFieldSchema, useForm } from '@formily/react';
import { useRecord, useRecordIndex } from '../../../record-provider';
import {
  IField,
  mergeFilter,
  removeNullCondition,
  transformToFilter,
  useActionContext,
  useCollectionManager,
  useFilterBlock,
  useFilterByTk,
  useFormBlockContext,
  useFormBlockType,
} from '@nocobase/client';
import { useEffect, useMemo, useState } from 'react';
import { useTreeFormBlockContext } from './TreeFormMain';
import { uid } from '@formily/shared';
import { onFormValuesChange } from '@formily/core';
import { isEmpty } from 'lodash';
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
    setExpandFlag: setExpandAll,
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
  const { field, filterFormLoaded, userAction } = useTreeFormBlockContext();
  useEffect(() => {
    if (filterFormLoaded) {
      if(userAction == 'createAndAddChild'){
        ctx?.form.reset();
        ctx?.form.setInitialValues({
          ...field.data?.filterFormValues,
          parent: record,
        });
        console.log('useTreeFormCreateProps setInitialValues', 2);
      }else if(userAction == 'create'){
        ctx?.form.reset();
        ctx?.form.setInitialValues({
          ...field.data?.filterFormValues,
        });
        console.log('useTreeFormCreateProps setInitialValues', 2);
      }
    }    
  }, [filterFormLoaded, userAction]);

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx?.form.reset();
      ctx?.form.setInitialValues({
        ...field.data?.filterFormValues,
      });  
      console.log('useTreeFormCreateProps setInitialValues', 1);
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
export const useTreeFormFilterProps = () => {
  const form = useForm();
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema: actionFieldSchema } = useActionContext();
  const fieldSchema = actionFieldSchema ? actionFieldSchema : useFieldSchema();
  const addChild = fieldSchema?.['x-component-props']?.addChild;
  const inheritsKeys = fieldSchema?.['x-component-props']?.inheritsKeys || [];
  const { type } = useFormBlockType();
  const {
    blockCtx,
    setFilterFormValues,
    setFilterFormSchema,
    doFilterByBlock,
    treeBlock,
    treeSchema,
    field,
    setFilterFormLoaded,
  } = useTreeFormBlockContext();
  field.data = field.data || {};
  field.data.filterFormSchema = fieldSchema;
  useEffect(() => {
    if (!ctx?.service?.loading) {
      const initialValues = ctx.service?.data?.data;
      ctx.form?.setInitialValues(initialValues);
    }
  }, [ctx?.service?.loading]);

  useEffect(() => {
    if (ctx?.form) {
      const id = uid();
      ctx.form.addEffects(id, () => {
        onFormValuesChange((form) => {
          if (!isEmpty(form.values)) {
            field.data.filterFormValues = form.values;
            setFilterFormLoaded(true);
          }
          if (field.data?.blockCtx) {
            field.data.filterFormValues = form.values;
            doFilterByBlock(form.values, fieldSchema);
          }
        });
      });

      return () => {
        ctx.form.removeEffects(id);
      };
    }
  }, []);
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

export const useTreeFormSaveAsNewVersionProps = () => {
  // const { blockCtx } = useTreeFormBlockContext();
  // return {
  //   onClick: () => {
  //     blockCtx?.service?.saveAsNewVersion();
  //   },
  // };
};
export { useTreeFormBlockContext };
