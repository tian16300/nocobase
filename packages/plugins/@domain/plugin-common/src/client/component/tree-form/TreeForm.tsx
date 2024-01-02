import { css } from '@emotion/css';
import React, { useEffect, useMemo, useState } from 'react';
import { TreeFormMain } from './TreeFormMain';
import { LeftTree } from './LeftTree';
import { Initializer } from './Initializer';
// import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import {
  CardItem,
  IField,
  RecordProvider,
  TableBlockDesigner,
  TableBlockProvider,
  tableActionInitializers,
  useCollection,
  useDesignable,
  useProps,
  useRecord,
  useTableBlockContext,
  useToken,
} from '@nocobase/client';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import {
  ISchema,
  RecursionField,
  Schema,
  connect,
  mapProps,
  useFieldSchema,
  useField,
  useForm,
  observer,
} from '@formily/react';
import { set } from 'lodash';
import { flattenTree } from '@nocobase/utils';
import { useTreeFormBlockContext, TreeFormBlockProvider } from './Provider';
import { Spin } from 'antd';
export const TreeForm = (props) => {
  const { token } = useToken();
  const fieldSchema = useFieldSchema();
  return (
    <CardItem
      className={css`
        height: 965px;
        &.ant-card:not(.ant-card-bordered) {
          box-shadow: none;
        }
      `}
      bodyStyle={{
        padding: 0,
        height: `100%`,
      }}
    >
      <div
        className={css`
          height: 45px;
        `}
      >
        <RecursionField name={'anctionBar'} schema={fieldSchema.properties.toolBar} />
      </div>
      <div
        className={css`
          height: calc(100% - 45px);
        `}
      >
        <RecursionField name={'content'} schema={fieldSchema.properties.content} />
      </div>
    </CardItem>
  );
};
TreeForm.Initializer = Initializer;
TreeForm.Main = TreeFormMain;
// TreeForm.Tree = LeftTree;
TreeForm.Decorator = TreeFormBlockProvider;
TreeForm.Wrap = (props) => {
  return (
    <CardItem
      {...props}
      className={css`
        .ant-card-body {
          padding: 0;
        }
      `}
    >
      {props.children}
    </CardItem>
  );
};
TreeForm.Designer = () => {
  return <></>;
};

TreeForm.Tree = LeftTree;

TreeForm.Content = (props) => {
  const { left = 0.25 } = props;
  const { token } = useToken();
  const fieldSchema = useFieldSchema();
  const field: IField = useField();
  const { designable, dn } = useDesignable();
  const { view = 'table' } = useTreeFormBlockContext();

  const onStopResize = ({ component }, key) => {
    const flex = component.props.flex;
    field.decoratorProps.left = flex;
    if (designable) {
      const compProps = fieldSchema['x-decorator-props'] || {};

      set(compProps, key, flex);
      const schema: any = {
        ['x-uid']: fieldSchema['x-uid'],
      };
      schema['x-decorator-props'] = compProps;
      dn.emit('patch', {
        schema,
      });
    }
  };
  return (
    <>
      <ReflexContainer
        orientation="vertical"
        className={css`
          border: 1px solid ${token.colorBorder};
          height: 100%;
          .ant-card {
            box-shadow: none;
          }
          .pane-container:not(.multi-rows) {
            height: 100%;
            & > div:not(.multi-rows) {
              height: 100%;
              & > .nb-fixed-block,
              & > .nb-fixed-block > .ant-nb-card-item {
                height: 100%;
              }
              .ant-card {
                box-shadow: none;
                height: 100%;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                .ant-card-body {
                  padding: ${token.padding}px;
                  flex-grow: 1;
                  display: flex;
                  flex-direction: column;
                  overflow: auto;
                  .nb-action-bar + div {
                    flex-grow: 1;
                  }
                }
              }
            }
          }
          &.reflex-container.vertical > .reflex-splitter {
            border-left-color: ${token.colorBorder};
            border-right-color: ${token.colorBorder};
          }
        `}
      >
        <ReflexElement
          className={css`
            .ant-nb-card-item,.ant-card,.ant-card-body {
              height: 100%;
            }
            .ant-card {
              box-shadow: none;
              .ant-card-body {
                padding: 0;
              }
            }
          `}
          flex={left}
          onStopResize={(arg) => {
            onStopResize(arg, 'left');
          }}
        >
          <RecursionField name={'tree'} schema={fieldSchema.properties.tree} />
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className={'main'}>
          {view == 'table' ? (
            <RecursionField name={'table'} schema={fieldSchema.properties.table} />
          ) : view == 'form' ? (
            <RecursionField name={'form'} schema={fieldSchema.properties.form} />
          ) : (
            <Spin></Spin>
          )}
        </ReflexElement>
      </ReflexContainer>
    </>
  );
};
TreeForm.Form = observer(
  (_props) => {
    const field: IField = useField();
    console.log('TreeForm.Form',field?.value);
    const {currentRecord = {} } = useTreeFormBlockContext();
    const props = useProps(_props);
    const __parent = useRecord();
    const { name } = useCollection();    
    const record = new Proxy(
      {
        ...(currentRecord||{}),
        __collectionName: name,
        __parent,
      },
      {},
    );
     return (
      <div
        className={css`
          overflow-x: hidden;
        `}
      >
        <RecordProvider record={record}> {props.children} </RecordProvider>
      </div>
    );
  },
  {
    displayName: 'TreeForm.Form',
  },
);
TreeForm.Filter = (props) => {
  return <>{props.children}</>;
};

export {TreeFormBlockProvider};
export const TreeFormBlockDesigner = TableBlockDesigner;
