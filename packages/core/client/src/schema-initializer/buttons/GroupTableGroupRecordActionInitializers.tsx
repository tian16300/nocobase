import { MenuOutlined } from '@ant-design/icons';
import { ISchema, useFieldSchema } from '@formily/react';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
// import { SchemaInitializer, SchemaSettings } from '../..';
import { useAPIClient } from '../../api-client';
import { useCollection } from '../../collection-manager';
import { createDesignable, useDesignable } from '../../schema-component';
import { useGetAriaLabelOfDesigner } from '../../schema-settings/hooks/useGetAriaLabelOfDesigner';
import { SchemaInitializer } from '../../application/schema-initializer/SchemaInitializer';

// export const GroupTableGroupRecordActionInitializers = (props: any) => {
//   const fieldSchema = useFieldSchema();
//   const api = useAPIClient();
//   const { refresh } = useDesignable();
//   const { t } = useTranslation();
//   const collection = useCollection();
//   const { treeTable } = fieldSchema?.parent?.parent['x-decorator-props'] || {};
//   const { getAriaLabel } = useGetAriaLabelOfDesigner();
//   return (
//     <SchemaInitializerButton
//       insertPosition={'beforeEnd'}
//       insert={(schema) => {
//         const spaceSchema = fieldSchema.reduceProperties((buf, schema) => {
//           if (schema['x-component'] === 'Space') {
//             return schema;
//           }
//           return buf;
//         }, null);
//         if (!spaceSchema) {
//           return;
//         }
//         _.set(schema, 'x-designer-props.linkageAction', true);
//         const dn = createDesignable({
//           t,
//           api,
//           refresh,
//           current: spaceSchema,
//         });
//         dn.loadAPIClientEvents();
//         dn.insertBeforeEnd(schema);
//       }}
//       items={[
//         {
//           type: 'itemGroup',
//           title: t('Enable actions'),
//           children: [
//             {
//               type: 'item',
//               title: t('View'),
//               component: 'ViewActionInitializer',
//               schema: {
//                 'x-component': 'Action.Link',
//                 'x-action': 'view',
//                 'x-decorator': 'ACLActionProvider',
//               },
//             },
//             {
//               type: 'item',
//               title: t('Edit'),
//               component: 'UpdateActionInitializer',
//               schema: {
//                 'x-component': 'Action.Link',
//                 'x-action': 'update',
//                 'x-decorator': 'ACLActionProvider',
//               },
//               visible: () => {
//                 return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
//               },
//             },

//             {
//               type: 'item',
//               title: t('Delete'),
//               component: 'DestroyActionInitializer',
//               schema: {
//                 'x-component': 'Action.Link',
//                 'x-action': 'destroy',
//                 'x-decorator': 'ACLActionProvider',
//               },
//               visible: () => {
//                 return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
//               },
//             },
//             collection.tree &&
//               treeTable !== false && {
//                 type: 'item',
//                 title: t('Add child'),
//                 component: 'CreateChildInitializer',
//                 schema: {
//                   'x-component': 'Action.Link',
//                   'x-action': 'create',
//                   'x-decorator': 'ACLActionProvider',
//                 },
//               },
//             {
//               type: 'item',
//               title: t('Duplicate'),
//               component: 'DuplicateActionInitializer',
//               schema: {
//                 'x-component': 'Action.Link',
//                 'x-action': 'duplicate',
//                 'x-decorator': 'ACLActionProvider',
//               },
//               visible: () => {
//                 return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
//               },
//             },
//           ],
//         },
//         {
//           type: 'divider',
//         },
//         {
//           type: 'subMenu',
//           title: '{{t("Customize")}}',
//           children: [
//             {
//               type: 'item',
//               title: '{{t("Popup")}}',
//               component: 'CustomizeActionInitializer',
//               schema: {
//                 type: 'void',
//                 title: '{{ t("Popup") }}',
//                 'x-action': 'customize:popup',
//                 'x-designer': 'Action.Designer',
//                 'x-component': 'Action.Link',
//                 'x-component-props': {
//                   openMode: 'drawer',
//                 },
//                 properties: {
//                   drawer: {
//                     type: 'void',
//                     title: '{{ t("Popup") }}',
//                     'x-component': 'Action.Container',
//                     'x-component-props': {
//                       className: 'nb-action-popup',
//                     },
//                     properties: {
//                       tabs: {
//                         type: 'void',
//                         'x-component': 'Tabs',
//                         'x-component-props': {},
//                         'x-initializer': 'TabPaneInitializers',
//                         properties: {
//                           tab1: {
//                             type: 'void',
//                             title: '{{t("Details")}}',
//                             'x-component': 'Tabs.TabPane',
//                             'x-designer': 'Tabs.Designer',
//                             'x-component-props': {},
//                             properties: {
//                               grid: {
//                                 type: 'void',
//                                 'x-component': 'Grid',
//                                 'x-initializer': 'RecordBlockInitializers',
//                                 properties: {},
//                               },
//                             },
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//             {
//               type: 'item',
//               title: '{{t("Update record")}}',
//               component: 'CustomizeActionInitializer',
//               schema: {
//                 title: '{{t("Update record")}}',
//                 'x-component': 'Action.Link',
//                 'x-action': 'customize:update',
//                 'x-decorator': 'ACLActionProvider',
//                 'x-acl-action': 'update',
//                 'x-designer': 'Action.Designer',
//                 'x-action-settings': {
//                   assignedValues: {},
//                   onSuccess: {
//                     manualClose: true,
//                     redirecting: false,
//                     successMessage: '{{t("Updated successfully")}}',
//                   },
//                 },
//                 'x-component-props': {
//                   useProps: '{{ useCustomizeUpdateActionProps }}',
//                 },
//               },
//               visible: () => {
//                 return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
//               },
//             },
//             {
//               type: 'item',
//               title: '{{t("Custom request")}}',
//               component: 'CustomRequestInitializer',
//               schema: {
//                 'x-action': 'customize:table:request',
//               },
//               visible: () => {
//                 return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
//               },
//             },
//           ],
//         }
//       ]}
//       component={
//         <MenuOutlined role="button" aria-label={getAriaLabel('schema-settings')} style={{ cursor: 'pointer' }} />
//       }
//     />
//   );
// };

export const GroupTableGroupRecordActionInitializers = new SchemaInitializer({
  name: 'GroupTableGroupRecordActionInitializers',
  title: "{{t('Configure actions')}}",
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      type: 'itemGroup',
      name: 'enableActions',
      title: "{{t('Enable actions')}}",
      children: [
        {
          type: 'item',
          name: 'filter',
          title: "{{t('Filter')}}",
          Component: 'FilterActionInitializer',
          schema: {
            'x-align': 'left',
          },
        },
        {
          type: 'item',
          title: "{{t('Add new')}}",
          name: 'addNew',
          Component: 'CreateActionInitializer',
          schema: {
            'x-align': 'right',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action-props': {
              skipScopeCheck: true,
            },
          },
          useVisible() {
            const collection = useCollection();
            return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
          },
        },
        {
          type: 'item',
          title: "{{t('Delete')}}",
          name: 'delete',
          Component: 'BulkDestroyActionInitializer',
          schema: {
            'x-align': 'right',
            'x-decorator': 'ACLActionProvider',
          },
          useVisible() {
            const collection = useCollection();
            return !['view', 'sql'].includes(collection.template) || collection?.writableView;
          },
        },
        {
          type: 'item',
          title: "{{t('Refresh')}}",
          name: 'refresh',
          Component: 'RefreshActionInitializer',
          schema: {
            'x-align': 'right',
          },
        },
        {
          name: 'toggle',
          title: "{{t('Expand/Collapse')}}",
          Component: 'ExpandActionInitializer',
          schema: {
            'x-align': 'right',
          },
          useVisible() {
            const schema = useFieldSchema();
            const collection = useCollection();
            const { treeTable } = schema?.parent?.['x-decorator-props'] || {};
            const { group } = schema?.parent?.parent?.['x-decorator-props'] || {};
            return (collection.tree && treeTable !== false) || (group && group != '');
          },
        },
      ],
    },
    {
      name: 'divider',
      type: 'divider',
      useVisible() {
        const collection = useCollection();
        return !['view', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
    {
      type: 'subMenu',
      name: 'customize',
      title: '{{t("Customize")}}',
      children: [
        {
          type: 'item',
          title: '{{t("Add record")}}',
          name: 'addRecord',
          Component: 'CustomizeAddRecordActionInitializer',
          schema: {
            'x-align': 'right',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'create',
            'x-acl-action-props': {
              skipScopeCheck: true,
            },
          },
        },
        {
          type: 'item',
          title: '{{t("按钮操作")}}',
          Component: 'CustomizeActionInitializer',
          schema: {
            title: '{{ t("按钮操作") }}',
            'x-component': 'Action',
            'x-designer': 'Action.Designer',
            'x-component-props': {
              useProps: '{{ useCreateActionProps }}',
            },
          },
        },
      ],
      useVisible() {
        const collection = useCollection();
        return !['view', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
  ] as any
})