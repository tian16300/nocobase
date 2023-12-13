import React from 'react';
import { RemoteSelect, Variable } from '@nocobase/client';
import { useWorkflowVariableOptions } from '@nocobase/plugin-workflow/client';

function isRoleKeyField(field) {
  if (field.isForeignKey) {
    return field.target === 'roles';
  }
  return field.collectionName === 'roles' && field.name === 'name';
}

export function AssigneeRoles({ multiple = false, value = [], onChange }) {
  const scope = useWorkflowVariableOptions({ types: [isRoleKeyField] });

  return (
    <Variable.Input
      scope={scope}
      value={value[0]}
      onChange={(next) => {
        onChange([next]);
      }}
    >
      <RemoteSelect
        fieldNames={{
          label: 'title',
          value: 'name',
        }}
        service={{
          resource: 'roles',
        }}
        manual={false}
        value={value[0]}
        onChange={(v) => {
          onChange(v != null ? [v] : []);
        }}
      />
    </Variable.Input>
  );
}
