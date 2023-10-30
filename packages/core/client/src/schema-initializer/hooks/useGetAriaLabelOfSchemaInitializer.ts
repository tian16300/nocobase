import { useFieldSchema } from '@formily/react';
import { useCallback } from 'react';
import { useCollection } from '../../collection-manager';

/**
 * label = 'schema-initializer' + x-component + [x-initializer] + [collectionName] + [postfix]
 * @returns
 */

export const useGetAriaLabelOfSchemaInitializer = () => {
  const fieldSchema = useFieldSchema();
  const { name } = useCollection();
  const getAriaLabel = useCallback(
    (postfix?: string) => {
      const initializer = fieldSchema['x-initializer'] ? `-${fieldSchema['x-initializer']}` : '';
      const collectionName = name ? `-${name}` : '';
      postfix = postfix ? `-${postfix}` : '';

      return `schema-initializer-${fieldSchema['x-component']}${initializer}${collectionName}${postfix}`;
    },
    [fieldSchema, name],
  );

  return { getAriaLabel };
};
