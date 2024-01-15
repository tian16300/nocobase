import { BlockInitializer, CustomizeActionInitializer, css, useCollection, useCollectionManager, useSchemaInitializer, useSchemaInitializerItem } from "@nocobase/client";
import type { ISchema } from '@formily/react';
import React from "react"
import { NAMESPACE } from "../../constants";
export const SubTableImportXlsActionInitializer = ()=>{
    const itemConfig = useSchemaInitializerItem(); 
    const { insert } = useSchemaInitializer();
    const { name } = useCollection();
    const { getCollectionFields } = useCollectionManager();
    const fields = getCollectionFields(name).filter((field)=>{
      return ['o2m','m2m'].includes(field?.interface);
    });
    const schema: ISchema = { 
        type: 'void',
        'x-decorator':'FormItem',
        'x-designer': 'FormItem.Designer',
        'x-component':'SubTableImportActionProvider',
        'x-component-props':{},
        properties:{
          action:{
            type:'void',
            title: '{{ t("Import") }}',
            'x-action': 'importXlsx',
            'x-action-settings': {
              importSettings: { importColumns: [], explain: '' },
            },
            'x-designer': 'ImportDesigner',
            'x-component': 'Action',
            'x-component-props': {
              icon: 'CloudUploadOutlined',
              openMode: 'modal',
            },
            properties: {
              modal: {
                type: 'void',
                title: `{{ t("Import Data", {ns: "${NAMESPACE}" }) }}`,
                'x-component': 'Action.Container',
                'x-decorator': 'Form',
                'x-component-props': {
                  width: '50%',
                  className: css`
                    .ant-formily-item-label {
                      height: var(--controlHeightLG);
                    }
                  `,
                },
                properties: {
                  formLayout: {
                    type: 'void',
                    'x-component': 'FormLayout',
                    properties: {
                      download: {
                        type: 'void',
                        title: `{{ t("Step 1: Download template", {ns: "${NAMESPACE}" }) }}`,
                        'x-component': 'FormItem',
                        'x-acl-ignore': true,
                        properties: {
                          tip: {
                            type: 'void',
                            'x-component': 'Markdown.Void',
                            'x-editable': false,
                            'x-component-props': {
                              style: {
                                padding: `var(--paddingContentVerticalSM)`,
                                backgroundColor: `var(--colorInfoBg)`,
                                border: `1px solid var(--colorInfoBorder)`,
                                color: `var(--colorText)`,
                                marginBottom: `var(--marginSM)`,
                              },
                              content: `{{ t("Download tip", {ns: "${NAMESPACE}" }) }}`,
                            },
                          },
                          downloadAction: {
                            type: 'void',
                            title: `{{ t("Download template", {ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'Action',
                            'x-component-props': {
                              className: css`
                                margin-top: 5px;
                              `,
                              useAction: '{{ useDownloadXlsxTemplateAction }}',
                            },
                          },
                        },
                      },
                      upload: {
                        type: 'array',
                        title: `{{ t("Step 2: Upload Excel", {ns: "${NAMESPACE}" }) }}`,
                        'x-decorator': 'FormItem',
                        'x-acl-ignore': true,
                        'x-component': 'Upload.Dragger',
                        'x-validator': '{{ uploadValidator }}',
                        'x-component-props': {
                          action: '',
                          height: '150px',
                          tipContent: `{{ t("Upload placeholder", {ns: "${NAMESPACE}" }) }}`,
                          beforeUpload: '{{ beforeUploadHandler }}',
                        },
                      },
                    },
                  },
                  footer: {
                    'x-component': 'Action.Container.Footer',
                    'x-component-props': {},
                    properties: {
                      actions: {
                        type: 'void',
                        'x-component': 'ActionBar',
                        'x-component-props': {},
                        properties: {
                          cancel: {
                            type: 'void',
                            title: '{{ t("Cancel") }}',
                            'x-component': 'Action',
                            'x-component-props': {
                              useAction: '{{ cm.useCancelAction }}',
                            },
                          },
                          startImport: {
                            type: 'void',
                            title: `{{ t("Start import", {ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'Action',
                            'x-component-props': {
                              type: 'primary',
                              htmlType: 'submit',
                              useAction: '{{ useImportStartAction }}',
                            },
                            'x-reactions': {
                              dependencies: ['upload'],
                              fulfill: {
                                run: 'validateUpload($form, $self, $deps)',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              }
            }
          }
        }
      };
    return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />
} 