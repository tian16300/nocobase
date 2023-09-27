import { css } from '@emotion/css';
import { ArrayField, Field } from '@formily/core';
import { RecursionField, Schema, observer, useField, useFieldSchema } from '@formily/react';
import {
  AssociationField,
  CollectionField,
  CollectionProvider,
  FormProvider,
  IField,
  RecordIndexProvider,
  RecordLink,
  RecordProvider,
  SchemaComponent,
  SchemaComponentOptions,
  Table,
  WithoutTableFieldResource,
  useCollectionManager,
  useCompile,
  useRecord,
  useRequest,
  useSchemaInitializer,
  useTableBlockContext,
  useToken,
} from '@nocobase/client';
import { uid } from '@nocobase/utils';
import { getValuesByPath } from '@nocobase/utils/client';
import { default as classNames } from 'classnames';
import dayjs from 'dayjs';
import { findIndex } from 'lodash';
import getValueByPath from 'packages/plugins/@nocobase/plugin-theme-editor/src/client/antd-token-previewer/utils/getValueByPath';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { Input, Space, Tag, theme, Tooltip } from 'antd';
import { Button, Space } from 'antd';
const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.endsWith('.Column') > -1;
};

export const components = {
  body: {
    row: (props) => {
      return <tr {...props} />;
    },
    cell: (props) => (
      <td
        {...props}
        className={classNames(
          props.className,
          css`
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `,
        )}
      />
    ),
  },
};

const useDef = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return [selectedRowKeys, setSelectedRowKeys];
};

const useDefDataSource = (options, props) => {
  const field = useField<Field>();
  return useRequest(() => {
    return Promise.resolve({
      data: field.value,
    });
  }, options);
};

const groupColumns = [
  {
    dataIndex: 'name',
    key: 'name',
  },
];

type CategorizeKey = 'primaryAndForeignKey' | 'relation' | 'systemInfo' | 'basic';
const CategorizeKeyNameMap = new Map<CategorizeKey, string>([
  ['primaryAndForeignKey', 'PK & FK fields'],
  ['relation', 'Association fields'],
  ['systemInfo', 'System fields'],
  ['basic', 'General fields'],
]);

interface CategorizeDataItem {
  key: CategorizeKey;
  name: string;
  data: Array<any>;
}
const PrjStageRecordViewer = (props) => {
  const { getCollectionField } = useCollectionManager();
  const fieldSchema = useFieldSchema();
  const { record } = props;
  const resourceName = 'task';
  const isGroup = record.isGroup;
  const groupField = record.groupType;
  const fieldName = 'status';
  const collectionFieldName = [resourceName, fieldName].join('.');
  const def = record[fieldName];
  const collectionField = getCollectionField(collectionFieldName);
  const schema = {
    type: 'string',
    'x-collection-field': collectionFieldName,
    'x-component': 'CollectionField',
    'x-component-props': {
      ellipsis: true,
      size: 'small',
      fieldNames: {
        label: 'label',
        value: 'id',
      },
      service: {
        params: {
          sort: 'id',
        },
      },
      mode: 'Select',
    },
    'x-decorator': null,
    'x-decorator-props': {
      labelStyle: {
        display: 'none',
      },
    },
    default: def,
  };
  return (
    <>
      {!isGroup && collectionField && (
        <CollectionProvider name={collectionField?.target ?? collectionField?.targetCollection}>
          <RecordProvider record={record[record.fieldName]}>
            <RecordProvider record={record}>
              <WithoutTableFieldResource.Provider value={true}>
                <FormProvider>
                  <RecursionField schema={schema} name={record.groupType} />
                </FormProvider>
              </WithoutTableFieldResource.Provider>
            </RecordProvider>
          </RecordProvider>
        </CollectionProvider>
      )}
    </>
  );
};
const TaskRecordViewer = (props) => {
  const fieldSchema = useFieldSchema();
  const { record } = props;
  const schema = {
    type: 'string',
    'x-collection-field': 'task.prjStage',
    'x-component': 'CollectionField',
    'x-component-props': {
      ellipsis: true,
      size: 'small',
      fieldNames: {
        label: 'stage.label',
        value: 'id',
      },
      service: {
        params: {
          appends: 'stage',
          sort: 'id',
        },
      },
      mode: 'Select',
    },
    'x-decorator': null,
    'x-decorator-props': {
      labelStyle: {
        display: 'none',
      },
    },
    default: record['prjStage'],
  };
  return (
    <>
      <CollectionProvider name={'prj_plan'}>
        <RecordProvider record={record['prjStage']}>
          <RecordProvider record={record}>
            <WithoutTableFieldResource.Provider value={true}>
              <FormProvider>
                <RecursionField schema={schema} name={'prjStage'} />
              </FormProvider>
            </WithoutTableFieldResource.Provider>
          </RecordProvider>
        </RecordProvider>
      </CollectionProvider>
    </>
  );
};
export const PrjWorkPlanTable: React.FC<any> = observer(
  (props) => {
    const { token } = useToken();
    const { pagination: pagination1, useProps, onChange, ...others1 } = props;
    const { pagination: pagination2, onClickRow, ...others2 } = useProps?.() || {};
    const {
      dragSort = false,
      showIndex = true,
      onRowSelectionChange,
      onChange: onTableChange,
      rowSelection,
      rowKey,
      required,
      onExpand,
      ...others
    } = { ...others1, ...others2 } as any;
    const field: IField = useField();

    const tableCtx = useTableBlockContext();
    const onRecordClick = useMemo(() => {
      return tableCtx.field.onRecordClick;
    }, []);
    const dataSource = field?.value?.slice?.()?.filter?.(Boolean) || [];
    const fieldSchema = useFieldSchema();
    const { expandFlag, allIncludesChildren } = tableCtx;

    const [expandedKeys, setExpandesKeys] = useState([]);

    // useEffect(() => {
    //   if (expandFlag) {
    //     setExpandesKeys(allIncludesChildren);
    //   } else {
    //     setExpandesKeys([]);
    //   }
    // }, [expandFlag, allIncludesChildren]);

    const columns = [
      // {
      //   title: '序号',

      //   key: 'index',
      //   render: (text, record, index: number) => {
      //     /**
      //      *
      //      */
      //     return <>{index + 1}</>;
      //   },
      // },
      {
        title: '分组',
        // dataIndex: 'prjStage',
        key: 'title',
        width: 240,
        render: (text, record, index) => {
          const { type } = record as any;
          const isRecordLink = !record.isGroup || (record.isGroup && record.groupType);
          return (
            <>
              <div
                className={css`
                  // display: flex;
                  // flex-direction: column;
                  // height: 100%;
                  .ant-btn.ant-btn-lg {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    height: auto;
                  }
                `}
              >
                {/* {isMilestone && <PrjStageRecordViewer record={record}></PrjStageRecordViewer>}
                {isTask && record?.name} */}
                {isRecordLink && (
                  <Button
                    type="link"
                    size="large"
                    onClick={() => {
                      if (typeof onRecordClick == 'function') {
                        onRecordClick(
                          {
                            ...record,
                          },
                          dataSource,
                        );
                      }
                    }}
                  >
                    {record?.title}
                  </Button>
                )}
                {!isRecordLink && <Button type="text"  size="large">{record?.title}</Button>}
              </div>
            </>
          );
        },
      },
      // {
      //   title: '状态',
      //   // dataIndex: 'prjStage',
      //   key: 'title',
      //   width: 200,
      //   render: (text, record, index) => {
      //     const { isGroup, groupType } = record as any;
      //     const isTaskSatus = !isGroup;
      //     return (
      //       <>
      //         <div
      //           className={css`
      //             display: flex;
      //             flex-direction: column;
      //             height: 100%;
      //           `}
      //         >
      //           {isTaskSatus && <PrjStageRecordViewer record={record}></PrjStageRecordViewer>}
      //         </div>
      //       </>
      //     );
      //   },
      // },
      // {
      //   title: '任务名称',
      //   dataIndex: 'title',
      //   key: 'title',
      //   // render: (text, record, index) => {
      //   //   /**
      //   //    *
      //   //    */
      //   //   return { text };
      //   // },
      // },
      // { title: '负责人', dataIndex: 'title', key: 'title' },
      {
        title: '开始时间',
        dataIndex: 'start',
        key: 'start',
        width: 160,
        render: (text, record, index) => {
          /**
           *
           */
          return <>{text ? dayjs(text).format('YYYY-MM-DD') : ''}</>;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end',
        key: 'end',
        width: 160,
        render: (text, record, index) => {
          return <>{text ? dayjs(text).format('YYYY-MM-DD') : ''}</>;
        },
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        //  expandable={{
        //   onExpand: (flag, record) => {
        //     const newKeys = flag ? [...expandedKeys, record.id] : expandedKeys.filter((i) => record.id !== i);
        //     setExpandesKeys(newKeys);
        //     onExpand?.(flag, record);
        //   },
        //   expandedRowKeys: expandedKeys,
        // }}
      />
    );
  },
  { displayName: 'PrjWorkPlanTable' },
);
