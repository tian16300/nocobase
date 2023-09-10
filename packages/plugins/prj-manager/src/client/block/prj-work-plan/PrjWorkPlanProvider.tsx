import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AsyncDataProvider, IField, useAsyncData } from '@nocobase/client';
import { connect, observer, useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { createForm, onFormReact } from '@formily/core';
import { usePrjWorkStaticFormDefValue } from './hooks';
import { dayjs } from '@nocobase/utils';

const PrjWorkProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});

const PrjWorkProviderInner = (props) => {
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

export const PrjWorkPlanProvider = (props) => {
  return (
    <PrjWorkFormProvider {...props}>
      <PrjWorkAsynDataProvider>
        <PrjWorkProviderInner {...props} />
      </PrjWorkAsynDataProvider>
    </PrjWorkFormProvider>
  );
};
export const PrjWorkAsynDataProvider = observer((props) => {
  const { record } = useDataSelectBlockContext();
  const { form } = usePrjWorkFormProviderContext();
  const { start, end } = form.values;
  const request = useMemo(() => {
    if (!record || !record.id) return null;
    const query = {
      ...usePrjWorkStaticFormDefValue(),
      start,
      end,
    };
    return {
      resource: `reportDetail`,
      action: 'list',
      params: {
        filter: {
          $and: [
            {
              prjId: {
                $eq: record.id,
              },
            },{
                report: {
                  status: {
                    value:{
                        $eq: '2'
                    }
                  },
                },
              },
            {
              report: {
                end: {
                  $dateBetween:[dayjs(query.start).format('YYYY-MM-DD'), dayjs(query.end).format('YYYY-MM-DD')]
                }
              }
            }
          ],
        },
        appends: ['report', 'report.user'],
        paginate: false,
      },
    };
  }, [record, start, end]);
  return (
    <AsyncDataProvider uid="prjWork" request={request}>
      <PrjWorkProviderInner request={request} {...props} />
    </AsyncDataProvider>
  );
});
const PrjWorkFormProvider = connect((props) => {
  const { service } = useDataSelectBlockContext();
  const form = createForm({
    effects() {
      const defVal = usePrjWorkStaticFormDefValue();
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
