import React from 'react';
import { RemoteSelect, Variable } from '@nocobase/client';
import { useWorkflowVariableOptions } from '@nocobase/plugin-workflow/client';

function isUserKeyField(field) {
  if (field.isForeignKey) {
    return field.target === 'users';
  }
  return field.collectionName === 'users' && field.name === 'id';
}

export function AssigneesSelect({ multiple = false, value = [], onChange }) {
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
        
        multiple={true}
        fieldNames={{
          label: 'nickname',
          value: 'id',
        }}
        service={{
          resource: 'users',
        }}
        manual={true}
       
        value={value}
        onChange={(v) => {
          onChange(v != null ? v : []);
        }}
      />
    </Variable.Input>
  );
}
