import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CollectionProvider, useCollection, useCollectionManager } from '../../../collection-manager';
import {
  GeneralSchemaDesigner,
  SchemaSettingsActionModalItem,
  SchemaSettingsButtonEditor,
  SchemaSettingsModalItem,
} from '../../../schema-settings';
import { RecursionField, observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useCompile, useDesignable } from '../../hooks';
import { Action, ActionContextProvider, useActionContext } from '../action';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { linkageAction } from '../action/utils';
import { actionDesignerCss } from '../../../schema-initializer/components';
import { Button, Select, Space, message } from 'antd';
import { RecordPickerDrawer, useFieldNames } from '../record-picker';
import { unionBy } from 'lodash';
import { useFormBlockContext, useFormBlockType } from '../../../block-provider';
import { useSchemaInitializerItem } from '../../../application';
import { BlockInitializer } from '../../../schema-initializer';
import { spliceArrayState } from '@formily/core/esm/shared/internals';
const DataBlockSelectorActionContext = createContext(null);
export const DataBlockSelectorAction: any = (props: any) => {
  const {
    value,
    collection: tName,
    multiple = true,
    addTo,
    sumFields,
    groupBy,
    fieldMaps = [],
    onChange,
    ...buttonProps
  } = props;
  const fieldNames = useFieldNames(props);
  const [visible, setVisible] = useState(false);
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const { getCollectionField, getCollectionFields } = useCollectionManager();
  // const compile = useCompile();
  // const labelUiSchema = useLabelUiSchema(collectionField, fieldNames?.label || 'label');
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([]);
  const field = useField();
  const [toField, setToField] = useState<any>({});
  const [toCollectionName, setToCollectionName] = useState<any>(null);
  const [groupField, setGroupField] = useState({});
  const { form } = useFormBlockContext();
  useEffect(() => {
    if (addTo) {
      const target = getCollectionField(`${collection.name}.${addTo}`)?.target;
      if (target) {
        const temp = getCollectionFields(target).find((item) => item.target === tName);
        if (temp) {
          setToField(temp);
          setToCollectionName(target);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (groupBy) {
      const groupField = getCollectionField(`${tName}.${groupBy}`);
      setGroupField(groupField);
    }
  }, []);
  const handleEmpty = () => {
    const field = form.query(addTo).take();
    const len = field.value?.length;
    spliceArrayState(field as any, {
      startIndex: 0,
      deleteCount: field.value?.length,
    });
    field.value.splice(0, len);
    field.initialValue?.splice(0, len);
    field.onInput(field.value);
  };

  return (
    <div>
      <DataBlockSelectorActionContext.Provider
        value={{
          selectedRows,
          toField,
          addTo,
          groupField,
          sumFields,
          fieldMaps,
          source: {
            from: tName,
            to: toCollectionName,
          },
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
const useDataBlockSelectorActionContext = () => {
  return useContext(DataBlockSelectorActionContext);
};

export const useDataBlockSelectorProps = () => {
  const { setVisible } = useActionContext();
  const { form } = useFormBlockContext();
  const { selectedRows, toField, addTo, groupField, sumFields, fieldMaps, source } =
    useDataBlockSelectorActionContext();
  const { getCollectionField } = useCollectionManager();
  /* 设置映射值 */
  const setFieldMap = (row, targetFieldName, fieldName, source) => {
    const { from, to } = source;
    const targetField = getCollectionField(`${to}.${targetFieldName}`);
    const field = getCollectionField(`${from}.${fieldName}`);
    if (row) {
      row[targetFieldName] = row[fieldName];
      if (targetField?.foreignKey) {
        row[targetField.foreignKey] = row[field.foreignKey];
      }
    }
  };
  return {
    async onClick() {
      const rows = selectedRows;
      const field = form.query(addTo).take();
      // 获取当前的bom_wl字段的值
      const currentRecords = field.value || [];
      if (!toField || !toField.foreignKey) {
        message.error('字段关系配置错误, 请联系管理员');
        return;
      }
      const newRows = [];
      const foreignKey = toField.foreignKey;
      const targetKey = toField.targetKey || 'id';
      if (toField && toField?.interface == 'obo') {
        rows.map(({ [targetKey]: id, ...row }) => {
          const isExist = currentRecords.find((item) => {
            return item[foreignKey] === id;
          });
          if (!isExist) {
            /* 一对一的关系 */
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
      } else if (toField && toField?.interface == 'm2m') {
        /* 一对多的关系 */
        if (!groupField) {
          message.error('缺少分组字段配置, 请联系管理员');
          return;
        }
        /* 根据分组字段进行调整 分组字段不包含值时 */
        const rowMap = {},
          otherRows = [];
        const groupRecords = rows.reduce((group, record) => {
          const category = record[groupField.foreignKey];
          if (category) {
            rowMap[category] = record[groupField.name];
            group[category] = group[category] ?? [];
            group[category].push(record);
          } else {
            const { id, ...others } = record;
            otherRows.push({
              ...others,
              [toField.name]: [record],
              [toField.otherKey]: id,
            });
          }
          return group;
        }, {});
        const addGroupRows = Object.values(rowMap).map(({ id, ...others }) => {
          let item = {
            ...others,
            [groupField.name]: { id, ...others },
            [groupField.foreignKey]: id,
            [toField.name]: groupRecords[id],
          };
          if (sumFields) {
            sumFields?.map((name) => {
              const sum = groupRecords[id].reduce((prev, cur) => {
                return prev + (typeof cur[name] == 'number' ? cur[name] : 0);
              }, 0);
              item[name] = sum;
            });
          }
          return item;
        });
        const addRows = [...addGroupRows, ...otherRows];
        addRows.map((row) => {
          const index = currentRecords.findIndex((item) => {
            return item[foreignKey] === row[foreignKey];
          });

          if (fieldMaps.length > 0) {
            fieldMaps.map(({ field, mapField }) => {
              setFieldMap(row, mapField, field, source);
            });
          }
          if (index == -1) {
            /* 一对一的关系 */
            newRows.push({
              ...row,
            });
          } else {
            currentRecords[index] = {
              ...currentRecords[index],
              ...row,
            };
          }
        });
      }
      const newBomWl = [...currentRecords, ...newRows];

      field.onInput(newBomWl);
      setVisible(false);
    },
    disabled: false,
  };
};
