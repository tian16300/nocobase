export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "name": "prj_plan_history",
    "template": "general",
    "view": false,
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
            "name": "version",
            "type": "bigInt",
            "interface": "integer",
            "uiSchema": {
                "type": "number",
                "x-component": "InputNumber",
                "x-component-props": {
                    "stringMode": true,
                    "step": "1"
                },
                "x-validator": "integer",
                "title": "版本号"
            }
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
        }
    ],
    "inherits": [
        "prj_plan"
    ],
    "title": "项目计划历史版本"
}