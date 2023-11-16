import { useField, useFieldSchema, useForm } from "@formily/react";
import { useRecord, useRecordIndex } from "../../../record-provider";
import { IField, useActionContext, useFilterByTk } from "@nocobase/client";
import { useEffect, useState } from "react";

export const useTreeFormBlockProps = ()=>{

}
export const useTreeFormAddChildActionProps = ()=>{
    const form = useForm();
    const record = useRecord();
    const fieldSchema = useFieldSchema();
    // const addFormFieldSchema = fieldSchema.parent.parent.parent.properties.form.properties.add.properties.form;
    const field = useField();
    
    return {
        onClick:()=>{
          
            field.query('form.add.form').take((addForm: any)=>{

            });

            // createFormFieldSchema['x-component-props']= createFormFieldSchema?.['x-component-props'] ||{};
            // createFormFieldSchema['x-component-props'].addChild = true;
            // createFormFieldSchema['x-component-props'].initialValues= {
            //     parent: record
            // };
            console.log('recordIndex', record);
            // form.query('form.create').take((create: any)=>{
            //     create.setVisible(true);
            // })

        }
    }
}
export const useTreeFormCreateActionProps = ()=>{
    return {}
}
export const useTreeFormShowForm = ()=>{
    const record = useRecord();
    console.log('record',record);
    return 'create';
}
