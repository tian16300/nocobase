import { RemoteSelect, Variable } from '@nocobase/client';
import React from 'react';
import { useWorkflowVariableOptions } from '../../variable';

function isUserKeyField(field) {
  if (field.isForeignKey) {
    return field.target === 'users';
  }
  return field.collectionName === 'users' && field.name === 'id';
}

export function AssigneesSelect({ multiple = true, value = [], onChange }) {
  const scope = useWorkflowVariableOptions({ types: [isUserKeyField] });

  return (
    <Variable.Input
      scope={scope}
      value={value}
      onChange={(next) => {
        onChange([next]);
      }}
    >
      <RemoteSelect
        fieldNames={{
          label: 'nickname',
          value: 'id',
        }}
        service={{
          resource: 'users',
        }}
        manual={false}
        mode='multiple'
        value={value}
        onChange={(v) => {
          onChange(v != null ? v : []);
        }}
      />
    </Variable.Input>
  );
}
