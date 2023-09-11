export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": false,
    "createdAt": true,
    "updatedAt": false,
    "sortable": false,
    "name": "reportDetail",
    "template": "general",
    "view": false,
    "fields": [
        //内容类型
        {
            "name": "type_dicId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "type_dicId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            "name": "type",
            "type": "belongsTo",
            "interface": "dic",
            "collectionName": "task",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "report_content_type"
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    "multiple": false,
                    "fieldNames": {
                        "label": "label",
                        "value": "id",
                        "icon": "icon",
                        "color": "color"
                    }
                },
                "x-component": "AssociationField",
                "x-read-pretty": true,
                "title": "内容类型"
            },
            "foreignKey": "type_dicId",
            "target": "dicItem",
            "dicCode": "report_content_type",
            "targetKey": "id"
        },
        {
            "foreignKey": "taskId",
            "onDelete": "SET NULL",
            "name": "linkTask",
            "type": "belongsTo",
            "uiSchema": {
                type:'object',
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false,
                    "fieldNames": {
                        "label": "title",
                        "value": "id"
                    }
                },
                "title": "关联任务"
            },
            "interface": "obo",
            "target": "task"
        },{
            "name": "content",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "内容"
            }
        },{
            "name": "complete",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "完成情况"
            }
        }, {
            "uiSchema": {
                "x-component-props": {
                    "step": "0.1",
                    "stringMode": true
                },
                "type": "number",
                "x-component": "InputNumber",
                "title": "工时(h)"
            },
            "name": "hours",
            "type": "double",
            "interface": "number"
        },{
            "name": "isBusinessTrip",
            "type": "boolean",
            "interface": "checkbox",
            "uiSchema": {
                "type": "boolean",
                "x-component": "Checkbox",
                "title": "是否出差"
            }
        },{
            "name": "remark",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "备注说明"
            }
        },
        {
            "name": "reportId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "reportId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },{
            "foreignKey": "reportId",
            "name": "report",
            "type": "belongsTo",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "title",
                        "value": "id"
                    }
                },
                "title": "周报"
            },
            "interface": "m2o",
            "target": "report"
        },
        {
            "name": "id",
            "type": "bigInt",
            "autoIncrement": true,
            "primaryKey": true,
            "allowNull": false,
            "uiSchema": {
                "type": "number",
                "title": "{{t(\"ID\")}}",
                "x-component": "InputNumber",
                "x-read-pretty": true
            },
            "interface": "id"
        },
        {
            "name": "createdAt",
            "interface": "createdAt",
            "type": "date",
            "field": "createdAt",
            "uiSchema": {
                "type": "datetime",
                "title": "{{t(\"Created at\")}}",
                "x-component": "DatePicker",
                "x-component-props": {},
                "x-read-pretty": true
            }
        },
        {
            "name": "createdBy",
            "interface": "createdBy",
            "type": "belongsTo",
            "target": "users",
            "foreignKey": "createdById",
            "uiSchema": {
                "type": "object",
                "title": "{{t(\"Created by\")}}",
                "x-component": "AssociationField",
                "x-component-props": {
                    "fieldNames": {
                        "value": "id",
                        "label": "nickname"
                    }
                }
            }
        }
    ],
    "title": "本周完成"
}