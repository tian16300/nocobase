
import { useEffect } from 'react';
import { usePrjWorkProviderContext } from './PrjWorkProvider';
import { uid } from '@nocobase/utils';

export const usePrjWorkStaticFormDefValue = () => {
    return {
        start: '2023-08-21',
        end: '2023-08-27'
    }
}

export const usePrjWorkStaticForm = () => {
    const { form } = usePrjWorkProviderContext();
    useEffect(() => {
        // const defVal = usePrjWorkStaticFormDefValue();
        // form.setInitialValues(defVal);
    }, []);

    useEffect(() => {
        // const id = uid();
        // form.addEffect(id, ()=>{

        // })
        // return ()=>{
        //     form.removeEffect(id)
        // }
    }, []);

    return {
        layout: 'inline',
        form
    };
}


export const refreshPrjWorkService = async ()=>{
    debugger;
    const { service } = usePrjWorkProviderContext();

    await service.refresh();
}