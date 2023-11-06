import { useFormLayout } from '@formily/antd-v5';
import { Space as AntdSpace, Divider as AntdDivider, SpaceProps, DividerProps as AntdDividerProps } from 'antd';
import React from 'react';
import { Designer } from './Divider.Designer';
import { observer } from '@formily/react';
import { BlockItem } from '..';
import useStyles from './style';
import { css } from '@emotion/css';

interface DividerProps extends AntdDividerProps {
  children?: React.FC<any>;
}
export const Divider: any = observer((props: DividerProps) => {
  const { orientationMargin = 8 } = props;
  const { wrapSSR, componentCls, hashId } = useStyles();
  return (
    <BlockItem className={css`padding:8px 0px;`}>
      <AntdDivider  {...props} style={{margin:0}}>
        {props.children}
      </AntdDivider>
    </BlockItem>
  );
});
Divider.Designer = Designer;
export default Divider;
