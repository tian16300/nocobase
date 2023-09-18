export default {
  "logging": true,
  "autoGenId": true,
  "createdBy": true,
  "updatedBy": true,
  "createdAt": true,
  "updatedAt": true,
  "sortable": true,
  "name": "dic",
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
      "name": "title",
      "interface": "input",
      "type": "string",
      "uiSchema": {
        "type": "string",
        "x-component": "Input",
        "title": "字典名称"
      }
    }, {
      "name": "code",
      "interface": "input",
      "type": "string",
      "allowNull": false,
      "uiSchema": {
        "type": "string",
        "x-component": "Input",
        "title": "字典编码"
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
      "foreignKey": "dicCode",
      "name": "items",
      "type": "hasMany",
      "uiSchema": {
        "x-component": "AssociationField",
        "x-component-props": {
          "multiple": true,
          "fieldNames": {
            "label": "label",
            "value": "code"
          }
        },
        "title": "配置"
      },
      "interface": "o2m",
      "target": "dicItem",
      'sourceKey':'code'
    }
  ],
  "title": "字典"
};
