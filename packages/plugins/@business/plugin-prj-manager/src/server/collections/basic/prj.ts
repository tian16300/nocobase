export default {
  logging: true,
  autoGenId: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  sortable: true,
  name: 'prj',
  template: 'general',
  view: false,
  inherits: ['prj_plan_task_time'],
  // fields1: [
  //   {
  //     name: 'id',
  //     type: 'bigInt',
  //     autoIncrement: true,
  //     primaryKey: true,
  //     allowNull: false,
  //     uiSchema: {
  //       type: 'number',
  //       title: '{{t("ID")}}',
  //       'x-component': 'InputNumber',
  //       'x-read-pretty': true,
  //     },
  //     interface: 'id',
  //   },
  //   {
  //     name: 'prjId',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     isForeignKey: true,
  //     uiSchema: {
  //       type: 'number',
  //       title: 'prjId',
  //       'x-component': 'InputNumber',
  //     },
  //   },
  //   {
  //     name: 'enable',
  //     type: 'boolean',
  //     interface: 'checkbox',
  //     collectionName: 'prj',
  //     uiSchema: {
  //       type: 'boolean',
  //       'x-component': 'Checkbox',
  //       title: '启用',
  //     },
  //     defaultValue: true,
  //   },
  //   {
  //     name: 'activeIndex',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     uiSchema: {
  //       type: 'number',
  //       'x-component': 'InputNumber',
  //       'x-component-props': {
  //         stringMode: true,
  //         step: '1',
  //       },
  //       'x-validator': 'integer',
  //       title: '活跃',
  //     },
  //     defaultValue: 0,
  //   },
  //   {
  //     name: 'createdAt',
  //     interface: 'createdAt',
  //     type: 'date',
  //     field: 'createdAt',
  //     uiSchema: {
  //       type: 'datetime',
  //       title: '{{t("Created at")}}',
  //       'x-component': 'DatePicker',
  //       'x-component-props': {},
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     name: 'createdBy',
  //     interface: 'createdBy',
  //     type: 'belongsTo',
  //     target: 'users',
  //     foreignKey: 'createdById',
  //     uiSchema: {
  //       type: 'object',
  //       title: '{{t("Created by")}}',
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         fieldNames: {
  //           value: 'id',
  //           label: 'nickname',
  //         },
  //       },
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     type: 'date',
  //     field: 'updatedAt',
  //     name: 'updatedAt',
  //     interface: 'updatedAt',
  //     uiSchema: {
  //       type: 'string',
  //       title: '{{t("Last updated at")}}',
  //       'x-component': 'DatePicker',
  //       'x-component-props': {},
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     type: 'belongsTo',
  //     target: 'users',
  //     foreignKey: 'updatedById',
  //     name: 'updatedBy',
  //     interface: 'updatedBy',
  //     uiSchema: {
  //       type: 'object',
  //       title: '{{t("Last updated by")}}',
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         fieldNames: {
  //           value: 'id',
  //           label: 'nickname',
  //         },
  //       },
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     name: 'managerId',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     isForeignKey: true,
  //     uiSchema: {
  //       type: 'number',
  //       title: 'managerId',
  //       'x-component': 'InputNumber',
  //       'x-read-pretty': true,
  //     },
  //   },
  //   //项目经理
  //   {
  //     type: 'belongsTo',
  //     target: 'users',
  //     foreignKey: 'managerId',
  //     name: 'manager',
  //     interface: 'obo',
  //     uiSchema: {
  //       type: 'object',
  //       title: '项目经理',
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         fieldNames: {
  //           value: 'id',
  //           label: 'nickname',
  //         },
  //       },
  //       'x-read-pretty': true,
  //     },
  //   },
  //   //项目成员
  //   {
  //     interface: 'm2m',
  //     type: 'belongsToMany',
  //     name: 'users',
  //     target: 'users',
  //     foreignKey: 'prjId',
  //     otherKey: 'userId',
  //     onDelete: 'CASCADE',
  //     sourceKey: 'id',
  //     targetKey: 'id',
  //     through: 'prjs_users',
  //     uiSchema: {
  //       type: 'array',
  //       title: '项目成员',
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'nickname',
  //           value: 'id',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     foreignKey: 'prjId',
  //     onDelete: 'CASCADE',
  //     name: 'plans',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: '项目计划',
  //     },
  //     interface: 'o2m',
  //     target: 'prj_plan_latest',
  //   },
  //   //项目类型
  //   {
  //     name: 'type_dicId',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     isForeignKey: true,
  //     uiSchema: {
  //       type: 'number',
  //       title: 'type_dicId',
  //       'x-component': 'InputNumber',
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     name: 'type',
  //     type: 'belongsTo',
  //     interface: 'dic',
  //     collectionName: 'prj',
  //     uiSchema: {
  //       type: 'object',
  //       'x-component-props': {
  //         service: {
  //           params: {
  //             filter: {
  //               $and: [
  //                 {
  //                   dic: {
  //                     code: {
  //                       $eq: 'prj_type',
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //         multiple: false,
  //         fieldNames: {
  //           label: 'label',
  //           value: 'id',
  //           icon: 'icon',
  //           color: 'color',
  //         },
  //       },
  //       'x-component': 'AssociationField',
  //       'x-read-pretty': true,
  //       title: '项目类型',
  //     },
  //     foreignKey: 'type_dicId',
  //     target: 'dicItem',
  //     dicCode: 'prj_type',
  //     targetKey: 'id',
  //   },
  //   //项目状态
  //   {
  //     name: 'status_dicId',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     isForeignKey: true,
  //     uiSchema: {
  //       type: 'number',
  //       title: 'status_dicId',
  //       'x-component': 'InputNumber',
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     name: 'status',
  //     type: 'belongsTo',
  //     interface: 'dic',
  //     collectionName: 'prj',
  //     uiSchema: {
  //       type: 'object',
  //       'x-component-props': {
  //         service: {
  //           params: {
  //             filter: {
  //               $and: [
  //                 {
  //                   dicCode: {
  //                     $eq: 'prj_type',
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //         multiple: false,
  //         fieldNames: {
  //           label: 'label',
  //           value: 'id',
  //           icon: 'icon',
  //           color: 'color',
  //         },
  //       },
  //       'x-component': 'AssociationField',
  //       'x-read-pretty': true,
  //       title: '项目状态',
  //     },
  //     foreignKey: 'status_dicId',
  //     target: 'dicItem',
  //     dicCode: 'prj_status',
  //     targetKey: 'id',
  //   },
  //   {
  //     name: 'title',
  //     interface: 'input',
  //     type: 'string',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input',
  //       title: '项目名称',
  //     },
  //   },
  //   {
  //     name: 'code',
  //     interface: 'input',
  //     type: 'string',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input',
  //       title: '项目编号',
  //     },
  //   },
  //   {
  //     name: 'description',
  //     interface: 'textarea',
  //     type: 'text',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input.TextArea',
  //       title: '项目描述',
  //     },
  //   },
  //   {
  //     name: 'files',
  //     type: 'belongsToMany',
  //     interface: 'attachment',
  //     collectionName: 'prj',
  //     uiSchema: {
  //       'x-component-props': {
  //         accept: 'image/*,application/pdf,application/msword,application/vnd.*,application/zip',
  //         multiple: true,
  //       },
  //       type: 'array',
  //       'x-component': 'Upload.Attachment',
  //       title: '项目材料',
  //     },
  //     target: 'attachments',
  //     through: 'prjs_files',
  //     foreignKey: 'prj_id',
  //     otherKey: 'file_id',
  //     targetKey: 'id',
  //     sourceKey: 'id',
  //   },
  //   {
  //     name: 'remark',
  //     interface: 'textarea',
  //     type: 'text',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input.TextArea',
  //       title: '备注说明',
  //     },
  //   },
  //   {
  //     foreignKey: 'belongsPrjKey',
  //     onDelete: 'SET NULL',
  //     name: 'weekReport',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: '本周进展',
  //     },
  //     interface: 'o2m',
  //     target: 'reportDetail',
  //   },
  //   {
  //     foreignKey: 'prjId',
  //     onDelete: 'CASCADE',
  //     name: 'plan_version',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: '项目计划版本列表',
  //     },
  //     interface: 'o2m',
  //     target: 'prj_plan_version',
  //   },
  //   {
  //     name: 'customerComp',
  //     interface: 'textarea',
  //     type: 'text',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input.TextArea',
  //       title: '客户单位',
  //     },
  //   },
  //   {
  //     name: 'customer',
  //     interface: 'input',
  //     type: 'string',
  //     uiSchema: {
  //       type: 'string',
  //       'x-component': 'Input',
  //       title: '客户代表',
  //     },
  //   },
  //   {
  //     foreignKey: 'prjId',
  //     onDelete: 'SET NULL',
  //     name: 'task',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'title',
  //           value: 'id',
  //         },
  //       },
  //       title: '项目任务',
  //     },
  //     interface: 'o2m',
  //     target: 'task',
  //   },
  //   {
  //     foreignKey: 'prjId',
  //     onDelete: 'SET NULL',
  //     name: 'boms',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: 'BOM',
  //     },
  //     interface: 'o2m',
  //     target: 'bom',
  //   },
  //   {
  //     foreignKey: 'prjId',
  //     onDelete: 'SET NULL',
  //     name: 'bomMaterials',
  //     type: 'hasMany',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: true,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: 'BOM物料',
  //     },
  //     interface: 'o2m',
  //     target: 'bom_wl',
  //   },
  //   {
  //     name: 'stock_id',
  //     type: 'bigInt',
  //     interface: 'integer',
  //     isForeignKey: true,
  //     uiSchema: {
  //       type: 'number',
  //       title: 'stock_id',
  //       'x-component': 'InputNumber',
  //       'x-read-pretty': true,
  //     },
  //   },
  //   {
  //     name: 'stock',
  //     type: 'belongsTo',
  //     interface: 'obo',
  //     collectionName: 'prj',
  //     foreignKey: 'stock_id',
  //     onDelete: 'SET NULL',
  //     uiSchema: {
  //       'x-component': 'AssociationField',
  //       'x-component-props': {
  //         multiple: false,
  //         fieldNames: {
  //           label: 'id',
  //           value: 'id',
  //         },
  //       },
  //       title: '仓库',
  //     },
  //     target: 'ware_house',
  //     targetKey: 'id',
  //   },
  // ],
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',
      description: null,
      collectionName: 'prj',

      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'prj_cost_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'prj_cost_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'activeIndex',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '活跃',
      },
      defaultValue: 0,
    },
    {
      name: 'users',
      type: 'belongsToMany',
      interface: 'm2m',
      description: null,
      collectionName: 'prj',

      target: 'users',
      foreignKey: 'prjId',
      otherKey: 'userId',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      targetKey: 'id',
      through: 'prjs_users',
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
    {
      name: 'stock_id',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'stock_id',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      description: null,
      collectionName: 'prj',

      field: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: '{{t("Created at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      },
    },
    {
      name: 'plans',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      reverseKey: 'seac97tln4i',
      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '项目计划',
      },
      target: 'prj_plan_latest',
      sourceKey: 'id',
      targetKey: 'id',
    },
    {
      name: 'start',
      type: 'date',
      interface: 'datetime',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        icon: 'calendaroutlined',
        type: 'string',
        title: '开始时间',
        'x-component': 'DatePicker',
        'x-component-props': {
          gmt: false,
          showTime: false,
          dateFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      interface: 'updatedAt',
      description: null,
      collectionName: 'prj',

      field: 'updatedAt',
      uiSchema: {
        type: 'string',
        title: '{{t("Last updated at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      },
    },
    {
      name: 'managerId',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'managerId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'end',
      type: 'date',
      interface: 'datetime',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        icon: 'carryoutoutlined',
        type: 'string',
        title: '结束时间',
        'x-component': 'DatePicker',
        'x-component-props': {
          gmt: false,
          showTime: false,
          dateFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      name: 'manager',
      type: 'belongsTo',
      interface: 'obo',
      description: null,
      collectionName: 'prj',

      target: 'users',
      foreignKey: 'managerId',
      uiSchema: {
        type: 'object',
        title: '项目经理',
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'id',
            label: 'nickname',
          },
        },
        'x-read-pretty': true,
      },
      targetKey: 'id',
    },
    {
      name: 'customerComp',
      type: 'text',
      interface: 'textarea',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '客户单位',
      },
    },
    {
      name: 'customer',
      type: 'string',
      interface: 'input',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '客户代表',
      },
    },
    {
      name: 'type_dicId',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'type_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'type',
      type: 'belongsTo',
      interface: 'dic',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'object',
        'x-component-props': {
          service: {
            params: {
              filter: {
                $and: [
                  {
                    dicCode: {
                      $eq: 'prj_type',
                    },
                  },
                ],
              },
            },
          },
          multiple: false,
          fieldNames: {
            label: 'label',
            value: 'id',
            icon: 'icon',
            color: 'color',
          },
        },
        'x-component': 'AssociationField',
        'x-read-pretty': true,
        title: '项目类型',
      },
      foreignKey: 'type_dicId',
      target: 'dicItem',
      dicCode: 'prj_type',
      targetKey: 'id',
    },
    {
      name: 'status_dicId',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'status_dicId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'status',
      type: 'belongsTo',
      interface: 'dic',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'object',
        'x-component-props': {
          service: {
            params: {
              filter: {
                $and: [
                  {
                    dicCode: {
                      $eq: 'prj_status',
                    },
                  },
                ],
              },
            },
          },
          multiple: false,
          fieldNames: {
            label: 'label',
            value: 'id',
            icon: 'icon',
            color: 'color',
          },
        },
        'x-component': 'AssociationField',
        'x-read-pretty': true,
        title: '项目状态',
      },
      foreignKey: 'status_dicId',
      target: 'dicItem',
      dicCode: 'prj_status',
      targetKey: 'id',
    },
    {
      name: 'title',
      type: 'string',
      interface: 'input',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '项目名称',
      },
    },
    {
      name: 'code',
      type: 'string',
      interface: 'input',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '项目编号',
      },
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
      interface: 'textarea',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '项目描述',
      },
    },
    {
      name: 'files',
      type: 'belongsToMany',
      interface: 'attachment',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        'x-component-props': {
          accept: 'image/*,application/pdf,application/msword,application/vnd.*,application/zip',
          multiple: true,
        },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '项目材料',
      },
      target: 'attachments',
      through: 'prj_files',
      foreignKey: 'prj_id',
      otherKey: 'file_id',
      targetKey: 'id',
      sourceKey: 'id',
      onDelete: 'CASCADE',
      storage: 'project',
    },
    {
      name: 'remark',
      type: 'text',
      interface: 'textarea',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'string',
        'x-component': 'Input.TextArea',
        title: '备注说明',
      },
    },
    {
      name: 'task',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'title',
            value: 'id',
          },
        },
        title: '项目任务',
      },
      target: 'task',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'enable',
      type: 'boolean',
      interface: 'checkbox',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'boolean',
        'x-component': 'Checkbox',
        title: '启用',
      },
      defaultValue: true,
    },
    {
      name: 'weekReport',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'belongsPrjKey',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '本周进展',
      },
      target: 'reportDetail',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'plan_version',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'CASCADE',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '项目计划版本列表',
      },
      target: 'prj_plan_version',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'real_start',
      type: 'date',
      interface: 'datetime',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '实际开始',
      },
      overriding: true,
    },
    {
      name: 'real_end',
      type: 'date',
      interface: 'datetime',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        'x-component-props': {
          dateFormat: 'YYYY-MM-DD',
          gmt: false,
          showTime: false,
        },
        type: 'string',
        'x-component': 'DatePicker',
        title: '实际结束',
      },
      overriding: true,
    },
    {
      name: 'plan_days',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '计划工期',
      },
      overriding: true,
    },
    {
      name: 'real_days',
      type: 'bigInt',
      interface: 'integer',
      description: null,
      collectionName: 'prj',

      uiSchema: {
        type: 'number',
        'x-component': 'InputNumber',
        'x-component-props': {
          stringMode: true,
          step: '1',
        },
        'x-validator': 'integer',
        title: '实际工期',
      },
      overriding: true,
    },
    {
      name: 'stock',
      type: 'belongsTo',
      interface: 'obo',
      description: null,
      collectionName: 'prj',

      foreignKey: 'stock_id',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '仓库',
      },
      target: 'ware_house',
      targetKey: 'id',
    },
    {
      name: 'boms',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: 'BOM',
      },
      target: 'bom',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'stock_wl',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: '项目物料',
      },
      target: 'wl_stock',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bom_materias',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: 'BOM物料明细',
      },
      target: 'bom_wl',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bom_wl_count',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: 'BOM物料统计明细',
      },
      target: 'bom_count_wl',
      targetKey: 'id',
      sourceKey: 'id',
    },
    {
      name: 'bom_applys',
      type: 'hasMany',
      interface: 'o2m',
      description: null,
      collectionName: 'prj',

      foreignKey: 'prjId',
      onDelete: 'SET NULL',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: 'BOM',
      },
      target: 'bom_apply',
      targetKey: 'id',
      sourceKey: 'id',
    },
  ],
  title: '项目',
};
