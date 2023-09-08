import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AsyncDataProvider, IField, useAsyncData } from "@nocobase/client";
import { useField } from '@formily/react';
import { useDataSelectBlockContext } from "../data-select";


const PrjWorkProviderContext = createContext<any>({});


const PrjWorkProviderInner = (props) => {
    const { record } = useDataSelectBlockContext();
    const field: IField = useField();
    const ctx = useAsyncData();
    const [firstRun, setFirstRun] = useState(true);
    useEffect(() => {
        field.service = ctx;
        field.loading = ctx.loading;
        if (ctx.loading)
            return;
        setFirstRun(false);
        return () => {
            setFirstRun(true);
        }
    }, [ctx])

    useEffect(() => {
        if (!firstRun) {
            ctx.refresh();
        }
    }, [record]);
    return (<>{props.children}</>)
}


export const PrjWorkProvider = (props) => {
    const { record } = useDataSelectBlockContext();
    const request = useMemo(() => {
        return {
            url: 'reportDetail:list',
            method: 'GET',
            params: {
                // "collection": "reportDetail",
                // "measures": [
                //     {
                //         "field": [
                //             "hours"
                //         ]
                //     }
                // ],
                // "dimensions": [
                //     {
                //         "field": [
                //             "report",
                //             "userId"
                //         ],
                //         "alias": "成员"
                //     },
                //     {
                //         "field": [
                //             "report",
                //             "title"
                //         ],
                //         "alias": "周报"
                //     },
                //     {
                //         "field": [
                //             "isBusinessTrip"
                //         ],
                //         "alias": "是否出差"
                //     }
                // ],
                "filter": {
                    "$and": [
                        {
                            "prjId": {
                                "$eq": record.id
                            }
                        },
                        {
                            "report":{
                                "start": {
                                    "$dateNotAfter": '2023-08-21'
                                }
                            }
                        },
                        {
                            "report":{
                                "end": {
                                    "$dateNotBefore": '2023-08-27'
                                }
                            }
                        },
                        {
                            "report":{
                                "user": {
                                    "id": {
                                        "$in":[ 18 ]
                                    }
                                }
                            }
                        }
                    ]
                },
                "appends":[
                    "report",
                    "report.user"
                ]
                // ,
                // // "paging": false
            }
        };

    }, [record])
    return (
        <AsyncDataProvider request={request}>
            <PrjWorkProviderInner {...props} />
        </AsyncDataProvider>
       
    )
};

export const usePrjWorkProviderContext = () => {
    return useContext(PrjWorkProviderContext);
};