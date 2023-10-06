export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "name": "prj_plan",
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
            "name": "title",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "阶段名称"
            }
        },
        //项目类型
        {
            "name": "stage_dicId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "stage_dicId",
                "x-component": "InputNumber"
            }
        },
        {
            "name": "stage",
            "type": "belongsTo",
            "interface": "dic",
            "collectionName": "prj_plan",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "prj_cycle"
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
                "title": "项目阶段"
            },
            "foreignKey": "stage_dicId",
            "target": "dicItem",
            "dicCode": "prj_cycle",
            "targetKey": "id"
        },
        {
            "name": "status_dicId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "外键(status_dicId)",
                "x-component": "InputNumber"
            }
        },
        {
            "name": "status",
            "type": "belongsTo",
            "interface": "dic",
            "collectionName": "prj_plan",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "prj_cycle_status"
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
                "title": "阶段状态"
            },
            "foreignKey": "status_dicId",
            "target": "dicItem",
            "dicCode": "prj_cycle_status",
            "targetKey": "id"
        },
        {
            "uiSchema": {
                "title": "任务",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "title",
                        "value": "id"
                    }
                }
            },
            "interface": "o2m",
            "type": "hasMany",
            "name": "task",
            "target":'task',
            "foreignKey": "prjStageId",
            "targetKey": "id"
        },
        {
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
        },
        {
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
        },{
            "name": "real_start",
            "type": "date",
            "interface": "datetime",
            "uiSchema": {
                "icon": "calendaroutlined",
                "type": "string",
                "title": "实际开始时间",
                "x-component": "DatePicker",
                "x-component-props": {
                    "gmt": false,
                    "showTime": false,
                    "dateFormat": "YYYY-MM-DD"
                }
            }
        }, {
            "name": "real_end",
            "type": "date",
            "interface": "datetime",
            "uiSchema": {
                "icon": "carryoutoutlined",
                "type": "string",
                "title": "实际结束时间",
                "x-component": "DatePicker",
                "x-component-props": {
                    "gmt": false,
                    "showTime": false,
                    "dateFormat": "YYYY-MM-DD"
                }
            }
        },
        
        {
            "name": "fruits_files",
            "type": "belongsToMany",
            "interface": "attachment",
            "collectionName": "prj_plan",
            "uiSchema": {
                "x-component-props": {
                    "accept": "image/*,application/pdf,application/msword,application/vnd.*,application/zip",
                    "multiple": true
                },
                "type": "array",
                "x-component": "Upload.Attachment",
                "title": "成果物"
            },
            "target": "attachments",
            "through": "prj_stages_files",
            "foreignKey": "prj_stage_id",
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
    "title": "项目计划"
}
