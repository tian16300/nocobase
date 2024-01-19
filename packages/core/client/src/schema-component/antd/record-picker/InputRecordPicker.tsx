import { ArrayField } from '@formily/core';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { Select } from 'antd';
import { differenceBy, unionBy } from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  TableSelectorParamsProvider,
  useTableSelectorProps as useTsp,
} from '../../../block-provider/TableSelectorProvider';
import { CollectionProvider, useCollection } from '../../../collection-manager';
import { FormProvider, SchemaComponentOptions } from '../../core';
import { useCompile } from '../../hooks';
import { ActionContextProvider, useActionContext } from '../action';
import { FileSelector } from '../preview';
import { useFieldNames } from './useFieldNames';
import { getLabelFormatValue, useLabelUiSchema } from './util';
import { useDataBlockSelectorProps } from '..';

export const RecordPickerContext = createContext(null);

function flatData(data) {
  const newArr = [];
  for (let i = 0; i < data.length; i++) {
    const children = data[i]['children'];
    if (Array.isArray(children)) {
      newArr.push(...flatData(children));
    }
    newArr.push({ ...data[i] });
  }
  return newArr;
}

const useTableSelectorProps = () => {
  const field = useField<ArrayField>();
  const {
    multiple,
    options = [],
    setSelectedRows,
    selectedRows: rcSelectRows = [],
    onChange,
  } = useContext(RecordPickerContext);
  const { onRowSelectionChange, rowKey = 'id', ...others } = useTsp();
  const { setVisible } = useActionContext();

  return {
    ...others,
    rowKey,
    rowSelection: {
      type: multiple ? 'checkbox' : 'radio',
      selectedRowKeys: rcSelectRows
        ?.filter((item) => options.every((row) => row[rowKey] !== item[rowKey]))
        .map((item) => item[rowKey]),
    },
    onRowSelectionChange(selectedRowKeys, selectedRows) {
      if (multiple) {
        const scopeRows = flatData(field.value) || [];
        const allSelectedRows = rcSelectRows || [];
        const otherRows = differenceBy(allSelectedRows, scopeRows, rowKey);
        const unionSelectedRows = unionBy(otherRows, selectedRows, rowKey);
        const unionSelectedRowKeys = unionSelectedRows.map((item) => item[rowKey]);
        setSelectedRows?.(unionSelectedRows);
        onRowSelectionChange?.(unionSelectedRowKeys, unionSelectedRows);
      } else {
        setSelectedRows?.(selectedRows);
        onRowSelectionChange?.(selectedRowKeys, selectedRows);
        onChange(selectedRows?.[0] || null);
        setVisible(false);
      }
    },
  };
};

const usePickActionProps = () => {
  const { setVisible } = useActionContext();
  const { multiple, selectedRows, onChange, options, collectionField } = useContext(RecordPickerContext);
  return {
    onClick() {
      if (multiple) {
        onChange(unionBy(selectedRows, options, collectionField?.targetKey || 'id'));
      } else {
        onChange(selectedRows?.[0] || null);
      }
      setVisible(false);
    },
  };
};

const useAssociation = (props) => {
  const fieldSchema = useFieldSchema();
  const { association } = props;
  const { getField } = useCollection();
  if (association) {
    return association;
  }
  return getField(fieldSchema.name);
};

interface IRecordPickerProps {
  multiple?: boolean;
  association?: string;
  value?: any;
  /** 是否显示 Upload 按钮（仅适用于文件场景下） */
  quickUpload?: boolean;
  /** 是否显示 Select 按钮（仅适用于文件场景下） */
  selectFile?: boolean;
  onChange?: (value: any) => void;
  [key: string]: any;
}

export const InputRecordPicker: React.FC<any> = (props: IRecordPickerProps) => {
  const { value, multiple, onChange, quickUpload, selectFile, ...others } = props;
  const fieldNames = useFieldNames(props);
  const [visible, setVisible] = useState(false);
  const fieldSchema = useFieldSchema();
  const collectionField = useAssociation(props);
  const compile = useCompile();
  const labelUiSchema = useLabelUiSchema(collectionField, fieldNames?.label || 'label');
  const showFilePicker = isShowFilePicker(labelUiSchema);
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (value) {
      const opts = (Array.isArray(value) ? value : value ? [value] : []).map((option) => {
        const label = option[fieldNames.label];
        return {
          ...option,
          [fieldNames.label]: getLabelFormatValue(labelUiSchema, compile(label)),
        };
      });
      setOptions(opts);
    }
  }, [value, fieldNames?.label]);

  const getValue = () => {
    if (multiple == null) return null;

    return Array.isArray(value) ? value?.map((v) => v[fieldNames.value]) : value?.[fieldNames.value];
  };

  const handleSelect = () => {
    setVisible(true);
    setSelectedRows([]);
  };

  const handleRemove = (file) => {
    const newOptions = options.filter((option) => option.id !== file.id);
    setOptions(newOptions);
    if (newOptions.length === 0) {
      return onChange(null);
    }
    onChange(newOptions);
  };

  return (
    <div>
      {showFilePicker ? (
        <FileSelector
          value={options}
          multiple={multiple}
          quickUpload={quickUpload}
          selectFile={selectFile}
          action={`${collectionField?.target}:create`}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onChange={(changed) => {
            if (changed.every((file) => file.status !== 'uploading')) {
              changed = changed.filter((file) => file.status === 'done').map((file) => file.response.data);
              if (multiple) {
                onChange([...options, ...changed]);
              } else {
                onChange(changed[0]);
              }
            }
          }}
        />
      ) : (
        <Select
          {...others}
          mode={multiple ? 'multiple' : props.mode}
          fieldNames={fieldNames}
          popupMatchSelectWidth={false}
          onDropdownVisibleChange={(open) => {
            setVisible(true);
          }}
          allowClear
          onChange={(changed: any) => {
            if (!changed) {
              const value = multiple ? [] : null;
              onChange(value);
              setSelectedRows(value);
              setOptions([]);
            } else if (Array.isArray(changed)) {
              if (!changed.length) {
                onChange([]);
                setSelectedRows([]);
                return;
              }

              const values = options?.filter((option) => changed.includes(option[fieldNames.value]));
              onChange(values);
              setSelectedRows(values);
            }
          }}
          options={options}
          value={getValue()}
          open={false}
        />
      )}
      {RecordPickerDrawer({
        multiple,
        onChange,
        selectedRows,
        setSelectedRows,
        collectionField,
        visible,
        setVisible,
        fieldSchema,
        options,
      })}
    </div>
  );
};

export const RecordPickerProvider = (props) => {
  const { multiple, onChange, selectedRows, setSelectedRows, options, collectionField, ...other } = props;
  return (
    <RecordPickerContext.Provider
      value={{ multiple, onChange, selectedRows, setSelectedRows, options, collectionField, ...other }}
    >
      {props.children}
    </RecordPickerContext.Provider>
  );
};

export const RecordPickerDrawer: React.FunctionComponent<{
  multiple: any;
  onChange: any;
  selectedRows: any[];
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
  collectionField?: any;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  fieldSchema;
  options: any[];
  collection?: string;
  openSize?: 'small' | 'middle' | 'large'
}> = ({
  multiple,
  onChange,
  selectedRows,
  setSelectedRows,
  collectionField,
  visible,
  setVisible,
  fieldSchema,
  options,
  collection,
  openSize

}) => {
  const getFilter = () => {
    if(collectionField){
      const targetKey = collectionField?.targetKey || 'id';
      const list = options.map((option) => option[targetKey]).filter(Boolean);
      const filter = list.length ? { $and: [{ [`${targetKey}.$ne`]: list }] } : {};
      return filter;
    }else{
      return {}
    }
  
  };
  const recordPickerProps = {
    multiple,
    onChange,
    selectedRows,
    setSelectedRows,
    options,
    collectionField,
    collection
  };
  return (
    <RecordPickerProvider {...recordPickerProps}>
      <CollectionProvider allowNull name={collectionField?.target || collection}>
        <ActionContextProvider openMode="drawer" visible={visible} setVisible={setVisible} openSize={openSize}>
          <FormProvider>
            <TableSelectorParamsProvider params={{ filter: getFilter() }}>
              <SchemaComponentOptions scope={{ useTableSelectorProps, usePickActionProps, useDataBlockSelectorProps }}>
                <RecursionField
                  schema={fieldSchema}
                  onlyRenderProperties
                  filterProperties={(s) => {
                    return s['x-component'] === 'RecordPicker.Selector';
                  }}
                />
              </SchemaComponentOptions>
            </TableSelectorParamsProvider>
          </FormProvider>
        </ActionContextProvider>
      </CollectionProvider>
    </RecordPickerProvider>
  );
};

export function isShowFilePicker(labelUiSchema) {
  return labelUiSchema?.['x-component'] === 'Preview';
}
