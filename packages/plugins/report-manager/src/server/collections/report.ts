

export default {
    "logging": true,
    "name": "report",
    "template": "general",
    "view": false,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "fields": [
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
                },
                "x-read-pretty": true
            }
        },
        {
            "type": "date",
            "field": "updatedAt",
            "name": "updatedAt",
            "interface": "updatedAt",
            "uiSchema": {
                "type": "string",
                "title": "{{t(\"Last updated at\")}}",
                "x-component": "DatePicker",
                "x-component-props": {},
                "x-read-pretty": true
            }
        },
        {
            "type": "belongsTo",
            "target": "users",
            "foreignKey": "updatedById",
            "name": "updatedBy",
            "interface": "updatedBy",
            "uiSchema": {
                "type": "object",
                "title": "{{t(\"Last updated by\")}}",
                "x-component": "AssociationField",
                "x-component-props": {
                    "fieldNames": {
                        "value": "id",
                        "label": "nickname"
                    }
                },
                "x-read-pretty": true
            }
        },
        {
    
            "name": "title",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "周报名称"
            }
        },
        //报告类型
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
            "uiSchema": {
                type:'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "report_type"
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
                "title": "报告类型"
            },
            "foreignKey": "type_dicId",
            "target": "dicItem",
            "dicCode": "report_type",
            "targetKey": "id"
        },
        //报告状态
        {
            "name": "status_dicId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "status_dicId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            "name": "status",
            "type": "belongsTo",
            "interface": "dic",
            "uiSchema": {
                type:'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "report_status"
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
                "title": "报告状态"
            },
            "foreignKey": "status_dicId",
            "target": "dicItem",
            "dicCode": "report_status",
            "targetKey": "id"
        },{
            "name": "userId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "userId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
         //成员
         {
            "type": "belongsTo",
            "target": "users",
            "foreignKey": "userId",
            "name": "user",
            "interface": "obo",
            "uiSchema": {
                "type": "object",
                "title": "成员",
                "x-component": "AssociationField",
                "x-component-props": {
                    "fieldNames": {
                        "value": "id",
                        "label": "nickname"
                    }
                }
            }
        },{
            "name": "start",
            "type": "date",
            "interface": "datetime",
            "collectionName": "report",
            "uiSchema": {
                "x-component-props": {
                    "dateFormat": "YYYY-MM-DD",
                    "gmt": false,
                    "showTime": false
                },
                "type": "string",
                "x-component": "DatePicker",
                "title": "开始日期"
            }
        },{
            "name": "end",
            "type": "date",
            "interface": "datetime",
            "collectionName": "report",
            "uiSchema": {
                "x-component-props": {
                    "dateFormat": "YYYY-MM-DD",
                    "gmt": false,
                    "showTime": false
                },
                "type": "string",
                "x-component": "DatePicker",
                "title": "结束日期"
            }
        },{
            "name": "submitTime",
            "type": "date",
            "interface": "datetime",
            "collectionName": "report",
            "parentKey": null,
            "reverseKey": null,
            "uiSchema": {
                "x-component-props": {
                    "dateFormat": "YYYY-MM-DD",
                    "gmt": false,
                    "showTime": true,
                    "timeFormat": "HH:mm:ss"
                },
                "type": "string",
                "x-component": "DatePicker",
                "title": "提交时间"
            }
        },
        {
            "foreignKey": "reportId",
            "onDelete": "SET NULL",
            "name": "weekContent",
            "type": "hasMany",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "content",
                        "value": "id"
                    }
                },
                "title": "本周完成"
            },
            "interface": "o2m",
            "target": "reportDetail"
        },
        {
            "foreignKey": "reportId",
            "name": "weekPlan",
            "type": "hasMany",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "content",
                        "value": "id"
                    }
                },
                "title": "下周计划"
            },
            "interface": "o2m",
            "target": "reportPlan"
        }
    ],
    "title": "报告"
}