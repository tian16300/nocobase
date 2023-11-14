import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Segmented, Space, Switch, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { css } from '@emotion/css';
import { debounce } from 'lodash';
import { SheetComponent, SheetComponentsProps } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { FormContext, RecursionField, useFieldSchema } from '@formily/react';
import { createForm } from '@formily/core';
import { SchemaComponentOptions } from '../../../core';
import {
  BlockProvider,
  useBlockRequestContext,
  useCollectionManager,
  useCompile,
  useParsedFilter,
  useRecord,
  useToken,
} from '../../../..';
export const TableMain = (props) => {
  return (
    <GroupTableMainProvider {...props}>
      <TableView {...props}></TableView>
    </GroupTableMainProvider>
  );
};
const TableView = (props: any) => {
  const s2Options = {
    width: 600,
    height: 480,
    showSeriesNumber: true,
    pagination: {
      pageSize: 10,
      current: 1,
    },
    interaction: {
      enableCopy: true,
      hoverHighlight: true,
      selectedCellsSpotlight: true,
      multiSelection: true,
    },
  };
  const compile = useCompile();

  const { service } = useBlockRequestContext();
  const { getCollectionField, getCollection } = useCollectionManager();
  const { fields, collection } = props;
  const visFields = fields.filter(({ visible }) => {
    return visible;
  });
  const columns = visFields.map(({ name }) => {
    return name;
  });
  const metas = visFields.map(({ name, title }) => {
    const field = getCollectionField(`${collection}.${name}`);
    let formatter = (value) => {
      return value;
    };
    if (field?.target) {
      const titleField = getCollection(field.target)?.titleField || 'id';
      formatter = (value) => {
        return value?.[titleField];
      };
    }
    return {
      field: name,
      name: compile(title),
      formatter: formatter,
    };
  });
  const s2DataConfig = {
    fields: {
      columns: columns,
    },
    meta: metas,
    data: service.data?.data || [],
  };

  const fieldSchema = useFieldSchema();
  const boxRef = useRef();
  const { token } = useToken();
  const textStyle = {
    fontSize: 14,
  };
  const textTheme = {
    text: {
      ...textStyle,
    },
    seriesText: {
      ...textStyle,
    },
    measureText: {
      ...textStyle,
    },
  };
  const { 
    paddingContentVerticalLG,
     padding, 
     colorFillAlterSolid: tableHeaderBg, 
     colorBorderSecondary,
     colorBgContainer,
     controlItemBgActive
    } = token as any;
  const DefaultTextTheme = {
    ...textTheme,
    seriesNumberWidth: 60,
    cell: {
      padding: {
        top: paddingContentVerticalLG,
        right: padding,
        bottom: paddingContentVerticalLG,
        left: padding,
      },
      backgroundColor:colorBgContainer,
    //   horizontalBorderColor:colorBorderSecondary,
    //   verticalBorderColor:'transparent',
      interactionState:{
        hoverFocus:{
            borderColor: controlItemBgActive
        },
        selected:{

        },
        highlight:{

        }
      }
    },
    splitLine:{
        horizontalBorderColor: colorBorderSecondary,
        verticalBorderColor: 'transparent'
    }
  };
  const colCellTheme = {
    cell:{
        ...DefaultTextTheme.cell,
        backgroundColor: tableHeaderBg,
        padding: {
            top: paddingContentVerticalLG,
            right: padding,
            bottom: paddingContentVerticalLG,
            left: padding,
          }
    }
  };

  const themeCfg = {
    name: 'gray',
    theme: {
      rowCell: {
        ...DefaultTextTheme
      },
      colCell: {
        ...DefaultTextTheme,
        ...colCellTheme,
      },

      //   cornerCell: { ...textTheme },
      //   rowCell: { ...textTheme },
      //   colCell: { ...textTheme },
      //   dataCell: {
      //     ...textTheme,
      //   },
    },
  } as any;
  return (
    <>
      <div
        className={css`
          margin-bottom: var(--nb-spacing);
        `}
      >
        <RecursionField name={'table-anctionBar'} schema={fieldSchema.properties.actions} />
      </div>
      <div ref={boxRef}>
        <SheetComponent
          themeCfg={themeCfg}
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="table"
          adaptive={{
            width: true,
            height: false,
            getContainer: () => boxRef.current,
          }}
          showPagination={{
            onChange: (current, pageSize) => {
              console.log(current, pageSize);
            },
            onShowSizeChange: (current, pageSize) => {
              console.log(current, pageSize);
            },
          }}
        />
      </div>
    </>
  );
};

const GroupTableMainProvider = (props) => {
  const resourceName = props.resource;
  const params = useMemo(() => {
    return { ...props.params };
  }, [props.params]);
  const fieldSchema = useFieldSchema();
  const { getCollection, getCollectionField } = useCollectionManager();
  const record = useRecord();

  const collection = getCollection(props.collection);
  const { treeTable } = fieldSchema?.['x-decorator-props'] || {};
  if (props.dragSort) {
    params['sort'] = ['sort'];
  }
  let childrenColumnName = 'children';
  if (collection?.tree && treeTable !== false) {
    if (resourceName?.includes('.')) {
      const f = getCollectionField(resourceName);
      if (f?.treeChildren) {
        childrenColumnName = f.name;
        params['tree'] = true;
      }
    } else {
      const f = collection.fields.find((f) => f.treeChildren);
      if (f) {
        childrenColumnName = f.name;
      }
      params['tree'] = true;
    }
  }
  const form = useMemo(() => createForm(), [treeTable]);
  const { filter: parsedFilter } = useParsedFilter({
    filterOption: params?.filter,
    currentRecord: { __parent: record, __collectionName: props.collection },
  });
  const paramsWithFilter = useMemo(() => {
    return {
      ...params,
      filter: parsedFilter,
    };
  }, [parsedFilter, params]);

  return (
    <SchemaComponentOptions scope={{ treeTable }}>
      <FormContext.Provider value={form}>
        <BlockProvider name={props.name || 'table'} {...props} params={paramsWithFilter} runWhenParamsChanged>
          {props.children}
        </BlockProvider>
      </FormContext.Provider>
    </SchemaComponentOptions>
  );
};
