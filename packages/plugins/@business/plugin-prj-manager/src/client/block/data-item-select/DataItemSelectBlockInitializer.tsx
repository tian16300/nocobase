import { TableOutlined } from '@ant-design/icons';
import { DataBlockInitializer, SchemaInitializer, useCollectionManager } from '@nocobase/client';
import React from 'react';
import { createDataItemSelectBlockSchema } from '../../utils';
import { uid } from '@nocobase/utils';
export const DataItemSelectBlockInitializer = (props) => {
  const { insert } = props;
  const { getCollection, getCollectionFields } = useCollectionManager();
  return (
    <DataBlockInitializer
      {...props}
      icon={<TableOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const collection = getCollection(item.name);
        // const collectionFields = getCollectionFields(item.name);
        /* isAssionField 追加 */

        const schema = createDataItemSelectBlockSchema({
          collection
        });
        insert(schema);
      }}
    />
  );
};
