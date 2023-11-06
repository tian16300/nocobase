import { connect, mapReadPretty } from '@formily/react';
import { isNum } from '@formily/shared';
import { Col, InputNumber, Row, Slider } from 'antd';
import * as math from 'mathjs';
import React, { useMemo } from 'react';
import { ReadPretty } from './ReadPretty';

const isNumberLike = (index: any): index is number => isNum(index) || /^-?\d+(\.\d+)?$/.test(index);

const toValue = (value: any, callback: (v: number) => number) => {
  if (isNumberLike(value)) {
    return math.round(callback(value), 9);
  }
  return null;
};

export const Percent = connect(
  (props) => {
    const { value, onChange } = props;
    const v = useMemo(() => toValue(value, (v) => v * 100), [value]);
    return (
      <Row>
      <Col flex="auto">
        <Slider
          {...props}
          onChange={(v: any) => {
            if (onChange) {
              onChange(toValue(v, (v) => v / 100));
            }
          }}
          value={v}
        />
      </Col>
      <Col flex="100px">
        <InputNumber
          {...props}
          addonAfter="%"
          // size="small" 
          style={{marginLeft: 18, marginRight:-12}}
          value={v}
          onChange={(v: any) => {
            if (onChange) {
              onChange(toValue(v, (v) => v / 100));
            }
          }}
        />
      </Col>
    </Row>
    );
  },
  mapReadPretty((props) => {
    const value = useMemo(() => toValue(props.value, (v) => v * 100), [props.value]);
    return <ReadPretty {...props} value={value} />;
  }),
);
