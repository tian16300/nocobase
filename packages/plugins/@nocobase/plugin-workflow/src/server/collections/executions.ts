import { CollectionOptions } from '@nocobase/database';

export default {
  dumpRules: {
    group: 'log',
  },
  name: 'executions',
  shared: true,
  fields: [
    {
      type: 'belongsTo',
      name: 'workflow',
    },
    {
      type: 'uid',
      name: 'key',
    },
    {
      "foreignKey": "executionId",
      "onDelete": "CASCADE",
      "name": "jobs",
      "type": "hasMany",
      "uiSchema": {
          "x-component": "AssociationField",
          "x-component-props": {
              "multiple": true,
              "fieldNames": {
                  "label": "id",
                  "value": "id"
              }
          },
          "title": "任务"
      },
      "interface": "o2m",
      "target": "jobs"
  },
    {
      type: 'json',
      name: 'context',
    },
    {
      type: 'integer',
      name: 'status',
    },
  ],
} as CollectionOptions;
