
import  { useEffect } from 'react';

import {
  IField,
  useFormBlockContext,
} from '@nocobase/client';
import { onFormValuesChange } from '@formily/core';
import { useForm, useField, Schema } from '@formily/react';
import { uid } from '@nocobase/utils';
import { useApprovalSettingContext } from '../page';

export const useApprovalFormBlockProps = () => {
    const field: IField = useField();
    const { form, workflow,collection, setCollection } = useApprovalSettingContext();
    const ctx = useFormBlockContext();
    useEffect(() => {
      if (workflow?.config && ctx?.form) {
        ctx.form.setInitialValues({
          collection
        });
      }
    }, [workflow?.config]);
    useEffect(() => {
      const id = uid();
      ctx.form.addEffects(id, () => {
        onFormValuesChange((form)=>{
          const values = form.values;
         const {collection} = values;
         setCollection(collection);
        })
      });
      return () => {
        ctx.form.removeEffects(id);
      };
    }, []);
    return {
      form: ctx.form
    };
  };