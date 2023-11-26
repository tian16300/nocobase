import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SchemaInitializer } from '../../../schema-initializer';
import { CollectionProvider, useCollection, useCollectionManager } from '../../../collection-manager';
import { GeneralSchemaDesigner, SchemaSettings } from '../../../schema-settings';
import { RecursionField, observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useCompile, useDesignable } from '../../hooks';
import { Action, ActionContextProvider, useActionContext } from '../action';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { linkageAction } from '../action/utils';
import { actionDesignerCss } from '../../../schema-initializer/components';
import { Button, Select } from 'antd';
import {
  RecordPickerContext,
  RecordPickerDrawer,
  RecordPickerProvider,
  getLabelFormatValue,
  useFieldNames,
  useLabelUiSchema,
} from '../record-picker';
import { unionBy } from 'lodash';
import {
  WithoutFormFieldResource,
  useAssociation,
  useFormBlockContext,
  useTableBlockContext,
} from '../../../block-provider';
import { useTreeFormBlockContext } from '..';

const DataBlockSelectorActionContext = createContext(null);
export const DataBlockSelectorAction: any = (props: any) => {
  const { value, collection: tName, multiple = true, addTo, onChange, ...buttonProps } = props;
  const fieldNames = useFieldNames(props);
  const [visible, setVisible] = useState(false);
  const fieldSchema = useFieldSchema();
  // const collectionField = {
  //   target: tName,
  // };
  const collection = useCollection();
  const { getCollectionField, getCollectionFields } = useCollectionManager();
  // const compile = useCompile();
  // const labelUiSchema = useLabelUiSchema(collectionField, fieldNames?.label || 'label');
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([]);
  const field = useField();
  const toFieldRef = useRef(null);
  const [toField, setToField] = useState({});
  useEffect(() => {
    if (addTo) {
      const target = getCollectionField(`${collection.name}.${addTo}`)?.target;
      if(target){
        const temp = getCollectionFields(target).find((item) => item.target === tName);
        if (temp) {
          setToField(temp);
        }
      }     
    }
  }, []);

  // useEffect(() => {
  //   if (value) {
  //     const opts = (Array.isArray(value) ? value : value ? [value] : []).map((option) => {
  //       const label = option[fieldNames.label];
  //       return {
  //         ...option,
  //         [fieldNames.label]: getLabelFormatValue(labelUiSchema, compile(label)),
  //       };
  //     });
  //     setOptions(opts);
  //   }
  // }, [value, fieldNames?.label]);

  const getValue = () => {
    // if (multiple == null) return null;

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
      <DataBlockSelectorActionContext.Provider
        value={{
          selectedRows,
          toField,
          addTo,
        }}
      >
        <Button
          {...buttonProps}
          onClick={() => {
            setVisible(true);
          }}
        >
          {field.title}
        </Button>
        {RecordPickerDrawer({
          multiple,
          onChange,
          selectedRows,
          setSelectedRows,
          // collectionField,
          visible,
          setVisible,
          fieldSchema,
          options,
          collection: tName
        })}
      </DataBlockSelectorActionContext.Provider>
    </div>
  );
};
DataBlockSelectorAction.Provider = () => {};
/**
 * 无效
 * @returns
 */
DataBlockSelectorAction.Initializer = () => {
  const { name, title } = useCollection();
  const { getCollectionFields } = useCollectionManager();
  const fields = getCollectionFields(name);
  const addToFields = fields
    .filter(({ type }) => {
      type == 'hasMany';
    })
    .map((item) => {
      return { label: item.uiSchema.title, value: item.name };
    });

  return (
    <GeneralSchemaDesigner title={title || name}>
      <SchemaSettings.ActionModalItem
        title="批量选择"
        schema={{
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              title: '选择数据表',
              'x-component': 'CollectionSelect',
            },
            addTo: {
              type: 'string',
              title: '添加到',
              'x-component': 'Select',
              enum: addToFields,
            },
          },
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      />
    </GeneralSchemaDesigner>
  );
};

DataBlockSelectorAction.Designer = (props) => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  const { name, title } = useCollection();
  const { getCollectionFields } = useCollectionManager();
  const fields = getCollectionFields(name);
  const addToFields = fields
    .filter(({ type }) => {
      return type == 'hasMany';
    })
    .map((item) => {
      return { label: item.uiSchema.title, value: item.name };
    });
  const initialValues = fieldSchema?.['x-component-props'];
  const isDataBlockSelectorActionField = fieldSchema?.['x-component-props']?.component === 'DataBlockSelectorAction';

  return (
    // <GeneralSchemaDesigner title={title || name}>
    <>
      {isDataBlockSelectorActionField && (
        <>
          <SchemaSettings.ButtonEditor />
          <SchemaSettings.ActionModalItem
            title="批量选择"
            schema={{
              type: 'object',
              properties: {
                collection: {
                  type: 'string',
                  title: '选择数据表',
                  'x-decorator': 'FormItem',
                  'x-component': 'CollectionSelect',
                },
                addTo: {
                  type: 'string',
                  title: '添加到',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: addToFields,
                },
              },
            }}
            initialValues={initialValues}
            onSubmit={(values) => {
              field.componentProps = {
                ...field.componentProps,
                ...values,
              };
              fieldSchema['x-component-props'] = {
                ...initialValues,
                ...values,
              };
              dn.emit('patch', {
                schema: {
                  ['x-uid']: fieldSchema['x-uid'],
                  'x-component-props': fieldSchema['x-component-props'],
                },
              });
              dn.refresh();
            }}
          />
        </>
      )}
    </>
    // </GeneralSchemaDesigner>
  );
};
const useDataBlockSelectorActionContext = () => {
  return useContext(DataBlockSelectorActionContext);
};

export const useDataBlockSelectorProps = () => {
  const { setVisible } = useActionContext();
  const { form } = useFormBlockContext();
  const { selectedRows, toField, addTo } = useDataBlockSelectorActionContext();
  return {
    async onClick() {
      debugger;
      const rows = selectedRows;
      // 获取当前的bom_wl字段的值
      const currentBomWl = form.values[addTo] || [];
      const newRows = [];
      // const toField = toFieldRef.current;
      const foreignKey = toField.foreignKey;
      const targetKey = toField.targetKey || 'id';
      rows.map(({[targetKey]: id, ...row}) => {
        const isExist = currentBomWl.find((item) => {
          return item[foreignKey] === id;
        });
        if (!isExist) {
          newRows.push({
            ...row,
            [toField.name]: {
              id,
              ...row,
            },
            [foreignKey]: id
          });
         
        }
      });
      const newBomWl = [...currentBomWl, ...newRows];
      // newBomWl.forEach((item,index) => {
      //   return item.__index = index;
      // });
      form.setValues({
        ...form.values,
        [addTo]: newBomWl
      });

      setVisible(false);
    },
    disabled: false,
  };
};
