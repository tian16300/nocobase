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

const DataBlockSelectorActionContext = createContext(null);
export const DataBlockSelectorAction: any = (props: any) => {
  const { value, collection: tName, multiple = true, addTo, sumFields, groupBy, fieldMaps =[], onChange, ...buttonProps } = props;
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
  const [groupField, setGroupField] = useState({});
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
  useEffect(() => {
    if (groupBy) {
      const groupField = getCollectionField(`${tName}.${groupBy}`);
      setGroupField(groupField);
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
          fieldMaps
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

// export const EditDataBlockSelectorAction = () => {
//   const fieldSchema = useFieldSchema();
//   const field = useField();
//   const { dn } = useDesignable();
//   const { name, title } = useCollection();
//   const { getCollectionFields } = useCollectionManager();
//   const fields = getCollectionFields(name);
//   const addToFields = fields
//     .filter(({ type }) => {
//       return type == 'hasMany';
//     })
//     .map((item) => {
//       return { label: item?.uiSchema?.title, value: item.name };
//     });
//   const initialValues = fieldSchema?.['x-component-props'];
//   return (
//     <>
//       <SchemaSettingsButtonEditor />
//         <SchemaSettingsModalItem
//           title="批量选择"
//           schema={{
//             type: 'object',
//             properties: {
//               collection: {
//                 type: 'string',
//                 title: '选择数据表',
//                 'x-decorator': 'FormItem',
//                 'x-component': 'CollectionSelect',
//               },
//               addTo: {
//                 type: 'string',
//                 title: '添加到',
//                 'x-decorator': 'FormItem',
//                 'x-component': 'Select',
//                 enum: addToFields,
//               },
//               groupBy: {
//                 type: 'string',
//                 title: '分组字段',
//                 'x-decorator': 'FormItem',
//                 'x-component': 'AppendsTreeSelect',
//                 'x-component-props': {
//                   multiple: false,
//                   useCollection() {
//                     const { values } = useForm();
//                     return values?.collection;
//                   },
//                 },
//                 'x-reactions': [
//                   {
//                     dependencies: ['.collection'],
//                     fulfill: {
//                       state: {
//                         visible: '{{ !!$deps[0] }}',
//                       },
//                     },
//                   },
//                 ],
//               }
//             },
//           }}
//           initialValues={initialValues}
//           onSubmit={(values) => {
//             field.componentProps = {
//               ...field.componentProps,
//               ...values,
//             };
//             fieldSchema['x-component-props'] = {
//               ...initialValues,
//               ...values,
//             };
//             dn.emit('patch', {
//               schema: {
//                 ['x-uid']: fieldSchema['x-uid'],
//                 'x-component-props': fieldSchema['x-component-props'],
//               },
//             });
//             dn.refresh();
//           }}
//         />

//     </>
//   );
// };
const useDataBlockSelectorActionContext = () => {
  return useContext(DataBlockSelectorActionContext);
};

export const useDataBlockSelectorProps = () => {
  const { setVisible } = useActionContext();
  const { form } = useFormBlockContext();
  const { selectedRows, toField, addTo, groupField, sumFields, fieldMaps } = useDataBlockSelectorActionContext();
  const { type } = useFormBlockType();
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
            const  {id, ...others}= record; 
            otherRows.push({
              ...others,
              [toField.name]: [record],
              [toField.otherKey]:id
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
        
          if(fieldMaps.length>0){
            fieldMaps.map(({field, mapField})=>{
              row[mapField] = row[field];
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
