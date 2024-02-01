import { useCollectionManager, useFormBlockContext } from '@nocobase/client';
import { useFieldSchema } from '@formily/react';
import { spliceArrayState } from '@formily/core/esm/shared/internals';
import { message } from 'antd';
import { getParentFieldSchema } from '../hooks/useSpecialCase';
export const useEmptyCollectionFieldAction = (props: any) => {
  /* 获取字段类型 */
  const fieldSchema = useFieldSchema();
  const schema = getParentFieldSchema(fieldSchema);
  const collectionField = schema?.['x-collection-field'];
  const { getCollectionField } = useCollectionManager();
  const fieldName = getCollectionField(collectionField)?.name;
  const { form } = useFormBlockContext();
  return {
    async run() {
      const field = form.query(fieldName).take();
      if (!field.value || field.value?.length == 0) return;
      const len = field.value?.length;
      spliceArrayState(field as any, {
        startIndex: 0,
        deleteCount: field.value?.length,
      });
      field.value.splice(0, len);
      field.initialValue?.splice(0, len);
      field.onInput(field.value);
      message.success('清空成功');
    },
  };
};
