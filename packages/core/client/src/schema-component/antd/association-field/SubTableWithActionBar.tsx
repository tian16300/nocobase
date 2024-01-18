import { css } from '@emotion/css';
import { RecursionField, observer, useFieldSchema } from '@formily/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubTable } from './SubTable';
import { ViewBlockContext } from '../../../block-provider';
import { Card } from 'antd';
import { useCollectionManager } from '../../../collection-manager';
export const SubTableWithActionBar = observer(
  (props) => {
    const { children = [], ...others } = props;
    const containerRef = useRef();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const fieldSchema = useFieldSchema();
    const { getCollectionField } = useCollectionManager();

    const getPopupContainer = useMemo(() => {
      return () => {
        return containerRef.current;
      };
    }, [containerRef]);

    const flatTreeSchema = (schema, isFullScreen) => {
      schema.reduceProperties((b, s) => {
        const comp = s['x-component'];
        if (['DatePicker', 'Select', 'RemoteSelect'].includes(comp)) {
          s['x-component-props'] = s['x-component-props'];
          s['x-component-props'].getPopupContainer = isFullScreen ? getPopupContainer : null;
        }
        if (['CollectionField'].includes(comp)) {
          const cFieldName = s['x-collection-field'];
          const cField = getCollectionField(cFieldName);
          const isSelect = cField?.uiSchema?.['x-component'] == 'AssociationField';
          const isDate = cField?.type == 'date';
          if (isSelect || isDate) {
            s['x-component-props'] = s['x-component-props'];
            s['x-component-props'].getPopupContainer = isFullScreen ? getPopupContainer : null;
          }
        }
        if (['Action.Drawer', 'Action.Modal', 'Action.Container', 'AssociationField.InternalSelect'].includes(comp)) {
          s['x-component-props'] = s['x-component-props'];
          s['x-component-props'].getContainer = isFullScreen ? getPopupContainer : null;
        }
        flatTreeSchema(s, isFullScreen);
      });
    };
    useEffect(() => {
      flatTreeSchema(fieldSchema, isFullScreen);
    }, [isFullScreen]);
    flatTreeSchema(fieldSchema, isFullScreen);

    return (
      <Card
        ref={containerRef}
        bordered={false}
        {...others}
        className={
          (isFullScreen ? 'view-full-screen ' : 'view-normal ') +
          css`
            .nb-subTable-actionBar {
              margin-bottom: 8px;
            }
            &.view-normal {
              .ant-card-body {
                padding: 0;
              }
            }
          `
        }
      >
        <ViewBlockContext.Provider
          value={{
            containerRef,
            setIsFullScreen,
          }}
        >
          {children}
        </ViewBlockContext.Provider>
      </Card>
    );
  },
  {
    displayName: 'SubTableWithActionBar',
  },
);
