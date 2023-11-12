import React from 'react';
import { Initializer } from './GoupTable.Initializer';
import { Provider } from './GroupTable.Decorator';
import { Designer } from './GroupTable.Designer';
import { CardItem } from '../card-item';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { css } from '@emotion/css';
import { useToken } from '..';
import { GroupTree, TableMain } from './components';
import { GroupTableGroupRecordActionBar } from './GroupTable.GroupRecordActionBar';
import { GroupTableGroupRecordActionDesigner } from './GroupTable.GroupRecordActionDesigner';
import { RecursionField, useFieldSchema } from '@formily/react';
export const GroupTable: any = (props) => {
  const { token } = useToken();
  const { useProps } = props;
  const { collection, group, pagination, fields, columnActions, ...others } = useProps?.();
  const fieldSchema = useFieldSchema();
  return (
    <ReflexContainer
      orientation="vertical"
      className={css`
        height: 600px;
        border: 1px solid ${token.colorBorder};
        .pane-container {
          padding: ${token.paddingSM}px;
        }
        &.reflex-container.vertical > .reflex-splitter {
          border-left-color: ${token.colorBorder};
          border-right-color: ${token.colorBorder};
        }
      `}
    >
      <ReflexElement className="left-tree" flex={0.3}>
        <div className="pane-container">
          {/* <GroupTree name={`${collection}.${group}`} /> */}
          <RecursionField name={'tree'} schema={fieldSchema.properties.group} />
        </div>
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement className="right-table">
        <div className="pane-container">
          <TableMain 
            collection={collection}
            resource={collection} 
            action='list'
            fields={fields}
            pagination={pagination}
            columnActions={columnActions}
            // params={{
            //   pageSize: pagination.pageSize || 10,
            //   page: pagination.page || 1
            // }}
            {...others}
          />
        </div>
      </ReflexElement>
    </ReflexContainer>
  );
};
GroupTable.Wrap = CardItem;
GroupTable.Decorator = Provider;
GroupTable.Designer = Designer;
GroupTable.Initializer = Initializer;
GroupTable.GroupRecordActionBar = GroupTableGroupRecordActionBar;
GroupTable.GroupRecordActionDesigner = GroupTableGroupRecordActionDesigner;
GroupTable.GroupTree = GroupTree;