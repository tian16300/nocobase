import React from 'react';
import { Initializer } from './GoupTable.Initializer';
import { Provider } from './GroupTable.Decorator';
import { Designer } from './GroupTable.Designer';
import { CardItem } from '../card-item';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { css } from '@emotion/css';
import { useToken } from '..';
import { GroupTree, Table } from './components';
import { GroupTableGroupRecordActionBar } from './GroupTable.GroupRecordActionBar';
import { GroupTableGroupRecordActionDesigner } from './GroupTable.GroupRecordActionDesigner';
export const GroupTable: any = (props) => {
  const { token } = useToken();
  const { useProps } = props;
  const { collection, group } = useProps?.();

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
          <GroupTree name={`${collection}.${group}`} />
        </div>
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement className="right-table">
        <div className="pane-container">
          <Table />
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