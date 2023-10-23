export default {
    "inherit": ['prj_plan_task_time'],
    "hidden": false,
    "name": "task",
    "title": "任务",
    "fields": [
        {
            "interface": "integer",
            "name": "parentId",
            "type": "bigInt",
            "collectionName": "task",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "{{t(\"Parent ID\")}}",
                "x-component": "InputNumber",
                "x-read-pretty": true
            },
            "target": "task"
        },
        {
            "interface": "m2o",
            "type": "belongsTo",
            "name": "parent",
            "collectionName": "task",
            "foreignKey": "parentId",
            "treeParent": true,
            "onDelete": "CASCADE",
            "uiSchema": {
                "title": "父任务",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false,
                    "fieldNames": {
                        "label": "id",
                        "value": "id"
                    }
                }
            },
            "target": "task",
            "targetKey": "id"
        },
        {
            "interface": "o2m",
            "type": "hasMany",
            "name": "children",
            "collectionName": "task",
            "foreignKey": "parentId",
            "treeChildren": true,
            "onDelete": "CASCADE",
            "uiSchema": {
                "title": "子任务",
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true,
                    "fieldNames": {
                        "label": "id",
                        "value": "id"
                    }
                }
            },
            "target": "task",
            "targetKey": "id",
            "sourceKey": "id"
        },{
            "name": "prjStageId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "prjStageId",
                "x-component": "InputNumber"
            }
        },
        {
            "foreignKey": "prjStageId",
            "onDelete": "SET NULL",
            "name": "prjStage",
            "type": "belongsTo",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false,
                    "fieldNames": {
                        "label": "stage.label",
                        "value": "id"
                    }
                },
                "title": "项目阶段"
            },
            "interface": "m2o",
            "target": "prj_plan_latest",            
            "targetKey": "id",
            "sourceKey": "id"
        },
        {
            "name": "id",
            "type": "bigInt",
            "interface": "id",
            "collectionName": "task",
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
            "name": "title",
            "interface": "input",
            "type": "string",
            "uiSchema": {
                "type": "string",
                "x-component": "Input",
                "title": "任务名称"
            }
        },
        {
            "name": "prjId",
            "type": "bigInt",
            "interface": "integer",
            "collectionName": "task",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "prjId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            "name": "prj",
            "type": "belongsTo",
            "interface": "m2o",
            "collectionName": "task",
            "foreignKey": "prjId",
            "onDelete": "SET NULL",
            "uiSchema": {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false,
                    "fieldNames": {
                        "label": "title",
                        "value": "id"
                    }
                },
                "title": "项目"
            },
            "target": "prj",
            "targetKey": "id"
        },
        {
            "name": "taskDepId",
            "type": "bigInt",
            "interface": "integer",
            "collectionName": "task",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "taskDepId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        //前置任务
        {
            interface: 'm2m',
            type: 'belongsToMany',
            name: 'dependencies',
            target: 'task',
            foreignKey: 'taskDepId',
            otherKey: 'taskId',
            onDelete: 'CASCADE',
            sourceKey: 'id',
            targetKey: 'id',
            through: 'tasks_dependencies',
            uiSchema: {
                type: 'array',
                title: '前置任务',
                'x-component': 'AssociationField',
                'x-component-props': {
                    multiple: true,
                    fieldNames: {
                        label: 'title',
                        value: 'id',
                    },
                },
            }
        },
        //任务状态
        {
            "name": "status_dicId",
            "type": "bigInt",
            "interface": "integer",
            "collectionName": "task",
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
            "collectionName": "task",
            "uiSchema": {
                type: 'object',
                "x-component-props": {
                    "service": {
                        "params": {
                            "filter": {
                                "$and": [
                                    {
                                        "dicCode": {
                                            "$eq": "task_status"
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
                "title": "任务状态"
            },
            "foreignKey": "status_dicId",
            "target": "dicItem",
            "dicCode": "task_status",
            "targetKey": "id"
        },
        {
            "name": "userId",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "userId",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        //负责人
        {
            "type": "belongsTo",
            "target": "users",
            "foreignKey": "userId",
            "name": "user",
            "interface": "obo",
            "uiSchema": {
                "type": "object",
                "title": "负责人",
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
            "name": "description",
            "interface": "textarea",
            "type": "text",
            "uiSchema": {
                "type": "string",
                "x-component": "Input.TextArea",
                "title": "任务描述"
            }
        },
        {
            "foreignKey": "taskId",
            "onDelete": "SET NULL",
            "reverseField": {
                "uiSchema": {
                    "title": "任务",
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
                "name": "task"
            },
            "name": "task_hour",
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
                "title": "任务工时"
            },
            "interface": "o2m",
            "target": "reportDetail"
        },{
            "name": "process",
            "type": "float",
            "interface": "percent",
            "collectionName": "task",
            "uiSchema": {
                "x-component-props": {
                    "step": "1",
                    "stringMode": true,
                    "addonAfter": "%"
                },
                "type": "string",
                "x-component": "Percent",
                "title": "进度"
            }
        }, {
            "uiSchema": {
                "x-component-props": {
                    "step": "0.1",
                    "stringMode": true
                },
                "type": "number",
                "x-component": "InputNumber",
                "title": "总工时(h)"
            },
            "name": "hours",
            "type": "double",
            "interface": "number"
        },
        {
            "name": "isBusinessTrip",
            "type": "boolean",
            "interface": "checkbox",
            "uiSchema": {
                "type": "boolean",
                "x-component": "Checkbox",
                "title": "是否出差"
            }
        },
        {
            "name": "files",
            "type": "belongsToMany",
            "interface": "attachment",
            "uiSchema": {
                "x-component-props": {
                    "accept": "image/*,application/pdf,application/msword,application/vnd.*,application/zip",
                    "multiple": true
                },
                "type": "array",
                "x-component": "Upload.Attachment",
                "title": "任务材料"
            },
            "target": "attachments",
            "through": "task_files",
            "foreignKey": "task_id",
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
            "collectionName": "task",
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
            "type": "date",
            "name": "updatedAt",
            "interface": "updatedAt",
            "collectionName": "task",
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
            "type": "belongsTo",
            "name": "updatedBy",
            "interface": "updatedBy",
            "collectionName": "task",
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
    "logging": true,
    "autoGenId": true,
    "createdBy": true,
    "updatedBy": true,
    "createdAt": true,
    "updatedAt": true,
    "sortable": true,
    "template": "tree",
    "view": false,
    "tree": "adjacencyList",
    "schema": "public"
}