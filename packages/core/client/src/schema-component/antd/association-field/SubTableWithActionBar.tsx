import { css } from '@emotion/css';
import { RecursionField, observer, useFieldSchema } from '@formily/react';
import React from 'react';
export const SubTableWithActionBar = observer(
  ({ children }) => {
    return (
      <div
        className={css`
          .nb-subtable-actionbar {
            position: sticky;
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
