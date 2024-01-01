import { css } from '@emotion/css';
import React from 'react';
import { TreeFormMain } from './TreeFormMain';
import { LeftTree } from './LeftTree';
import { Initializer } from './Initializer';
// import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import {
  CardItem,
  TableBlockDesigner,
  TableBlockProvider,
  tableActionInitializers,
  useDesignable,
  useToken,
} from '@nocobase/client';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { ISchema, RecursionField, Schema, connect, mapProps, useFieldSchema, useField } from '@formily/react';
import { set } from 'lodash';
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
TreeForm.Decorator = TableBlockProvider;
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
  const field = useField();

  const { designable, dn } = useDesignable();

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
          className="left-tree"
          flex={left}
          onStopResize={(arg) => {
            onStopResize(arg, 'left');
          }}
        >
          <RecursionField name={'tree'} schema={fieldSchema.properties.tree} />
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className={'main'}>
          {/* <div
                ref={boxRef}
                className={
                  'pane-container multi-rows ' +
                  css`
                    padding: 10px;
                    .form-container {
                      // overflow-x: hidden;
                      .ant-formily-layout {
                        width: 100%;
                        overflow-x: hidden;
                      }
                    }
                    .ant-card {
                      box-shadow: none;
                      margin-bottom: 0;
                    }
                  `
                }
              >
                <div
                  className={css`
                    margin-bottom: 8px;
                  `}
                >
                  <RecursionField name={'actions'} schema={fieldSchema.properties.actions} />
                </div>
                <div className="form-container">
                  {loadingFormBlock ? (
                    <>
                      <RecordProvider record={record} isMemo={true}>
                        {['create', 'createAndAddChild'].includes(userAction) && (
                          <RecursionField name={'create-form'} schema={fieldSchema.properties.form.properties.add} />
                        )}
                        {userAction == 'update' && <RecursionField name={'update-form'} schema={updateFormSchema} />}
                      </RecordProvider>
                    </>
                  ) : (
                    <Spin />
                  )}
                </div>
              </div> */}
               <RecursionField name={'table'} schema={fieldSchema.properties.table} />
               <RecursionField name={'form'} schema={fieldSchema.properties.form} />
              {/* <RecursionField name={'tree'} schema={fieldSchema.properties.tree} /> */}
          {props.children[1]}
        </ReflexElement>
      </ReflexContainer>
    </>
  );
};

TreeForm.tbale = ({ children }) => {
  return <>{children}</>;
};
TreeForm.Form = ({ children }) => {
  return <>{children}</>;
};
TreeForm.Filter = (props) => {
  return <>{props.children}</>;
};

export const TreeFormBlockProvider = TableBlockProvider;
export const TreeFormBlockDesigner = TableBlockDesigner;
