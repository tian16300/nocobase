import { css } from '@emotion/css';
import React, { useEffect, useMemo, useState } from 'react';
import { TreeFormMain } from './TreeFormMain';
import { LeftTree } from './LeftTree';
import { Initializer } from './Initializer';
// import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import {
  ActionContext,
  BlockProvider,
  BlockResourceContext,
  CardItem,
  CollectionProvider,
  FormBlockProvider,
  IField,
  RecordProvider,
  SchemaComponent,
  TableBlockDesigner,
  TableBlockProvider,
  WithoutFormFieldResource,
  WithoutTableFieldResource,
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
import { flattenTree, uid } from '@nocobase/utils';
import {
  useBomTreeFormBlockContext,
  BomTreeFormBlockProvider,
  BomFormBlockProvider,
  BomTreeFormTableBlockProvider,
} from './Provider';
import { Spin } from 'antd';
import { TreeFormBlockDesigner } from './TreeFormBlockDesigner';
export const BomTreeForm = (props) => {
  const { token } = useToken();
  const fieldSchema = useFieldSchema();
  const field: IField = useField();
  return (
    <CardItem
      className={css`
        height: 768px;
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
        <RecursionField name={'content'} schema={fieldSchema.properties.content} basePath={field.address} />
      </div>
    </CardItem>
  );
};
BomTreeForm.Initializer = Initializer;
BomTreeForm.Main = TreeFormMain;
// TreeForm.Tree = LeftTree;
BomTreeForm.Decorator = BomTreeFormBlockProvider;
BomTreeForm.Wrap = (props) => {
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
BomTreeForm.Designer = () => {
  return <></>;
};

BomTreeForm.Tree = LeftTree;

BomTreeForm.Content = observer(
  (props: any) => {
    const { left = 0.25 } = props;
    const { token } = useToken();
    const fieldSchema = useFieldSchema();
    const field: IField = useField();
    const { designable, dn } = useDesignable();
    const { currentRecord, viewType, loading, formRecord, actionFieldSchema, userCanceled } =
      useBomTreeFormBlockContext();

    // const actionFieldSchema = useMemo(() => {
    //   return {
    //     type: 'void',
    //     'x-action': viewType.action,
    //     'x-component-props': {
    //       addChild: true,
    //     },
    //   };
    // }, [viewType.action]);

    // const [actionFieldSchema, setActionFieldScheam] = useState({
    //   type:'void',
    //   'x-action': 'create',
    // });

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
              .ant-nb-card-item,
              .ant-card,
              .ant-card-body {
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
            {/* <TableBlockProvider
            collection="bom"
            resource="prj.bom"
            association="prj.bom"
            action="list"
            params={{
              // pageSize,
              tree: true,
              paginate: false,
            }}
          > */}
            {/* <SchemaComponent
            schema={{
              name: uid(),
              type: 'void',
              'x-decorator': 'TableBlockProvider',
              'x-decorator-props': {
                collection: 'bom',
                resource: 'prj.bom',
                association: 'prj.bom',
                action: 'list',
                params: {
                  tree: true,
                  paginate: false,
                },
              },
              'x-component': 'CardItem',
              properties: {
                tree: fieldSchema.properties.tree,
              },
            }}
          ></SchemaComponent> */}
            {/* <RecursionField name={'tree'} schema={fieldSchema.properties.tree} /> */}
            {/* </TableBlockProvider> */}
            <RecursionField name={'tree'} schema={fieldSchema.properties.tree} />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement
            className={css`
              .nb-block-item.ant-nb-card-item > .ant-card > .ant-card-body {
                padding: ${token.padding}px;
              }
            `}
          >
            <ActionContext.Provider value={{ fieldSchema: actionFieldSchema as any }}>
              <div
                className={css`
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                `}
              >
                <RecordProvider record={currentRecord}>
                  {loading ? (
                    <>
                      <div
                        className={css`
                          padding-top: 40px;
                          text-align: center;
                        `}
                      >
                        <Spin></Spin>
                      </div>
                    </>
                  ) : (
                    <>
                      {['table', 'countTable'].includes(viewType.view) ? (
                        <>
                          <RecursionField
                            name={viewType.view}
                            schema={fieldSchema.properties.tableBlock}
                            basePath={field.address}
                          />
                        </>
                      ) : (
                        <RecordProvider record={formRecord} isMemo={true}>
                          {!userCanceled ? (
                            <RecursionField
                              name={'form'}
                              schema={fieldSchema.properties.form}
                              basePath={field.address}
                            />
                          ) : (
                            <SchemaComponent
                              schema={fieldSchema.properties.form}
                              basePath={field.address}
                            ></SchemaComponent>
                          )}
                        </RecordProvider>
                      )}

                   
                    </>
                  )}
                </RecordProvider>
              </div>
            </ActionContext.Provider>
          </ReflexElement>
        </ReflexContainer>
      </>
    );
  },
  { displayName: 'BomTreeForm.Content' },
);

BomTreeForm.Form = (_props) => {
  const props = useProps(_props);
  return (
    <div
      className={css`
        overflow-x: hidden;
      `}
    >
      {props.children}
    </div>
  );
};
BomTreeForm.Filter = (props) => {
  return <>{props.children}</>;
};

// export { TreeFormBlockProvider };
BomTreeForm.Provider = BomTreeFormBlockProvider;
BomTreeForm.Designer = TableBlockDesigner;
// export const BomTreeForm = TableBlockDesigner;

export { BomFormBlockProvider, BomTreeFormTableBlockProvider };
