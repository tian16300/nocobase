export default 
  {
    name: 'bom',
    title: 'BOM',
    inherit: false,
    hidden: false,
    fields: [
      {
          
          "name": "id",
          "type": "bigInt",
          "interface": "id",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
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
          
          "name": "parentId",
          "type": "bigInt",
          "interface": "integer",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "isForeignKey": true,
          "uiSchema": {
              "type": "number",
              "title": "{{t(\"Parent ID\")}}",
              "x-component": "InputNumber",
              "x-read-pretty": true
          }
      },
      {
          
          "name": "prj_code",
          "type": "string",
          "interface": "input",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "isForeignKey": true,
          "uiSchema": {
              "type": "string",
              "title": "prj_code",
              "x-component": "Input",
              "x-read-pretty": true
          }
      },
      {
          
          "name": "currentApproval_id",
          "type": "bigInt",
          "interface": "integer",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "isForeignKey": true,
          "uiSchema": {
              "type": "number",
              "title": "currentApproval_id",
              "x-component": "InputNumber",
              "x-read-pretty": true
          }
      },
      {
          
          "name": "parent",
          "type": "belongsTo",
          "interface": "m2o",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "foreignKey": "parentId",
          "treeParent": true,
          "onDelete": "CASCADE",
          "uiSchema": {
              "title": "上级BOM",
              "x-component": "AssociationField",
              "x-component-props": {
                  "multiple": false,
                  "fieldNames": {
                      "label": "id",
                      "value": "id"
                  }
              }
          },
          "target": "bom",
          "targetKey": "id"
      },
      {
          
          "name": "children",
          "type": "hasMany",
          "interface": "o2m",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "foreignKey": "parentId",
          "treeChildren": true,
          "onDelete": "CASCADE",
          "uiSchema": {
              "title": "子BOM",
              "x-component": "AssociationField",
              "x-component-props": {
                  "multiple": true,
                  "fieldNames": {
                      "label": "id",
                      "value": "id"
                  }
              }
          },
          "target": "bom",
          "targetKey": "id",
          "sourceKey": "id"
      },
      {
          
          "name": "level",
          "type": "level",
          "interface": "level",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "uiSchema": {
              "type": "number",
              "title": "层级",
              "x-component": "InputNumber",
              "x-read-pretty": true
          }
      },
      {
          
          "name": "createdAt",
          "type": "date",
          "interface": "createdAt",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
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
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
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
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
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
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
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
      },
      {
          
          "name": "prj",
          "type": "belongsTo",
          "interface": "obo",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "foreignKey": "prj_code",
          "onDelete": "SET NULL",
          "uiSchema": {
              "x-component": "AssociationField",
              "x-component-props": {
                  "multiple": false,
                  "fieldNames": {
                      "label": "id",
                      "value": "id"
                  }
              },
              "title": "项目"
          },
          "target": "prj",
          "targetKey": "code"
      },
      {
          
          "name": "version",
          "type": "string",
          "interface": "input",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "uiSchema": {
              "type": "string",
              "x-component": "Input",
              "title": "版本号"
          }
      },
      {
          
          "name": "isCurrent",
          "type": "boolean",
          "interface": "checkbox",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "uiSchema": {
              "x-component": "Checkbox",
              "type": "boolean",
              "title": "最新版本"
          }
      },
      {
          
          "name": "bom_name",
          "type": "string",
          "interface": "input",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "uiSchema": {
              "type": "string",
              "x-component": "Input",
              "title": "BOM名称"
          }
      },
      {
          
          "name": "type",
          "type": "string",
          "interface": "select",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "uiSchema": {
              "enum": [
                  {
                      "value": "GZ",
                      "label": "工站",
                      "color": "default"
                  },
                  {
                      "value": "DY",
                      "label": "单元",
                      "color": "default"
                  },
                  {
                      "value": "JG",
                      "label": "加工件",
                      "color": "warning"
                  },
                  {
                      "value": "DQ",
                      "label": "电气元件",
                      "color": "processing"
                  },
                  {
                      "value": "BZ",
                      "label": "标准件",
                      "color": "processing"
                  }
              ],
              "type": "string",
              "x-component": "Select",
              "title": "BOM类型"
          },
          "defaultValue": "GZ"
      },
      {
          
          "name": "bom_code",
          "type": "treeSequence",
          "interface": "treeSequence",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "patterns": [
              {
                  "type": "field",
                  "options": {
                      "textLen": 10,
                      "value": {
                          "label": "项目",
                          "value": "prj",
                          "target": "prj",
                          "targetKey": "code",
                          "interface": "obo",
                          "foreignKey": "prj_code"
                      }
                  }
              }
          ],
          "splitText": "-",
          "levelConfig": [
              {
                  "type": "integer",
                  "options": {
                      "digits": 2,
                      "start": 1,
                      "cycle": null,
                      "key": 60657
                  }
              },
              {
                  "type": "integer",
                  "options": {
                      "digits": 2,
                      "start": 1,
                      "key": 27395
                  }
              },
              {
                  "type": "integer",
                  "options": {
                      "digits": 3,
                      "start": 1,
                      "key": 64740
                  }
              }
          ],
          "uiSchema": {
              "type": "string",
              "x-component": "Input",
              "x-component-props": {},
              "title": "BOM编码"
          }
      },
      {
          
          "name": "bom_wl",
          "type": "hasMany",
          "interface": "o2m",
          "description": null,
          "collectionName": "bom",
          "parentKey": null,
          "reverseKey": null,
          "foreignKey": "bom_id",
          "onDelete": "SET NULL",
          "uiSchema": {
              "x-component": "AssociationField",
              "x-component-props": {
                  "multiple": true,
                  "fieldNames": {
                      "label": "id",
                      "value": "id"
                  }
              },
              "title": "物料明细"
          },
          "target": "bom_wl",
          "targetKey": "id",
          "sourceKey": "id"
      }
  ],
    logging: true,
    autoGenId: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true,
    sortable: true,
    template: 'tree',
    view: false,
    tree: 'adjacencyList',
    inherits: ['basic_wl_info', 'data_log_flag'],
    schema: 'public',
    titleField: 'bom_name',
  }
  