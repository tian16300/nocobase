export default{
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "name": "task_hour",
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
        },{
            "uiSchema": {
                "x-component-props": {
                    "dateFormat": "YYYY-MM-DD",
                    "gmt": false,
                    "showTime": false
                },
                "type": "string",
                "x-component": "DatePicker",
                "title": "开始日期",
                "icon": "calendaroutlined"
            },
            "name": "start",
            "type": "date",
            "interface": "datetime"
        },
        {
            "uiSchema": {
                "x-component-props": {
                    "dateFormat": "YYYY-MM-DD",
                    "gmt": false,
                    "showTime": false
                },
                "type": "string",
                "x-component": "DatePicker",
                "title": "结束日期",
                "icon": "carryoutoutlined"
            },
            "name": "end",
            "type": "date",
            "interface": "datetime"
        },{
            "uiSchema": {
                "x-component-props": {
                    "step": "1",
                    "stringMode": true
                },
                "type": "number",
                "x-component": "InputNumber",
                "title": "工时(h)"
            },
            "name": "hour",
            "type": "double",
            "interface": "number"
        },
        {
            name: 'isBusinessTrip',
            type: 'boolean',
            interface: 'checkbox',
            uiSchema: {
              type: 'boolean',
              'x-component': 'Checkbox',
              title: '是否出差',
            },
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
    "title": "任务工时"
}