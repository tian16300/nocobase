import { SchemaInitializerContext, useCollection } from '@nocobase/client';
import { useContext } from 'react';

export const ImportInitializerProvider = (props: any) => {
  const initializes = useContext<any>(SchemaInitializerContext);
  const item = {
    type: 'item',
    title: "{{t('Import')}}",
    component: 'ImportActionInitializer',
    schema: {
      'x-align': 'right',
      'x-decorator': 'ACLActionProvider',
      'x-acl-action': 'importXlsx',
      'x-acl-action-props': {
        skipScopeCheck: true,
      },
    },
    visible: function useVisible() {
      const collection = useCollection();
      return (
        (collection.template !== 'view' || collection?.writableView) &&
        collection.template !== 'file' &&
        collection.template !== 'sql'
      );
    },
  }
  const actionInitializeKeys = [
  'TableActionInitializers',
  // 'GroupTableActionInitializers',
  // 'GroupTableGroupActionInitializers',
  // 'GanttActionInitializers'
  ];
   for (const key of actionInitializeKeys) {
    const hasImportAction = initializes[key].items[0].children.some(
      (initialize) => initialize.component === 'ImportActionInitializer',
    );
    if (!hasImportAction) {
      initializes[key].items[0].children.push(item);
    }
  }
  return props.children;
};
