import { BlockProvider, GanttBlockProvider, RecordProvider, useBlockRequestContext } from '@nocobase/client';
import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useField } from '@formily/react';
import { preProcessData } from './scopes';
import { TooltipContent } from './TooltipContent';

const PrjPlanCompareBlockContext = createContext<any>({});

export const PrjPlanCompareProvider = (props) => {
  const [searchParams] = useSearchParams();
  const options = {
    collection: 'prj',
    resource: 'prj',
    action: 'list',
  };
  const id = searchParams.get('id');
  const [recordId, setRecordId] = useState(id);
  const params: any = {
    pageSize: 1,
    appends: ['plans', 'plan_version'],
  };
  if (recordId) {
    params.filter = {
      id: recordId,
    };
  }
  return (
    <>
      <BlockProvider data-testid="prj-field" {...options} params={params} runWhenParamsChanged>
        <PrjPlanCompareInnerProvider {...props} setRecordId={setRecordId}></PrjPlanCompareInnerProvider>
      </BlockProvider>
    </>
  );
};

export const PrjPlanCompareInnerProvider = (props: any) => {
  const { setRecordId} = props;
  const {fieldNames, ...others} = props;
  const { service } = useBlockRequestContext();
  const field = useField();
  const loading = service.loading;
  if (loading) return null;

  const record = service.data?.data[0];
  if (!record) return null;

  const [version, setVersion] = useState('latest');
  const [compVersion, setCompVersion] = useState((record?.plan_version||[])[0]?.version);
  const setValues = {
    prj: ({ id }) => {
      setRecordId(id);
    },
    version: setVersion,
    compVersion: setCompVersion,
  };
  const values = {
    prj: record,
    version,
    compVersion,
  };
  const versions = [
    {
      label: '最新版本',
      value: 'latest',
    },
  ].concat(
    record?.plan_version.map((item) => {
      return {
        ...item,
        label: '版本' + item.version,
        value: item.version,
      };
    }),
  );

  const params: any = {
    sort: 'id',
  };

  if (record && record.id) {
    const curVersion = version;
    const versions = [curVersion, compVersion].filter((key) => {
      return key !== 'latest';
    });
    const _version =
      versions.length > 0
        ? {
            $in: versions,
          }
        : null;
    params.filter = {
      prjId: record.id,
    };
    if (version) {
      params.filter.version = _version;
    }
  }
  const ganttParams = params;
  fieldNames.comp = 'comp';
  fieldNames.title = 'text';
  return (
    <PrjPlanCompareBlockContext.Provider
      value={{
        service,
        field,
        versions,
        record,
        values,
        setValues,
      }}
    >
      {!loading && (
          <GanttBlockProvider
            {...others}
            fieldNames={fieldNames}
            sort={'id'}
            barFill = {28}
            params={ganttParams}
            record={record}
            values={values}
            TooltipContent={TooltipContent}
            preProcessData={preProcessData}
            hasMultiBar
            runWhenParamsChanged
          ></GanttBlockProvider>
      )}
    </PrjPlanCompareBlockContext.Provider>
  );
};

export const usePrjPlanCompareProviderContext = () => {
  return useContext(PrjPlanCompareBlockContext);
};
