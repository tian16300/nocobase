import { useField, useFieldSchema, useForm } from "@formily/react";
import { useRecord, useRecordIndex } from "../../../record-provider";
import { IField, useActionContext, useFilterByTk } from "@nocobase/client";
import { useEffect, useState } from "react";
import { useTreeFormBlockContext } from "./TreeFormMain";

export const useTreeFormBlockProps = ()=>{
    const schema:any = useFieldSchema();
    const collection = schema.properties?.tree?.['x-decorator-props']?.collection;
    const [selectedRowKeys, setSelectedRowkeys] = useState(null);
    return {
        collection,
        selectedRowKeys,
        setSelectedRowkeys

    };

}
export const useTreeFormAddChildActionProps = ()=>{
    const form = useForm();
    const recordValue = useRecord();
    // const fieldSchema = useFieldSchema();
    // const addFormFieldSchema = fieldSchema.parent.parent.parent.properties.form.properties.add.properties.form;
    // const field = useField();
    const {collection, record, setRecord, setUserAction} = useTreeFormBlockContext();
    
    return {
        onClick:(value)=>{
            setRecord(recordValue);
            setUserAction('create');
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
export const useTreeFormExpandActionProps = ()=>{
    
    return {};
}

export const useTreeFormBlockTreeItemProps = ()=>{
    const {collection, record, setRecord} = useTreeFormBlockContext();
    return {
        onSelect:(key, row)=>{
            // const [key] = rowKeys;
            setRecord(row);

        }
    };
};

export {useTreeFormBlockContext}