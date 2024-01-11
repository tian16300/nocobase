import { defineCollection } from '@nocobase/database';

export default defineCollection({
  origin: '@nocobase/plugin-users',
  dumpRules: {
    group: 'user',
  },
  name: 'users',
  title: '{{t("Users")}}',
  sortable: 'sort',
  model: 'UserModel',
  createdBy: true,
  updatedBy: true,
  logging: true,
  shared: true,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: { type: 'number', title: '{{t("ID")}}', 'x-component': 'InputNumber', 'x-read-pretty': true },
      interface: 'id',
    },
    {
      interface: 'input',
      type: 'string',
      name: 'nickname',
      uiSchema: {
        type: 'string',
        title: '{{t("Nickname")}}',
        'x-component': 'Input',
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'username',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Username")}}',
        'x-component': 'Input',
        'x-validator': { username: true },
        required: true,
      },
    },
    {
      interface: 'email',
      type: 'string',
      name: 'email',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Email")}}',
        'x-component': 'Input',
        'x-validator': 'email',
        required: true,
      },
    },
    {
      interface: 'phone',
      type: 'string',
      name: 'phone',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Phone")}}',
        'x-component': 'Input',
        'x-validator': 'phone',
        required: true,
      },
    },
    {
      interface: 'password',
      type: 'password',
      name: 'password',
      hidden: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Password")}}',
        'x-component': 'Password',
      },
    },

    {
      uiSchema: {
        'x-component': 'Switch',
        type: 'boolean',
        title: '启用',
      },
      name: 'enabled',
      type: 'boolean',
      interface: 'checkbox',
      defaultValue: true,
    },
    {
      foreignKey: 'userId',
      onDelete: 'SET NULL',
      name: 'dept',
      type: 'belongsTo',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
        title: '部门',
        icon: null,
      },
      interface: 'm2o',
      target: 'dept',
    },
    {
      name: 'directUser',
      type: 'belongsTo',
      interface: 'obo',
      foreignKey: 'directUserId',
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
        title: '直接主管',
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      name: 'onjob',
      type: 'boolean',
      interface: 'checkbox',
      description: '在职-勾选；离职-不勾选',
      uiSchema: {
        type: 'boolean',
        'x-component': 'Checkbox',
        title: '在职',
      },
      defaultValue: true,
    },
    {
      name: 'job_number',
      type: 'sequence',
      interface: 'sequence',
      unique: true,
      patterns: [
        {
          type: 'string',
          options: {
            value: 'TX',
          },
        },
        {
          type: 'integer',
          options: {
            digits: 5,
            start: 1,
            key: 3717,
          },
        },
      ],
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        title: '工号',
      },
    },
    {
      name: 'dingUserId',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        'x-component': 'Input',
        title: '钉钉用户ID',
      },
    },

    {
      type: 'string',
      name: 'appLang',
    },
    {
      type: 'string',
      name: 'resetToken',
      unique: true,
      hidden: true,
    },
    {
      type: 'json',
      name: 'systemSettings',
      defaultValue: {},
    },
  ],
});
