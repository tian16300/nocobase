import React from 'react';
import { Checkbox, Col, Row } from 'antd';

import {  useCollectionManager, useCompile } from '@nocobase/client';
import { useFlowContext } from '@nocobase/plugin-workflow/client';
export function FieldVisibleConfig({ value, onChange }) {
  const { workflow } = useFlowContext();
  const { getCollectionFields } = useCollectionManager();
  const fields = getCollectionFields(workflow.bussinessCollectionName);
  const compile = useCompile();
  const options = fields.filter((field)=>{return field.uiSchema?.['x-component']}).map((field) => {   
    return {
      label: compile(field.title || field.uiSchema?.title),
      value: field.name,
    };
  });
  
  return (
    <>
      <Checkbox.Group style={{ width: '100%' }} value={value} onChange={onChange}>
        <Row>
           {options.map((option) => {
            return (
              <Col span={6}>
                <Checkbox value={option.value}>{option.label}</Checkbox>
              </Col>
            );
           })}
        </Row>
      </Checkbox.Group>
    </>
  );
}
