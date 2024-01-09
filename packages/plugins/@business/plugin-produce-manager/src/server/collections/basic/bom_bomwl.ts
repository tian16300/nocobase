export default {
    
    "name": "bom_bomwl",
    "title": "BOM和BOM物料明细中间表",
    "inherit": false,
    "hidden": false,
    
    "fields": [
        {
            
            "name": "id",
            "type": "bigInt",
            "interface": "id",            
            "collectionName": "bom_bomwl",              
            "autoIncrement": true,
            "primaryKey": true,
            "allowNull": false,
            "uiSchema": {
                "type": "number",
                "title": "{{t(\"ID\")}}",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            
            "name": "bom_wl_id",
            "type": "bigInt",
            "interface": "integer",            
            "collectionName": "bom_bomwl",            
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "bom_wl_id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            
            "name": "bom_id",
            "type": "bigInt",
            "interface": "integer",
            
            "collectionName": "bom_bomwl",
           
           
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "bom_id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            
            "name": "createdAt",
            "type": "date",
            "interface": "createdAt",
            
            "collectionName": "bom_bomwl",
           
           
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
            "type": "belongsTo",
            "interface": "createdBy",
            
            "collectionName": "bom_bomwl",
           
           
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
            },
            "targetKey": "id"
        },
        {
            
            "name": "updatedAt",
            "type": "date",
            "interface": "updatedAt",
            
            "collectionName": "bom_bomwl",
           
           
            "field": "updatedAt",
            "uiSchema": {
                "type": "string",
                "title": "{{t(\"Last updated at\")}}",
                "x-component": "DatePicker",
                "x-component-props": {},
                "x-read-pretty": true
            }
        },
        {
            
            "name": "updatedBy",
            "type": "belongsTo",
            "interface": "updatedBy",
            
            "collectionName": "bom_bomwl",
           
           
            "target": "users",
            "foreignKey": "updatedById",
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
            },
            "targetKey": "id"
        }
    ],
    "category": [],
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "template": "general",
    "view": false,
    "schema": "public"
}