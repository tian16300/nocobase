import { css } from '@emotion/css';
import { RecursionField, observer, useFieldSchema } from '@formily/react';
import React from 'react';
import { SubTable } from './SubTable';
export const SubTableWithActionBar = observer(
  (props) => {
    const { children = [], ...others } = props;
    return (
      <div
        className={css`
          .nb-subtable-actionBar {
            margin-bottom: 8px;
          }
        `}
      >
        {children}
      </div>
    );
  },
  {
    displayName: 'SubTableWithActionBar',
  },
);
