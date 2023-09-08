import { DatePicker, FormItem, Input, FormGrid } from '@formily/antd-v5';
import { ISchema, observer, useForm } from '@formily/react';
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/react'
import React from 'react'
import { Action, AssociationSelect, Form, SchemaComponent, SchemaComponentProvider } from '@nocobase/client';
import { Card } from 'antd';
import { uid } from '@nocobase/utils';
const SchemaField = createSchemaField({
    components: {
        DatePicker,
        FormItem,
    },
})

const form = createForm()

// const schema: ISchema = {
//     type: 'object',
//     properties: {
//         grid: {
//             type: 'void',
//             'x-component': 'FormGrid',
//             'x-component-props': {
//                 minColumns: [4, 6, 10],
//             },
//             properties: {
//                 aaa: {
//                     type: 'string',
//                     title: 'AAA',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   bbb: {
//                     type: 'string',
//                     title: 'BBB',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   ccc: {
//                     type: 'string',
//                     title: 'CCC',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   ddd: {
//                     type: 'string',
//                     title: 'DDD',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   eee: {
//                     type: 'string',
//                     title: 'EEE',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   fff: {
//                     type: 'string',
//                     title: 'FFF',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   },
//                   ggg: {
//                     type: 'string',
//                     title: 'GGG',
//                     'x-decorator': 'FormItem',
//                     'x-component': 'Input',
//                   }
//                 // '[start,end]': {
//                 //     title: '日期范围',
//                 //     'x-decorator': 'FormItem',
//                 //     'x-component': 'DatePicker.RangePicker',
//                 //     'x-component-props': {
//                 //         'showTime': false
//                 //     },
//                 //     type: 'string',
//                 // },
//                 // 'users': {
//                 //     title: '成员',
//                 //     type: 'array',
//                 //     'x-decorator': 'FormItem',
//                 //     'x-component': 'Select',
//                 //     'x-component-props': {
//                 //         multiple: true,
//                 //         fieldNames: {
//                 //             label: 'nickname',
//                 //             value: 'id',
//                 //         },
//                 //         service: {
//                 //             resource: 'users',
//                 //             action: 'list',
//                 //         },
//                 //         style: {
//                 //             width: '100%',
//                 //         },
//                 //     },

//                 // }
//             }
//         }
//     }
// }

const schema: ISchema = {
    type: 'object',
    properties: {
        grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
                maxColumns: 4,
                minColumns: 4
            },
            properties: {
                '[start, end]': {
                    title: '日期范围',
                    'x-decorator': 'FormItem',
                    'x-component': 'DatePicker.RangePicker',
                    'x-component-props': {
                        'showTime': false
                    },
                    type: 'string',
                },
                'prj.users': {
                    type: 'array',
                    title: '项目成员',
                    'x-decorator': 'FormItem', 'x-component': 'AssociationSelect',
                    'x-component-props': {
                        multiple: true,
                        fieldNames: {
                            label: 'nickname',
                            value: 'id',
                        },
                        service: {
                            resource: 'users',
                            action: 'list',
                        }
                    }


                }

            }
        }
    }
};
const Output = observer(
    () => {
        const form = useForm();
        return <pre>{JSON.stringify(form.values, null, 2)}</pre>;
    },
    { displayName: 'Output' },
);
const useSubmit = () => {
    const form = useForm();
    return {
        async run() {
            console.log(form.values);
        },
    };
};
export const PrjWorkStaticForm: React.FC = observer(() => {
    return (
        <SchemaComponentProvider scope={{ useSubmit }} components={{ Card, DatePicker,AssociationSelect, FormGrid, Output, Action, Form, Input, FormItem }}>
            <SchemaComponent schema={schema} />
        </SchemaComponentProvider>
    )
})
