import React, { useContext, useEffect, useState } from 'react';
import { SchemaInitializer } from '../../../schema-initializer';
import { CollectionProvider, useCollection, useCollectionManager } from '../../../collection-manager';
import { GeneralSchemaDesigner, SchemaSettings } from '../../../schema-settings';
import { RecursionField, observer, useField, useFieldSchema, useForm } from '@formily/react';
import { useDesignable } from '../../hooks';
import { Action, ActionContextProvider, useActionContext } from '../action';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { linkageAction } from '../action/utils';
import { actionDesignerCss } from '../../../schema-initializer/components';
import { Button } from 'antd';
import { RecordPickerContext, RecordPickerProvider } from '../record-picker';
import { unionBy } from 'lodash';
import {
  WithoutFormFieldResource,
  useFormBlockContext,
  useTableBlockContext,
  useTableBlockContext,
  useTableSelectorContext,
} from '../../../block-provider';

export const DataBlockSelectorAction: any = observer(
  (props: any) => {
    const [visible, setVisible] = useState(false);
    // const collection = useCollection();
    const fieldSchema = useFieldSchema();
    const field: any = useField();
    const linkageRules: any[] = fieldSchema?.['x-linkage-rules'] || [];
    const values = useRecord();
    const ctx = useActionContext();
    const variables = useVariables();
    const localVariables = useLocalVariables({ currentForm: { values } as any });
    const { collection, addTo, ...others } = props;
    const [currentCollection, setCurrentCollection] = useState(collection);

    useEffect(() => {
      field.linkageProperty = {};
      linkageRules
        .filter((k) => !k.disabled)
        .forEach((v) => {
          v.actions?.forEach((h) => {
            linkageAction({
              operator: h.operator,
              field,
              condition: v.condition,
              variables,
              localVariables,
            });
          });
        });
    }, [field, linkageRules, localVariables, variables]);
    const [selectedRows, setSelectedRows] = useState([]);
    const pickerProps = {
      size: 'small',
      multiple: true,
      // association: {
      //   target: fieldSchema,
      // },
      // onChange: props?.onChange,
      selectedRows,
      setSelectedRows,
    };

    return (
      <div className={actionDesignerCss}>
        <ActionContextProvider value={{ ...ctx, visible, setVisible }}>
          <Button
            {...others}
            onClick={() => {
              setVisible(true);
              setCurrentCollection(collection);
            }}
          ></Button>

          <WithoutFormFieldResource.Provider value={false}>
            <RecordPickerProvider {...pickerProps}>
              <CollectionProvider name={currentCollection}>
                <RecursionField
                  schema={fieldSchema}
                  basePath={field.address}
                  onlyRenderProperties
                />
              </CollectionProvider>
            </RecordPickerProvider>
          </WithoutFormFieldResource.Provider>
        </ActionContextProvider>
      </div>
    );
  },
  { displayName: 'DataBlockSelectorAction' },
);
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

export const useDataBlockSelectorProps = () => {
  const { setVisible } = useActionContext();
  const { multiple, onChange } = useContext(RecordPickerContext);
  const fieldName = 'bom_wl';
  const field = useField();
  const { form } = useFormBlockContext();
  const ctx = useTableBlockContext();

  // field.value = field.value || [];
  // field.value.push({});
  // field.onInput(field.value);
  return {
    onClick() {
      if (multiple) {
        // 获取当前的bom_wl字段的值
        const currentBomWl = form.values['bom_wl'] || [];
        const selectedRowKeys = ctx?.field?.data?.selectedRowKeys;
        const selectedRows = ctx?.service?.data?.data?.filter((item) => selectedRowKeys?.includes(item.id)) || [];
        const rows = form.values['value'];
        // 如果选择了多个物料，那么将这些物料添加到bom_wl字段的值中
        const newRows = [];
        rows.map(({ id, ...others }) => {
          const isExist = currentBomWl.find((item) => {
            return item.wl_id === id;
          });
          if (!isExist) {
            newRows.push({
              ...others,
              wl_id: id,
              wl: {
                id,
                ...others,
              },
            });
          }
        });

        // 将选中的物料添加到bom_wl字段的值中
        const newBomWl = [...currentBomWl, ...newRows];
        // 更新bom_wl字段的值
        // form.setFieldValue('bom_wl', newBomWl);

        form.setValues({
          ...form.values,
          bom_wl: newBomWl,
        });
      } else {
        // 如果只选择了一个物料，那么直接设置bom_wl字段的值为这个物料
        // form.setFieldValue('bom_wl', selectedRows?.[0] || null);
      }
      setVisible(false);
    },
    disabled: false,
  };
};
