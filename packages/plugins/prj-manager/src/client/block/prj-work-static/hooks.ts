import { usePrjWorkProviderContext } from './PrjWorkProvider';
import { dayjs } from '@nocobase/utils';

export const usePrjWorkStaticFormDefValue = () => {
    return {
        start: dayjs().startOf('month').format('YYYY-MM-DD'),
        end:  dayjs().endOf('month').format('YYYY-MM-DD')
    }
}
export const usePrjWorkStaticForm = () => {
    const { form } = usePrjWorkProviderContext();
    return {
        layout: 'inline',
        form
    };
}


export const refreshPrjWorkService = async ()=>{
    const { service } = usePrjWorkProviderContext();
    await service.refresh();
}