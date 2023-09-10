import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'prj_stages_files',
  "title": "项目阶段成果物中间表",
  // duplicator: 'optional',
  // namespace: 'acl.acl',
  fields: [{ type: 'boolean', name: 'default' }],
} as CollectionOptions;
