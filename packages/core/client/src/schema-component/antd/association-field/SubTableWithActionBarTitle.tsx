import React from 'react';
import { RecursionField, observer, useFieldSchema } from '@formily/react';
export const SubTableWithActionBarTitle = observer(
  () => {
    return <label className="ant-formily-item-label">标题</label>;
  },
  { displayName: 'SubTableWithActionBarTitle' },
);
