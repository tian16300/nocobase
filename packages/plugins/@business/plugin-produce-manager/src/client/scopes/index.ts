import { useCreateActionProps, useUpdateActionProps } from "@nocobase/client";
import { useBomTreeFormBlockContext } from "../components/bom-tree-form/Provider"

export const useSaveBomActionProps = (props: any) => {
    const {viewType} = useBomTreeFormBlockContext();
    if(viewType.action == 'create'){
        const _props = useCreateActionProps();
        return {
            ..._props
        };
    }else if(viewType.action == 'get'){
        const _props =  useUpdateActionProps();
        return {
            ..._props
        };
    }
}