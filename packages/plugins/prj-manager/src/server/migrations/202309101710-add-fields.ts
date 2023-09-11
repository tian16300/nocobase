import { Migration } from '@nocobase/server';


/**
 * 增加prj字段 项目成员 开始日期 结束日期
 */

export default class extends Migration {
    async up() {
        const repo = this.db.getCollection('prj');
        if (repo.hasField('members')) {
            await repo.getField('members').remove();
            await repo.sync();
        }
        const collections = this.db.getRepository<any>('collections');
        let table = await collections.find({
            filter: {
                name: {
                    $eq: 'prj_plan',
                },
            },
        });
        if (table.length == 0) {
            await collections.db2cm('prj_plan');
        }

        const fields = this.app.db.getRepository('fields');
        let result = await fields.find({
            filter: {
                collectionName: {
                    $eq: 'prj'
                },
                name: {
                    $eq: 'start'
                }
            }
        });
        if (result.length == 0) {
            await fields.create({
                values: {
                    "name": "start",
                    "type": "date",
                    "interface": "datetime",
                    "collectionName": "prj",
                    "options": {
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
                    }
                }
            })
        }
        result = await fields.find({
            filter: {
                collectionName: {
                    $eq: 'prj'
                },
                name: {
                    $eq: 'end'
                }
            }
        });
        if (result.length == 0) {
            await fields.create({
                values: {
                    "name": "end",
                    "type": "date",
                    "interface": "datetime",
                    "collectionName": "prj",
                    "options": {
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
                    }
                }
            })
        }
        result = await fields.find({
            filter: {
                collectionName: {
                    $eq: 'prj'
                },
                name: {
                    $eq: 'weekReport'
                }
            }
        });
        if (result.length == 0) {
            await fields.create({
                values: {
                    "name": "weekReport",
                    "type": "hasMany",
                    "interface": "o2m",
                    "collectionName": "prj",
                    "options": {
                        "uiSchema": {
                            "x-component": "AssociationField",
                            "x-component-props": {
                                "multiple": true,
                                "fieldNames": {
                                    "label": "id",
                                    "value": "id"
                                }
                            },
                            "title": "本周进展"
                        },
                        "target": "reportDetail",
                        "foreignKey": "prjId"
                    }
                }
            })
        }       
        result = await fields.find({
            filter: {
                collectionName: {
                    $eq: 'reportDetail',
                },
                name: {
                    $eq: 'prjId',
                },
            },
        });
        if (result.length == 0) {
            await fields.createMany({
                records: [
                    {
                        "name": "prjId",
                        "type": "bigInt",
                        "interface": "integer",
                        "collectionName": "reportDetail",
                        "isForeignKey": true,
                        "uiSchema": {
                            "type": "number",
                            "title": "prjId",
                            "x-component": "InputNumber",
                            "x-read-pretty": true
                        }
                    }
                ],
            });
        }
        /* 更新项目进展 */
    }

    async down() { }
}
