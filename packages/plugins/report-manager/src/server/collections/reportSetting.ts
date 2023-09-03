export default {
    "inherit": false,
    "hidden": false,
    "name": "reportSetting",
    "title": "报告设置",
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
                "title": "名称"
            }
        },
        {

            "name": "setting",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "频率"
            }
        },
        {
            "name": "remark",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "备注"
            }
        },
        {
            "name": "reportUsers",
            "type": "belongsToMany",
            "interface": "m2m",
            "target": "users",
            "foreignKey": "reportSettingId",
            "otherKey": "reportUserId",
            "onDelete": "SET NULL",
            "sourceKey": "id",
            "targetKey": "id",
            "through": "reportSettingsUsers",
            "uiSchema": {
                "type": "array",
                "title": "报告对象",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "nickname",
                        "value": "id"
                    }
                }
            }
        },
        {
            "name": "isGenerate",
            "type": "boolean",
            "interface": "checkbox",
            "collectionName": "reportSetting",
            "uiSchema": {
                "type": "boolean",
                "x-component": "Checkbox",
                "title": "本周是否已生成"
            }
        }
    ],
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "template": "general",
    "view": false
}