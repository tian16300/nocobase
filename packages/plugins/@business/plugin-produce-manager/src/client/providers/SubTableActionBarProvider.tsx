import {
  BlockProvider,
  CollectionFieldProvider,
  CollectionProvider,
  RecordProvider,
  css,
  useCollectionManager,
  useCompile,
  useRecord,
} from '@nocobase/client';
import React, { useMemo } from 'react';
import { Flex } from 'antd';
export const SubTableActionBarProvider = ({ collectionField, children }) => {
  const { getCollectionField } = useCollectionManager();
  const field = getCollectionField(collectionField);
  const compile = useCompile();
  const record = useRecord();
  const params = useMemo(() => {
    return {
      filter: {
        $and: [
          {
            [field.foreignKey]: record?.id,
          },
        ],
      },
    };
  }, [field.foreignKey, record]);
  return (
    <BlockProvider
      name="table-field"
      block={'SubTableActionField'}
      resource={field.target}
      collection={field.target}
      association={collectionField}
      params={params}
    >
      <CollectionFieldProvider name={field.name} field={field}>
        <Flex gap="middle" justify="space-between">
          <div>
            <strong>{compile(field.uiSchema.title)}</strong>
          </div>
          <div>{children}</div>
        </Flex>
      </CollectionFieldProvider>
    </BlockProvider>
  );
};
