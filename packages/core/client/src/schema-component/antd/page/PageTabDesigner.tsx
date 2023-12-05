import { DragOutlined, MenuOutlined } from '@ant-design/icons';
import { useFieldSchema } from '@formily/react';
import { Space } from 'antd';
import React from 'react';
import { DragHandler, useDesignable } from '../..';
import { useGetAriaLabelOfDesigner } from '../../../schema-settings/hooks/useGetAriaLabelOfDesigner';
import { SchemaSettings, SchemaToolbarProvider, useSchemaSettingsRender } from '../../../application';
import { SchemaSettingsSwitchItem } from '../../../schema-settings';

export const PageDesigner = ({ title }) => {
  const { designable } = useDesignable();
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaSettingsRender(
    fieldSchema['x-settings'] || 'PageSettings',
    fieldSchema['x-settings-props'],
  );
  let hidePageNavIcon = fieldSchema['x-component-props']?.hidePageNavIcon;
  if (typeof hidePageNavIcon == 'undefined') {
    hidePageNavIcon = true;
  }
  if (!designable) {
    return null;
  }
  return (
    <SchemaToolbarProvider title={title}>
      <div className={'general-schema-designer'}>
        <div className={'general-schema-designer-icons'}>
          <Space size={2} align={'center'}>
            {render()}
          </Space>
        </div>
      </div>
    </SchemaToolbarProvider>
  );

  // return (
  //   <>
  //   <div className={'general-schema-designer'}>
  //     <div className={'general-schema-designer-icons'}>
  //       <Space size={2} align={'center'}>
  //         <SchemaSettings
  //           title={
  //             <MenuOutlined
  //               role="button"
  //               aria-label={getAriaLabel('schema-settings')}
  //               style={{ cursor: 'pointer', fontSize: 12 }}
  //             />
  //           }
  //         >
  //           <SchemaSettingsSwitchItem
  //             title={t('Enable page header')}
  //             checked={!fieldSchema['x-component-props']?.disablePageHeader}
  //             onChange={(v) => {
  //               fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
  //               fieldSchema['x-component-props']['disablePageHeader'] = !v;
  //               dn.emit('patch', {
  //                 schema: {
  //                   ['x-uid']: fieldSchema['x-uid'],
  //                   ['x-component-props']: fieldSchema['x-component-props'],
  //                 },
  //               });
  //               dn.refresh();
  //             }}
  //           />
  //           {!disablePageHeader && <SchemaSettingsDivider />}
  //           {!disablePageHeader && (
  //             <SchemaSettingsSwitchItem
  //               title={t('显示返回图标')}
  //               checked={!hidePageNavIcon}
  //               onChange={(v) => {
  //                 fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
  //                 fieldSchema['x-component-props']['hidePageNavIcon'] = !v;
  //                 dn.emit('patch', {
  //                   schema: {
  //                     ['x-uid']: fieldSchema['x-uid'],
  //                     ['x-component-props']: fieldSchema['x-component-props'],
  //                   },
  //                 });
  //                 dn.refresh();
  //               }}
  //             />
  //           )}
  //           {!disablePageHeader && (
  //             <SchemaSettingsSwitchItem
  //               title={t('Display page title')}
  //               checked={!fieldSchema['x-component-props']?.hidePageTitle}
  //               onChange={(v) => {
  //                 fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
  //                 fieldSchema['x-component-props']['hidePageTitle'] = !v;
  //                 dn.emit('patch', {
  //                   schema: {
  //                     ['x-uid']: fieldSchema['x-uid'],
  //                     ['x-component-props']: fieldSchema['x-component-props'],
  //                   },
  //                 });
  //                 dn.refresh();
  //               }}
  //             />
  //           )}
  //           {!disablePageHeader && !hidePageTitle && (
  //             <SchemaSettingsModalItem
  //               hide
  //               title={t('Edit page title')}
  //               schema={
  //                 {
  //                   type: 'object',
  //                   title: t('Edit page title'),
  //                   properties: {
  //                     title: {
  //                       title: t('Title'),
  //                       required: true,
  //                       'x-decorator': 'FormItem',
  //                       'x-component': 'Input',
  //                       'x-component-props': {},
  //                     },
  //                   },
  //                 } as ISchema
  //               }
  //               initialValues={{ title }}
  //               onSubmit={({ title }) => {
  //                 field.title = title;
  //                 fieldSchema['title'] = title;
  //                 dn.emit('patch', {
  //                   schema: {
  //                     ['x-uid']: fieldSchema['x-uid'],
  //                     title,
  //                   },
  //                 });
  //               }}
  //             />
  //           )}
  //           {!disablePageHeader && (
  //             <SchemaSettingsSwitchItem
  //               title={t('Enable page tabs')}
  //               checked={fieldSchema['x-component-props']?.enablePageTabs}
  //               onChange={(v) => {
  //                 fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
  //                 fieldSchema['x-component-props']['enablePageTabs'] = v;
  //                 dn.emit('patch', {
  //                   schema: {
  //                     ['x-uid']: fieldSchema['x-uid'],
  //                     ['x-component-props']: fieldSchema['x-component-props'],
  //                   },
  //                 });
  //                 dn.refresh();
  //               }}
  //             />
  //           )}
  //         </SchemaSettings>
  //       </Space>
  //     </div>
  //   </div>
  //   <SchemaToolbarProvider title={title}>
  //     <div className={'general-schema-designer'}>
  //       <div className={'general-schema-designer-icons'}>
  //         <Space size={2} align={'center'}>
  //           {render()}
  //         </Space>
  //       </div>
  //     </div>
  //   </SchemaToolbarProvider>
  //   </>
  // );
};

export const PageTabDesigner = ({ schema }) => {
  const { designable } = useDesignable();
  const { getAriaLabel } = useGetAriaLabelOfDesigner();
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaSettingsRender(
    fieldSchema['x-settings'] || 'PageTabSettings',
    fieldSchema['x-settings-props'],
  );
  if (!designable) {
    return null;
  }
  return (
    <SchemaToolbarProvider schema={schema}>
      <div className={'general-schema-designer'}>
        <div className={'general-schema-designer-icons'}>
          <Space size={3} align={'center'}>
            <DragHandler>
              <DragOutlined style={{ marginRight: 0 }} role="button" aria-label={getAriaLabel('drag-handler', 'tab')} />
            </DragHandler>
            {render()}
          </Space>
        </div>
      </div>
    </SchemaToolbarProvider>
  );
};
