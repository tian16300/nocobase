import { BlockProvider, GanttBlockProvider, RecordProvider, css, useBlockRequestContext } from '@nocobase/client';
import React, { createContext, useContext, useMemo, useState } from 'react';
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
  const { params: propsParams, ...others } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
      `}
    >
      <BlockProvider data-testid="prj-field" {...options} params={params} runWhenParamsChanged>
        <PrjPlanCompareInnerProvider
          {...others}
          setRecordId={setRecordId}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        ></PrjPlanCompareInnerProvider>
      </BlockProvider>
    </div>
  );
};

export const PrjPlanCompareInnerProvider = (props: any) => {
  const { setRecordId } = props;
  const { fieldNames, ...others } = props;
  const { service } = useBlockRequestContext();
  const field = useField();
  const loading = service.loading;
  if (loading) return null;

  const record = service.data?.data[0];
  if (!record) return null;
  const [searchParams] = useSearchParams();
  let compVersionDefaultStr = searchParams.get('version');
  let compVersionDefault = null;
  if(compVersionDefaultStr){
    compVersionDefault = Number(compVersionDefaultStr).valueOf();
  }else{
    compVersionDefault = (record?.plan_version || [])[0]?.version;
  }
  
  const [version, setVersion] = useState('latest');
  const [compVersion, setCompVersion] = useState(compVersionDefault);
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

  const ganttParams = useMemo(() => {
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
    return params;
  }, [record.id, version, compVersion]);
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
      <GanttBlockProvider
        fieldNames={fieldNames}
        sort={'id'}
        barFill={28}
        params={ganttParams}
        record={record}
        values={values}
        TooltipContent={TooltipContent}
        preProcessData={preProcessData}
        hasMultiBar
        runWhenParamsChanged
        {...others}
      ></GanttBlockProvider>
    </PrjPlanCompareBlockContext.Provider>
  );
};

export const usePrjPlanCompareProviderContext = () => {
  return useContext(PrjPlanCompareBlockContext);
};
