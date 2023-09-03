export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "name": "prj",
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
            "name": "managerId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "managerId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        //项目经理
        {
            "type": "belongsTo",
            "target": "users",
            "foreignKey": "managerId",
            "name": "manager",
            "interface": "obo",
            "uiSchema": {
                "type": "object",
                "title": "项目经理",
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
        //项目成员
        {
            interface: 'm2m',
            type: 'belongsToMany',
            name: 'users',
            target: 'users',
            foreignKey: 'prjId',
            otherKey: 'userId',
            onDelete: 'CASCADE',
            sourceKey: 'id',
            targetKey: 'id',
            through: 'prjsUsers',
            uiSchema: {
                type: 'array',
                title: '项目成员',
                'x-component': 'AssociationField',
                'x-component-props': {
                    multiple: true,
                    fieldNames: {
                        label: 'nickname',
                        value: 'id',
                    },
                },
            },

        },
        //项目类型
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
            "collectionName": "prj",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "prj_type"
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
                "title": "项目类型"
            },
            "foreignKey": "type_dicId",
            "target": "dicItem",
            "dicCode": "prj_type",
            "targetKey": "id"
        },
        //项目状态
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
            "collectionName": "prj",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "prj_status"
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
                "title": "项目状态"
            },
            "foreignKey": "status_dicId",
            "target": "dicItem",
            "dicCode": "prj_status",
            "targetKey": "id"
        },
        {
            "name": "title",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "项目名称"
            }
        },
        {
            "name": "code",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "项目编号"
            }
        },{
            "name": "start",
            "type": "date",
            "interface": "datetime",
            "uiSchema": {
                "icon": "calendaroutlined",
                "type": "string",
                "title": "开始时间",
                "x-component": "DatePicker",
                "x-component-props": {
                    "gmt": false,
                    "showTime": false,
                    "dateFormat": "YYYY-MM-DD"
                }
            }
        }, {
            "name": "end",
            "type": "date",
            "interface": "datetime",
            "uiSchema": {
                "icon": "carryoutoutlined",
                "type": "string",
                "title": "结束时间",
                "x-component": "DatePicker",
                "x-component-props": {
                    "gmt": false,
                    "showTime": false,
                    "dateFormat": "YYYY-MM-DD"
                }
            }
        },
        {
            "name": "description",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "项目描述"
            }
        },
        {
            "name": "files",
            "type": "belongsToMany",
            "interface": "attachment",
            "collectionName": "prj",
            "uiSchema": {
                "x-component-props": {
                    "accept": "image/*,application/pdf,application/msword,application/vnd.*,application/zip",
                    "multiple": true
                },
                "type": "array",
                "x-component": "Upload.Attachment",
                "title": "项目材料"
            },
            "target": "attachments",
            "through": "prj_files",
            "foreignKey": "prj_id",
            "otherKey": "file_id",
            "targetKey": "id",
            "sourceKey": "id"
        },
        {
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
            "name": "customerComp",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "客户单位"
            }
        },
        {
            "name": "customer",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "客户代表"
            }
        },        
        {
            "foreignKey": "prjId",
            "onDelete": "SET NULL",
            "name": "task",
            "type": "hasMany",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "title",
                        "value": "id"
                    }
                },
                "title": "项目任务"
            },
            "interface": "o2m",
            "target": "task"
        }
    ],
    "title": "项目"
}