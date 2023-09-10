import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prjs_files',
  "title": "项目材料中间表",
  // duplicator: 'optional',
  // namespace: 'acl.acl',
  fields: [{ type: 'boolean', name: 'default' }],
} as CollectionOptions;
