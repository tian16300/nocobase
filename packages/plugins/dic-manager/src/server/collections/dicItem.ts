export default {
  "logging": true,
  "autoGenId": true,
  "createdBy": true,
  "updatedBy": true,
  "createdAt": true,
  "updatedAt": true,
  "sortable": true,
  "name": "dicItem",
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
      "name": "dicCode",
      "type": "string",
      "interface": "input",
      "collectionName": "dicItem",
      "isForeignKey": true,
      "uiSchema": {
        "type": "string",
        "title": "dicCode",
        "x-component": "Input",
        "x-read-pretty": true
      }
    }, 
    {
      "foreignKey": "dicCode",
      "name": "dic",
      "type": "belongsTo",
      "uiSchema": {
        "x-component": "AssociationField",
        "x-component-props": {
          "multiple": false,
          "fieldNames": {
            "label": "title",
            "value": "code"
          }
        },
        "title": "字典"
      },
      "interface": "m2o",
      "target": "dic",
      'targetKey':'code'
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
      "name": "label",
      "interface": "input",
      "type": "string",
      "uiSchema": {
        "type": "string",
        "x-component": "Input",
        "title": "名称"
      }
    }, {
      "name": "value",
      "interface": "input",
      "type": "string",
      "uiSchema": {
        "type": "string",
        "x-component": "Input",
        "title": "数据值"
      }
    },
    {
      "defaultValue": "#1677FF",
      "name": "color",
      "type": "string",
      "uiSchema": {
        "type": "string",
        "x-component": "ColorSelect",
        "default": "#1677FF",
        "title": "颜色"
      },
      "interface": "color"
    },
    {
      "name": "icon",
      "type": "string",
      "uiSchema": {
        "type": "string",
        "x-component": "IconPicker",
        "title": "图标"
      },
      "interface": "icon"
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
    }, {
      "uiSchema": {
        "title": "字典",
        "x-component": "AssociationField",
        "x-component-props": {
          "multiple": false,
          "fieldNames": {
            "label": "title",
            "value": "id"
          }
        }
      },
      "interface": "m2o",
      "type": "belongsTo",
      "name": "dic"
    }
  ],
  "title": "字典配置"
}

