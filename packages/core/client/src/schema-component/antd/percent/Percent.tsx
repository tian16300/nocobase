import { connect, mapReadPretty } from '@formily/react';
import { Col, InputNumber, Row, Slider } from 'antd';
import * as math from 'mathjs';
import React from 'react';
import { ReadPretty } from './ReadPretty';

export const Percent = connect(
  (props) => {
    const { value, onChange } = props;

    const handleChange = (v: any) => {
      if (onChange) {
        onChange(v ? math.round(v / 100, 9) : null);
      }
    }
    const val = value ? math.round(value * 100, 9) : null;

    return (
      <Row>
      <Col flex="auto">
        <Slider
          {...props}
          onChange={handleChange}
          value={val}
        />
      </Col>
      <Col flex="100px">
        <InputNumber
          {...props}
          addonAfter="%"
          // size="small" 
          style={{marginLeft: 18, marginRight:-12}}
          value={val}
          onChange={handleChange}
        />
      </Col>
    </Row>
    );
  },
  mapReadPretty((props) => {
    return <ReadPretty {...props} value={props.value ? math.round(props.value * 100, 9) : null} />;
  }),
);
