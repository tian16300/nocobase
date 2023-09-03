export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "name": "dept",
    "template": "tree",
    "view": false,
    "tree": "adjacencyList",
    "fields": [
        {
            "interface": "integer",
            "name": "parentId",
            "type": "bigInt",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "上级门ID",
                "x-component": "InputNumber",
                "x-read-pretty": true
            },
            "target": "dept"
        },
        {
            "interface": "m2o",
            "type": "belongsTo",
            "name": "parent",
            "foreignKey": "parentId",
            "treeParent": true,
            "onDelete": "CASCADE",
            "uiSchema": {
                "title": "上级部门",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false,
                    "fieldNames": {
                        "label": "id",
                        "value": "id"
                    }
                }
            },
            "target": "dept"
        },
        {
            "interface": "o2m",
            "type": "hasMany",
            "name": "children",
            "foreignKey": "parentId",
            "treeChildren": true,
            "onDelete": "CASCADE",
            "uiSchema": {
                "title": "下级部门",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "id",
                        "value": "id"
                    }
                }
            },
            "target": "dept"
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
            "name": "name",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "部门名称"
            }
        },
        {
            "name": "code",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "部门编号"
            }
        }
    ],
    "title": "部门"
}