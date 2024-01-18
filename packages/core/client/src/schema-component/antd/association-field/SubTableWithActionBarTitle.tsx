import React from 'react';
import { RecursionField, observer, useFieldSchema } from '@formily/react';
import { css } from '@emotion/css';
import { getParentFieldSchema } from '../form-item/hooks/useSpecialCase';
import { useCollectionManager } from '../../../collection-manager';
export const SubTableWithActionBarTitle = observer(
  () => {
    const fieldSchema = useFieldSchema();
    const schema = getParentFieldSchema(fieldSchema);
    const collectionField = schema?.['x-collection-field'];
    const { getCollectionField } = useCollectionManager();
    const field = getCollectionField(collectionField);

    return (
      <label
        className={css`
          font-weight: 600;
        `}
      >
        {field.uiSchema?.title || field.title}
      </label>
    );
  },
  { displayName: 'SubTableWithActionBarTitle' },
);
