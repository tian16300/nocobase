import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AsyncDataProvider, GanttBlockProvider, IField, useAsyncData } from '@nocobase/client';
import { connect, observer, useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { createForm, onFormReact } from '@formily/core';
import { usePrjWorkPlanFormDefValue } from './hooks';
import { dayjs } from '@nocobase/utils';
// import Card from 'packages/core/client/src/board/Card';
import { Card } from 'antd';

const PrjWorkProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});

const PrjWorkPlanProviderInner = (props) => {
  const { request } = props;
  const formCtx = usePrjWorkFormProviderContext();
  const field: IField = useField();
  const ctx = useAsyncData();
  const [firstRun, setFirstRun] = useState(true);
  const form = formCtx.form;
  useEffect(() => {
    field.service = ctx;
    field.loading = ctx.loading;
    if (ctx.loading) return;
    setFirstRun(false);
    return () => {
      setFirstRun(true);
    };
  }, [ctx]);
  useEffect(() => {
    if (!firstRun && !ctx.loading) {
      ctx.refresh();
    }
  }, [request]);
  return (
    <PrjWorkProviderContext.Provider
      value={{
        service: ctx,
        form: form,
      }}
    >
      {props.children}
    </PrjWorkProviderContext.Provider>
  );
};

// export const PrjWorkPlanProvider = observer((props) => {
//   const options = {
//     collection: 'prj_plan',
//     resource: 'prj_plan',
//     action: 'list',
//     fieldNames: {
//       id: 'id',
//       title: 'stage',
//       start: 'start',
//       end: 'end',
//       range: 'day',
//     },
//     params: {
//       appends: [],
//       paginate: false,
//       filters: {
//         // $and: [
//         //   {
//         //     prj: {
//         //       id: {
//         //         $eq: record?.id,
//         //       },
//         //     },
//         //   },
//         // ],
//       },
//     },
//   };
//   return (
//     // <PrjWorkFormProvider {...props}>

//     // </PrjWorkFormProvider>
//     //    <PrjWorkPlanAsynDataProvider  {...props}>
//     //    {props.children}
//     //  </PrjWorkPlanAsynDataProvider>
//     <GanttBlockProvider {...options}>{props.children}</GanttBlockProvider>
//   );
// });

export const PrjWorkPlanProvider = (props) => {
  const { record, service } = useDataSelectBlockContext();
  if (!service || service.loading || !record || !record.id) {
    return null;
  }
  const [recordId,  setRecordId] = useState(record.id);
  const options: any = {
    collection: 'prj_plan',
    resource: 'prj_plan',
    action: 'list',
    fieldNames: {
      id: 'id',
      title: 'stage',
      start: 'start',
      end: 'end',
      range: 'day',
    },
    params: {
      paginate: false,
      filter: {
        $and: [
          {
            prj: {
              id: {
                $eq: record.id,
              },
            },
          },
        ],
      },
    },
  };
  useEffect(() => {
    options.params = {
      filter: {
        $and: [
          {
            prj: {
              id: {
                $eq: record.id,
              },
            },
          },
        ]
      }
    };
  }, [record.id]);

  // Object.assign(props, ...options);
  // props.params= options.params;
  
  return <GanttBlockProvider {...props} params={options.params}></GanttBlockProvider>;
};
export const PrjWorkPlanAsynDataProvider = (props) => {
  const { record, service } = useDataSelectBlockContext();
  // const { form } = usePrjWorkFormProviderContext();
  if (!service || service.loading) {
    return null;
  }
  // const { start, end } = form.values;
  // const request = useMemo(() => {
  //   if (!record || !record.id) return null;
  //   const query = {
  //     ...usePrjWorkPlanFormDefValue(),
  //     start,
  //     end,
  //   };
  //   return {
  //     resource: `reportDetail`,
  //     action: 'list',
  //     params: {
  //       filter: {
  //         $and: [
  //           {
  //             prjId: {
  //               $eq: record.id,
  //             },
  //           },{
  //               report: {
  //                 status: {
  //                   value:{
  //                       $eq: '2'
  //                   }
  //                 },
  //               },
  //             },
  //           {
  //             report: {
  //               end: {
  //                 $dateBetween:[dayjs(query.start).format('YYYY-MM-DD'), dayjs(query.end).format('YYYY-MM-DD')]
  //               }
  //             }
  //           }
  //         ],
  //       },
  //       appends: ['report', 'report.user'],
  //       paginate: false,
  //     },
  //   };
  // }, [record, start, end]);

  const options = {
    collection: 'prj_plan',
    resource: 'prj_plan',
    action: 'list',
    fieldNames: {
      id: 'id',
      title: 'stage',
      start: 'start',
      end: 'end',
      range: 'day',
    },
    params: {
      appends: [],
      paginate: false,
      filters: {
        // $and: [
        //   {
        //     prj: {
        //       id: {
        //         $eq: record?.id,
        //       },
        //     },
        //   },
        // ],
      },
    },
  };
  const { params, ...others } = options;

  props.params.filter = {
    $and: [
      {
        prj: {
          id: {
            $eq: record?.id,
          },
        },
      },
    ],
  };

  return (
    <GanttBlockProvider {...props}></GanttBlockProvider>
    // <GanttBlockProvider uid="prjWork" {...{...props,...others}} params={params} runWhenParamsChanged>
    //   {/* <PrjWorkPlanProviderInner request={request} {...props} />
    //    */}
    //    {props.children}
    // </GanttBlockProvider>
    // <>{props.children}</>
  );
};
const PrjWorkFormProvider = connect((props) => {
  const { service } = useDataSelectBlockContext();
  const form = createForm({
    effects() {
      const defVal = usePrjWorkPlanFormDefValue();
      onFormReact((form) => {
        form.values = defVal;
      });
    },
  });
  if (service.loading) {
    return;
  }
  return (
    <PrjWorkFormProviderContext.Provider
      value={{
        form: form,
      }}
    >
      {props.children}
    </PrjWorkFormProviderContext.Provider>
  );
});

export const usePrjWorkProviderContext = () => {
  return useContext(PrjWorkProviderContext);
};
export const usePrjWorkFormProviderContext = () => {
  return useContext(PrjWorkFormProviderContext);
};
