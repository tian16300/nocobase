
import { Alert, Tree as AntdTree, ModalProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ISchema, connect, mapProps, useField, useFieldSchema, useForm, useFormEffects } from '@formily/react';
export const Tree = connect(
    AntdTree,
    mapProps((props, field: any) => {
      useEffect(() => {
        field.value = props.defaultSelectedKeys || [];
      }, []);
      const [selectedKeys, setSelectedKeys] = useState(props.defaultSelectedKeys || []);
      const onSelect = (selectedKeys) => {
        setSelectedKeys(selectedKeys);
        field.value = selectedKeys;
      };
      field.onSelect = onSelect;
      return {
        ...props,
        selectedKeys,
        onSelect,
      };
    }),
  );