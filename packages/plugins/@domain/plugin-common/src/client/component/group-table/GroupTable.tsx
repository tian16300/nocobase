import React, { useEffect, useRef, useState } from 'react';
import { Initializer } from './GoupTable.Initializer';
import { Provider } from './GroupTable.Decorator';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { css } from '@emotion/css';
import { GroupTableGroupRecordActionBar } from './GroupTable.GroupRecordActionBar';
import { GroupTableGroupRecordActionDesigner } from './GroupTable.GroupRecordActionDesigner';
import { RecursionField, useFieldSchema, useField } from '@formily/react';
import { GroupTreeDesigner } from './GroupTable.GroupTreeDesigner';
import {
  CardItem,
  FixedBlockWrapper,
  TableBlockDesigner,
  useFixedBlock,
  useFixedBlockWrapper,
  useToken,
} from '@nocobase/client';
import { GroupTree } from './components';

export const GroupTable: any = (props) => {
  const { token } = useToken();
  const { useProps } = props;
  const { collection, group, pagination, fields, columnActions, ...others } = useProps?.();
  const fieldSchema = useFieldSchema();
  const hasApproval = true;
  const leftFlex = hasApproval ? 0.15 : 0.3;
  // const { height, fixedBlockUID } = useFixedBlock();
  const boxRef = useRef<HTMLDivElement>();
  const treeRef = useRef<HTMLDivElement>();
  const tableRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState(null);
  const { height: blockHeight } = useFixedBlockWrapper();

  useEffect(() => {
    const height = blockHeight - 2;
    if (height) setHeight(height);
  }, [blockHeight]);

  return (
    <FixedBlockWrapper height={height}>
      <ReflexContainer
        orientation="vertical"
        className={css`
          border: 1px solid ${token.colorBorder};
          height: ${blockHeight}px;
          .pane-container {
            height: 100%;
            > div,
            > div > .nb-fixed-block,
            > div > .nb-fixed-block > .ant-nb-card-item {
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
          &.reflex-container.vertical > .reflex-splitter {
            border-left-color: ${token.colorBorder};
            border-right-color: ${token.colorBorder};
          }
        `}
      >
        <ReflexElement className="left-tree" flex={leftFlex}>
          <div ref={treeRef} className={'pane-container'}>
            {/* <GroupTree name={`${collection}.${group}`} /> */}
            <RecursionField name={'tree'} schema={fieldSchema.properties.group} />
          </div>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className="main">
          <div ref={tableRef} className="pane-container">
            <RecursionField name={'table'} schema={fieldSchema.properties.table} />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </FixedBlockWrapper>
  );
};
GroupTable.Wrap = (props) => {
  const { token } = useToken();
  return (
    <CardItem
      {...props}
      className={css`
        .ant-card-body {
          padding: 0px;
        }
      `}
    >
      <FixedBlockWrapper fixedBlock={true} name="group-table">
        {props.children}
      </FixedBlockWrapper>
    </CardItem>
  );
};
GroupTable.Decorator = Provider;
GroupTable.Designer = TableBlockDesigner;
GroupTable.Initializer = Initializer;
GroupTable.GroupRecordActionBar = GroupTableGroupRecordActionBar;
GroupTable.GroupRecordActionDesigner = GroupTableGroupRecordActionDesigner;
GroupTable.GroupTree = GroupTree;
GroupTable.GroupTreeDesigner = GroupTreeDesigner;

GroupTable.filterGroup = (group, filter) => {};
