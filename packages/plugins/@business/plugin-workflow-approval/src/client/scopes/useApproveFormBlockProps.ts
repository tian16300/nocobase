import { useFormBlockContext } from "@nocobase/client";

export const useApproveFormBlockProps = () => {
    const ctx = useFormBlockContext();
    return {
        form: ctx.form,        
        layout: 'horizontal'
    };
}