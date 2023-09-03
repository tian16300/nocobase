import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prjsUsers',
  "title": "项目成员中间表",
  // duplicator: 'optional',
  // namespace: 'acl.acl',
  fields: [{ type: 'boolean', name: 'default' }],
} as CollectionOptions;
