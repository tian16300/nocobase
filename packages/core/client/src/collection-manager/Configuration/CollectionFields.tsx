import { css } from '@emotion/css';
import { createForm, Field } from '@formily/core';
import { FieldContext, FormContext, useField } from '@formily/react';
import { Button, Space, Switch, Table, TableColumnProps, Tag, Tooltip } from 'antd';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentAppInfo } from '../../appInfo';
import { RecordProvider, useRecord } from '../../record-provider';
import { Action, useAttach, useCompile } from '../../schema-component';
import {
  isDeleteButtonDisabled,
  useBulkDestroyActionAndRefreshCM,
  useDestroyActionAndRefreshCM,
} from '../action-hooks';
import { useCollectionManager } from '../hooks/useCollectionManager';
import {
  ResourceActionContext,
  ResourceActionProvider,
  useResourceActionContext,
  useResourceContext,
} from '../ResourceActionProvider';
import { AddCollectionField } from './AddFieldAction';
import { EditCollectionField } from './EditFieldAction';
import { OverridingCollectionField } from './OverridingCollectionField';
import { collection } from './schemas/collectionFields';
import { SyncFieldsAction } from './SyncFieldsAction';
import { ViewCollectionField } from './ViewInheritedField';
import { Input } from '../../schema-component/antd/input';
import { Icon } from '../../icon';
import { useToken } from '../../style';

const indentStyle = css`
  .ant-table {
    margin-left: -16px !important;
  }
`;
const tableContainer = css`
  tr {
    display: flex;
  }
  td,
  th {
    flex: 2;
    width: 0;
    &:last-child {
      flex: 1;
    }
  }
  .ant-table-selection-column,
  .ant-table-row-expand-icon-cell {
    flex-basis: 50px !important;
    min-width: 50px;
    flex: 0;
  }
`;

const titlePrompt = 'Default title for each record';

const CurrentFields = (props) => {
  const compile = useCompile();
  const { getInterface } = useCollectionManager();
  const { t } = useTranslation();
  const { setState } = useResourceActionContext();
  const { resource, targetKey } = props.collectionResource || {};
  const { [targetKey]: filterByTk, titleField } = useRecord();
  const [loadingRecord, setLoadingRecord] = React.useState<any>(null);
  const { refreshCM, isTitleField } = useCollectionManager();
  const { token } = useToken();
  const iconStyle = css`
    .anticon {
      color: ${token.colorTextQuaternary};
    }
    &:hover,
    &:active {
      .anticon {
        color: inherit;
      }
    }
  `;
  const columns: TableColumnProps<any>[] = [
    {
      dataIndex: ['uiSchema', 'rawTitle'],
      title: t('Field display name'),
      render: (value) => <div style={{ marginLeft: 7 }}>{compile(value)}</div>,
    },
    {
      dataIndex: 'name',
      title: t('Field name'),
    },
    {
      dataIndex: 'interface',
      title: t('Field interface'),
      render: (value) => <Tag>{compile(getInterface(value)?.title)}</Tag>,
    },

    {
      dataIndex: ['uiSchema', 'icon'],
      title: t('Field icon'),
      render: (value) => {
        return value ? (
          <Button className={iconStyle} size="large" type="dashed" shape="circle">
            <Icon type={value}></Icon>
          </Button>
        ) : null;
      },
    },
    {
      dataIndex: 'titleField',
      title: t('Title field'),
      render: function Render(_, record) {
        const handleChange = (checked) => {
          setLoadingRecord(record);
          resource
            .update({ filterByTk, values: { titleField: checked ? record.name : 'id' } })
            .then(async () => {
              await props.refreshAsync();
              // if (data?.data) {
              //   // updateCollection(data.data);
              // }
              setLoadingRecord(null);
              refreshCM();
            })
            .catch((err) => {
              setLoadingRecord(null);
              console.error(err);
            });
        };

        return isTitleField(record) ? (
          <Tooltip title={t(titlePrompt)} placement="right" overlayInnerStyle={{ textAlign: 'center' }}>
            <Switch
              size="small"
              loading={record.name === loadingRecord?.name}
              checked={record.name === (titleField || 'id')}
              onChange={handleChange}
            />
          </Tooltip>
        ) : null;
      },
    },
    {
      dataIndex: 'description',
      title: t('Descriptio '),
      render: (value) => <Input.ReadPretty value={value} ellipsis={true} />,
    },
    {
      dataIndex: 'actions',
      title: t('Actions'),
      render: (_, record) => {
        const deleteProps = {
          confirm: {
            title: t('Delete record'),
            content: t('Are you sure you want to delete it?'),
          },
          useAction: useDestroyActionAndRefreshCM,
          disabled: isDeleteButtonDisabled(record),
          title: t('Delete'),
        };

        return (
          <RecordProvider record={record}>
            <Space>
              <EditCollectionField type="primary" />
              <Action.Link {...deleteProps} />
            </Space>
          </RecordProvider>
        );
      },
    },
  ];
  return (
    <Table
      rowKey={'name'}
      columns={columns}
      showHeader={false}
      pagination={false}
      dataSource={props.fields}
      rowSelection={{
        type: 'checkbox',
        onChange: (selectedRowKeys) => {
          setState((state) => {
            return {
              ...state,
              selectedRowKeys,
            };
          });
        },
      }}
      className={indentStyle}
    />
  );
};

const InheritFields = (props) => {
  const compile = useCompile();
  const { getInterface } = useCollectionManager();
  const { resource, targetKey } = props.collectionResource || {};
  const { [targetKey]: filterByTk, titleField, name } = useRecord();
  const [loadingRecord, setLoadingRecord] = React.useState(null);
  const { t } = useTranslation();
  const { refreshCM, isTitleField } = useCollectionManager();

  const columns: TableColumnProps<any>[] = [
    {
      dataIndex: ['uiSchema', 'rawTitle'],
      title: t('Field display name'),
      render: (value) => <div style={{ marginLeft: 1 }}>{compile(value)}</div>,
    },
    {
      dataIndex: 'name',
      title: t('Field name'),
    },
    {
      dataIndex: 'interface',
      title: t('Field interface'),
      render: (value) => <Tag>{compile(getInterface(value)?.title)}</Tag>,
    },
    {
      dataIndex: 'titleField',
      title: t('Title field'),
      render(_, record) {
        const handleChange = (checked) => {
          setLoadingRecord(record);
          resource
            .update({ filterByTk, values: { titleField: checked ? record.name : 'id' } })
            .then(async () => {
              await props.refreshAsync();
              // if (data?.data) {
              //   updateCollection(data.data);
              // }
              setLoadingRecord(null);
              refreshCM();
            })
            .catch((err) => {
              setLoadingRecord(null);
              console.error(err);
            });
        };

        return isTitleField(record) ? (
          <Tooltip title={t(titlePrompt)} placement="right" overlayInnerStyle={{ textAlign: 'center' }}>
            <Switch
              size="small"
              loading={record.name === loadingRecord?.name}
              checked={record.name === (titleField || 'id')}
              onChange={handleChange}
            />
          </Tooltip>
        ) : null;
      },
    },
    {
      dataIndex: 'actions',
      title: t('Actions'),
      render: function Render(_, record) {
        const overrideProps = {
          type: 'primary',
          currentCollection: name,
        };
        const viewCollectionProps = {
          type: 'primary',
        };

        return (
          <RecordProvider record={record}>
            <Space>
              <OverridingCollectionField {...overrideProps} />
              <ViewCollectionField {...viewCollectionProps} />
            </Space>
          </RecordProvider>
        );
      },
    },
  ];
  return (
    <Table
      rowKey={'name'}
      columns={columns}
      showHeader={false}
      pagination={false}
      dataSource={props.fields.filter((field) => field.interface)}
    />
  );
};

export const CollectionFields = () => {
  const compile = useCompile();
  const field = useField<Field>();
  const { name } = useRecord();
  const {
    data: { database },
  } = useCurrentAppInfo();
  const { getInterface, getInheritCollections, getCollection, getCurrentCollectionFields } = useCollectionManager();
  const form = useMemo(() => createForm(), []);
  const f = useAttach(form.createArrayField({ ...field.props, basePath: '' }));
  const { t } = useTranslation();
  const collectionResource = useResourceContext();
  const { refreshAsync } = useContext(ResourceActionContext);

  const inherits = getInheritCollections(name);

  const columns: TableColumnProps<any>[] = [
    {
      dataIndex: 'title',
      title: t('Field display name'),
      render: (value) => (
        <div
          className={css`
            font-weight: 500;
          `}
        >
          {value}
        </div>
      ),
    },
    {
      dataIndex: 'name',
      title: t('Field name'),
    },
    {
      dataIndex: 'interface',
      title: t('Field interface'),
    },
    {
      dataIndex: 'icon',
      title: t('Field icon'),
    },
    {
      dataIndex: 'titleField',
      title: t('Title field'),
    },
    {
      dataIndex: 'description',
      title: t('Description'),
    },
    {
      dataIndex: 'actions',
      title: t('Actions'),
    },
  ];

  const fields = getCurrentCollectionFields(name);
  const groups = {
    pf: [],
    association: [],
    general: [],
    system: [],
  };

  fields.forEach((field) => {
    if (field.primaryKey || field.isForeignKey) {
      groups.pf.push(field);
    } else if (field.interface) {
      const conf = getInterface(field.interface);
      if (conf.group === 'systemInfo') {
        groups.system.push(field);
      } else if (conf.group === 'relation') {
        groups.association.push(field);
      } else {
        groups.general.push(field);
      }
    }
  });

  const dataSource = [
    {
      key: 'pf',
      title: t('PK & FK fields'),
      fields: groups.pf,
    },
    {
      key: 'association',
      title: t('Association fields'),
      fields: groups.association,
    },
    {
      key: 'general',
      title: t('General fields'),
      fields: groups.general,
    },
    {
      key: 'system',
      title: t('System fields'),
      fields: groups.system,
    },
  ];
  dataSource.push(
    ...inherits
      .map((key) => {
        const collection = getCollection(key);
        if (!collection) {
          return;
        }
        return {
          key,
          title: `${t('Inherited fields')} - ` + compile(collection?.title),
          inherit: true,
          fields: collection?.fields || [],
        };
      })
      .filter(Boolean),
  );

  const resourceActionProps = {
    association: {
      sourceKey: 'name',
      targetKey: 'name',
    },
    collection,
    request: {
      resource: 'collections.fields',
      action: 'list',
      params: {
        paginate: false,
        filter: {
          $or: [{ 'interface.$not': null }, { 'options.source.$notEmpty': true }],
        },
        sort: ['sort'],
      },
    },
  };

  const deleteProps = useMemo(
    () => ({
      useAction: useBulkDestroyActionAndRefreshCM,
      title: t('Delete'),
      icon: 'DeleteOutlined',
      confirm: {
        title: t('Delete record'),
        content: t('Are you sure you want to delete it?'),
      },
    }),
    [t],
  );
  const addProps = { type: 'primary', database };
  const syncProps = { type: 'primary' };
  console.log(dataSource);
  return (
    <ResourceActionProvider {...resourceActionProps}>
      <FormContext.Provider value={form}>
        <FieldContext.Provider value={f}>
          <Space
            align={'end'}
            className={css`
              justify-content: flex-end;
              display: flex;
              margin-bottom: 16px;
            `}
          >
            <Action {...deleteProps} />
            <SyncFieldsAction {...syncProps} />
            <AddCollectionField {...addProps} />
          </Space>
          <Table
            rowKey={'key'}
            columns={columns}
            dataSource={dataSource.filter((d) => d.fields.length)}
            pagination={false}
            className={tableContainer}
            expandable={{
              defaultExpandAllRows: true,
              defaultExpandedRowKeys: dataSource.map((d) => d.key),
              expandedRowRender: (record) =>
                record.inherit ? (
                  <InheritFields
                    fields={record.fields}
                    collectionResource={collectionResource}
                    refreshAsync={refreshAsync}
                  />
                ) : (
                  <CurrentFields
                    fields={record.fields}
                    collectionResource={collectionResource}
                    refreshAsync={refreshAsync}
                  />
                ),
            }}
          />
        </FieldContext.Provider>
      </FormContext.Provider>
    </ResourceActionProvider>
  );
};
