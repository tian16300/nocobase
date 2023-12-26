import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActionContextProvider, AsyncDataProvider, IField, useAsyncData, useRequest } from '@nocobase/client';
import { connect, observer, useField } from '@formily/react';
import { useDataSelectBlockContext } from '../data-select';
import { createForm, onFormReact } from '@formily/core';
import { usePrjWorkStaticFormDefValue } from './hooks';
import { dayjs } from '@nocobase/utils';

const PrjWorkProviderContext = createContext<any>({});
const PrjWorkFormProviderContext = createContext<any>({});

const PrjWorkProviderInner = (props) => {
  const formCtx = usePrjWorkFormProviderContext();
  const field: IField = useField();
  const ctx = useAsyncData();
  const form = formCtx.form;
  field.loading = ctx.loading;
  const [visible, setVisible] = useState(false);
  const [valueType, setValueType] = useState('');
  const [recordList, setRecordList] = useState([]);
  const schema: any = {
    name: 'detail',
    type: 'void',
    properties: {
      drawer: {
        type: 'void',
        title: '明细',
        'x-component': 'Action.Modal',
        'x-component-props': {
          size: 'middle',
        },
        properties: {
          table: {
            type: 'array',
            'x-component': 'SubTable'
          },
          footer1: {
            type: 'void',
            'x-component': 'Action.Modal.Footer',
            properties: {
              close1: {
                title: 'Close',
                'x-component': 'Action',
                'x-component-props': {
                  useAction: '{{ useCloseAction }}',
                },
              },
            },
          },
        },
      },
    }};
  return (
    <PrjWorkProviderContext.Provider
      value={{
        service: ctx,
        form: form,
        field,
        valueType, setValueType,
        recordList, setRecordList
      }}
    >
      <ActionContextProvider value={{ visible, setVisible }} fieldSchema={schema as any}>
        {props.children}
      </ActionContextProvider>
    </PrjWorkProviderContext.Provider>
  );
};

export const PrjWorkProvider = (props) => {
  return (
    <PrjWorkFormProvider {...props}>
      <PrjWorkAsynDataProvider>
        <PrjWorkProviderInner {...props} />
      </PrjWorkAsynDataProvider>
    </PrjWorkFormProvider>
  );
};

const getWorkHoursStaticData = (record) => {
  //数据获取
  //总工时 数据来源 周报
  //工时  数据来源  周报
  //加班  数据来源 钉钉
  //出差  数据来源 钉钉 周报
  return new Promise(async (resolve) => {
    const recordId = record.id;
    const prjFilter = {
      belongsPrj: {
        id: {
          $eq: recordId,
        },
      },
    };
    const prjFilter1 = {
      prj: {
        id: {
          $eq: recordId,
        },
      },
    };
    //总工时 数据来源 周报
    const allHours = useRequest<any>({
      url: 'charts:query',
      method: 'POST',
      data: {
        collection: 'reportDetail',
        measures: [
          {
            field: ['hours'],
            aggregation: 'sum',
            alias: 'hours',
          },
        ],
        dimensions: [],
        filter: {
          $and: [prjFilter],
        },
      },
    });
    //工时  数据来源  周报
    const hours = useRequest<any>({
      url: 'charts:query',
      method: 'POST',
      data: {
        collection: 'reportDetail',
        measures: [
          {
            field: ['hours'],
            aggregation: 'sum',
            alias: 'hours',
          },
        ],
        dimensions: [],
        filter: {
          $and: [
            prjFilter,
            {
              $or: [
                {
                  isBusinessTrip: {
                    $notExists: true,
                  },
                },
                {
                  isBusinessTrip: {
                    $isFalsy: true,
                  },
                },
              ],
            },
          ],
        },
      },
    });

    //加班  数据来源  周报
    const jbHours = useRequest<any>({
      url: 'charts:query',
      method: 'POST',
      data: {
        collection: 'overtime',
        measures: [
          {
            field: ['duration'],
            aggregation: 'sum',
            alias: 'hours',
          },
        ],
        dimensions: [],
        filter: {
          $and: [prjFilter1],
        },
      },
    });

    //出差  数据来源  周报
    const ccHoursFromReport = useRequest<any>({
      url: 'charts:query',
      method: 'POST',
      data: {
        collection: 'reportDetail',
        measures: [
          {
            field: ['hours'],
            aggregation: 'sum',
            alias: 'hours',
          },
        ],
        dimensions: [],
        filter: {
          $and: [
            prjFilter,
            {
              isBusinessTrip: {
                $isTruly: true,
              },
            },
          ],
        },
      },
    });
    //出差  数据来源  钉钉
    const ccHoursFromDingTalk = useRequest<any>({
      url: 'charts:query',
      method: 'POST',
      data: {
        collection: 'business_trip',
        measures: [
          {
            field: ['numberdays'],
            aggregation: 'sum',
            alias: 'hours',
          },
        ],
        dimensions: [],
        filter: {
          $and: [prjFilter1],
        },
      },
    });
    if (allHours.data && hours.data && jbHours.data && ccHoursFromReport.data && ccHoursFromDingTalk.data) {
      resolve({
        allHours: allHours.data.hours,
        hours: hours.data.hours,
        jbHours: jbHours.data.hours,
        ccHoursFromReport: ccHoursFromReport.data.hours,
        ccHoursFromDingTalk: ccHoursFromDingTalk.data.hours,
      });
    }
  });
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
    const filterList: any = [
      {
        $or: [
          {
            belongsPrjKey: {
              $eq: record.id,
            },
          },
        ],
      },
      {
        report: {
          status: {
            value: {
              $eq: '2',
            },
          },
        },
      },
    ];
    if (query.start && query.end) {
      filterList.push({
        report: {
          end: {
            $dateBetween: [dayjs(query.start).format('YYYY-MM-DD'), dayjs(query.end).format('YYYY-MM-DD')],
          },
        },
      });
    }
    return {
      url: 'prj:hoursCount',
      method: 'get',
      params: {
        prjId: record.id,
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
