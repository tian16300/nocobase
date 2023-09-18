import React, { FC, useEffect } from 'react';

import { registerField, CollectionManagerProvider, SchemaComponentOptions  } from '@nocobase/client';

import { dic  } from './interface';
import { loadDicItems, loadDics, useGetDicItemById } from './hooks';
export const DicManagerProvider: FC = React.memo((props) => {
  useEffect(() => {
    registerField(dic.group, dic.name as string, dic);
  }, []);
  return (
    <CollectionManagerProvider interfaces={{
      dic
    }} >
      <SchemaComponentOptions 
        scope={{
          loadDics,
          loadDicItems,
          useGetDicItemById
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </CollectionManagerProvider >
  );
});
export default DicManagerProvider;

