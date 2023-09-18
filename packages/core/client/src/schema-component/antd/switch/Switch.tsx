import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import { isValid } from '@formily/shared';
import { Switch as AntdSwitch, Tag } from 'antd';
import type { CheckboxGroupProps, CheckboxProps } from 'antd/es/checkbox';
import uniq from 'lodash/uniq';
import React from 'react';
import { EllipsisWithTooltip } from '../input/EllipsisWithTooltip';

type ComposedCheckbox = React.ForwardRefExoticComponent<
  Pick<Partial<any>, string | number | symbol> & React.RefAttributes<unknown>
> & {
  ReadPretty?: React.FC<CheckboxProps>;
};

const ReadPretty = (props) => {
  if (props.value) {
    return <CheckOutlined style={{ color: '#52c41a' }} />;
  }
  return props.showUnchecked ? <CloseOutlined style={{ color: '#ff4d4f' }} /> : null;
};

export const Switch: ComposedCheckbox = connect(
  (props: any) => {
    const changeHandler = (val) => {
      props?.onChange(val);
    };
    return <AntdSwitch {...props} onChange={changeHandler} />;
  },
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  }),
  mapReadPretty(ReadPretty),
);

Switch.ReadPretty = ReadPretty;


export default Switch;
