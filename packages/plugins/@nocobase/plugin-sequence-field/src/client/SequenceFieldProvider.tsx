import React, { FC, useContext } from 'react';

import { registerField, CollectionManagerContext, SchemaComponentOptions } from '@nocobase/client';

import { RuleConfigForm, sequence } from './sequence';
import { TreeRuleConfigForm, treeSequence } from './treeSequence';

registerField(sequence.group, 'sequence', sequence);
registerField(treeSequence.group, 'treeSequence', treeSequence);
export const SequenceFieldProvider: FC = (props) => {
  const ctx = useContext(CollectionManagerContext);

  return (
    <SchemaComponentOptions
      components={{
        RuleConfigForm,
        TreeRuleConfigForm
      }}
    >
      <CollectionManagerContext.Provider value={{ ...ctx, interfaces: { ...ctx.interfaces, sequence, treeSequence } }}>
        {props.children}
      </CollectionManagerContext.Provider>
    </SchemaComponentOptions>
  );
};
