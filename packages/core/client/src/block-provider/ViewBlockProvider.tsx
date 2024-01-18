import { createContext, useContext } from "react";

export const ViewBlockContext = createContext<any>({});


export const  useViewBlockContext = () => {
    return useContext(ViewBlockContext);
}