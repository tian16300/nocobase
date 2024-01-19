import { css } from '@emotion/css';
import { RecursionField, observer, useField, useFieldSchema } from '@formily/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubTable } from './SubTable';
import { ViewBlockContext } from '../../../block-provider';
import { Card } from 'antd';
import { useCollectionManager } from '../../../collection-manager';
import { SchemaComponent, SchemaComponentProvider } from '../../core';
import { useDesignable, useSchemaComponentContext } from '../..';
export const SubTableWithActionBar = (props) => {
  const { children = [], ...others } = props;
  const containerRef = useRef();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { getCollectionField } = useCollectionManager();

  const getPopupContainer = useMemo(() => {
    return isFullScreen
      ? () => {
          return containerRef.current;
        }
      : null;
  }, [containerRef, isFullScreen]);

  const flatTreeSchema = (schema, isFullScreen, prev) => {
    return schema.reduceProperties((prev, s) => {
      const comp = s['x-component'];
      if (['DatePicker', 'Select', 'RemoteSelect'].includes(comp)) {
        s['x-component-props'] = s['x-component-props'];
        s['x-component-props'].getPopupContainer = getPopupContainer;
        return prev.concat(s);
      } else if (['CollectionField'].includes(comp)) {
        const cFieldName = s['x-collection-field'];
        const cField = getCollectionField(cFieldName);
        const isSelect = cField?.uiSchema?.['x-component'] == 'AssociationField';
        s['x-component-props'] = s['x-component-props']||{};
        const mode = s['x-component-props'].mode;
        const isDate = cField?.type == 'date';
        if(mode == 'Picker'){
          s['x-component-props'].drawerProps =  s['x-component-props'].drawerProps||{};
          s['x-component-props'].drawerProps.getContainer = getPopupContainer;
          return prev.concat(s);
        }else if(mode == 'Select' || isDate){
          s['x-component-props'].getPopupContainer = getPopupContainer;
          return prev.concat(s);
        }
        // const isDate = cField?.type == 'date';
        // if (isSelect || isDate) {
        //   s['x-component-props'] = s['x-component-props'];
        //   s['x-component-props'].getPopupContainer = getPopupContainer;
        // }
        return prev;
      } else if (
        ['Action.Drawer', 'Action.Modal', 'Action.Container', 'AssociationField.InternalSelect'].includes(comp)
      ) {
        s['x-component-props'] = s['x-component-props'];
        s['x-component-props'].getContainer = getPopupContainer;
        return prev.concat(s);
      } else if (s.properties) {
        return prev.concat(flatTreeSchema(s, isFullScreen, []) || []);
      }
      return prev;
    }, prev);
  };
  // const arr = flatTreeSchema(fieldSchema, isFullScreen,[]);
  const { components, scope } = useSchemaComponentContext();
  const { designable } = useDesignable();
  const cardBlockClassName = useMemo(() => {
    return (
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
    );
  }, [isFullScreen]);
  useEffect(() => {
    const arr = flatTreeSchema(fieldSchema, isFullScreen,[]);
    console.log('全屏小屏切换', arr);
  }, [isFullScreen]);

  return (
    <ViewBlockContext.Provider
      value={{
        containerRef,
        setIsFullScreen,
      }}
    >
      <Card ref={containerRef} bordered={false} {...others} className={cardBlockClassName}>
        <SchemaComponent
          basePath={field.address}
          schema={fieldSchema}
          scope={containerRef}
          onlyRenderProperties
        ></SchemaComponent>
      </Card>
    </ViewBlockContext.Provider>
  );
};
