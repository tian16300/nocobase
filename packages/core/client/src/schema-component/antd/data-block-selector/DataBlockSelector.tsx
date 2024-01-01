import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CollectionProvider, useCollection, useCollectionManager } from '../../../collection-manager';
import { GeneralSchemaDesigner, SchemaSettingsActionModalItem, SchemaSettingsButtonEditor } from '../../../schema-settings';
import { RecursionField, observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useCompile, useDesignable } from '../../hooks';
import { Action, ActionContextProvider, useActionContext } from '../action';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { linkageAction } from '../action/utils';
import { actionDesignerCss } from '../../../schema-initializer/components';
import { Button, Select, Space } from 'antd';
import { RecordPickerDrawer, useFieldNames } from '../record-picker';
import { unionBy } from 'lodash';
import {
  WithoutFormFieldResource,
  useAssociation,
  useFormBlockContext,
  useFormBlockType,
  useTableBlockContext,
} from '../../../block-provider';
import { SchemaInitializer, useSchemaInitializerItem } from '../../../application';
import { ActionInitializer, BlockInitializer } from '../../../schema-initializer';

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
  const { form } = useFormBlockContext();
  useEffect(() => {
    if (addTo) {
      const target = getCollectionField(`${collection.name}.${addTo}`)?.target;
      if (target) {
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
  const handleEmpty = () => {
    const field = form.query(addTo).take();
    field.onInput([]);
  }

  return (
    <div>
      <DataBlockSelectorActionContext.Provider
        value={{
          selectedRows,
          toField,
          addTo,
        }}
      >
        <Space>
          <Button
            {...buttonProps}
            onClick={() => {
              setVisible(true);
            }}
          >
            {field.title}
          </Button>
          <Button onClick={handleEmpty}>清空</Button>
        </Space>
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
          collection: tName,
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
  const collection = useCollection();
  const itemConfig = useSchemaInitializerItem();

  const schema = {};
  if (collection && schema['x-acl-action']) {
    schema['x-acl-action'] = `${collection.name}:${schema['x-acl-action']}`;
    schema['x-decorator'] = 'ACLActionProvider';
  }

  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />; 
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
          <SchemaSettingsButtonEditor />
          <SchemaSettingsActionModalItem
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
                }
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
  const { type } = useFormBlockType();
  return {
    async onClick() {
      const rows = selectedRows;
      const field = form.query(addTo).take();
      // 获取当前的bom_wl字段的值
      const currentBomWl = field.value || [];
      const newRows = [];
      const foreignKey = toField.foreignKey;
      const targetKey = toField.targetKey || 'id';
      rows.map(({ [targetKey]: id, ...row }) => {
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
            [foreignKey]: id,
          });
        }
      });
      const newBomWl = [...currentBomWl, ...newRows];

      field.onInput(newBomWl);
      setVisible(false);
    },
    disabled: false,
  };
};
