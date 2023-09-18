import { CollectionOptions } from '@nocobase/database';

export default {
  namespace: 'snapshot-field.snapshot-field',
  duplicator: 'required',
  name: 'fieldsHistory',
  title: '{{t("Fields history")}}',
  autoGenId: false,
  model: 'FieldModel',
  timestamps: false,
  sortable: {
    name: 'sort',
    scopeKey: 'collectionName',
  },
  indexes: [
    {
      type: 'UNIQUE',
      fields: ['collectionName', 'name'],
    },
  ],
  fields: [
    {
      type: 'uid',
      name: 'key',
      primaryKey: true,
    },
    {
      type: 'uid',
      name: 'name',
      prefix: 'f_',
    },
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'interface',
      allowNull: true,
    },
    {
      type: 'belongsTo',
      name: 'collection',
      target: 'collectionsHistory',
      foreignKey: 'collectionName',
      targetKey: 'name',
      onDelete: 'CASCADE',
    },
    {
      type: 'hasMany',
      name: 'children',
      target: 'fieldsHistory',
      sourceKey: 'key',
      foreignKey: 'parentKey',
    },
    {
      type: 'hasOne',
      name: 'reverseField',
      target: 'fieldsHistory',
      sourceKey: 'key',
      foreignKey: 'reverseKey',
    },
    // {
    //   type: 'belongsTo',
    //   name: 'uiSchema',
    //   target: 'uiSchemas',
    //   foreignKey: 'uiSchemaUid',
    // },
    {
      type: 'json',
      name: 'options',
      defaultValue: {},
    },
  ],
} as CollectionOptions;
