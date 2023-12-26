import { Migration } from '@nocobase/server';

export default class UpdateTaskFieldsMigration extends Migration {
  async up() {
    /**
     * 增加前置任务
     */
    const match = await this.app.version.satisfies('<=0.7.4-alpha.7');
    if (!match) {
      return;
    }
    const Field = this.context.db.getRepository('fields');
    const createdByField = await Field.findOne({
      filter: {
        name: 'createdBy',
        collectionName: 'reportDetail',
      },
    });
    if (!createdByField) {
      await Field.create({
        values: {
          name: 'createdBy',
          interface: 'createdBy',
          collectionName: 'reportDetail',
          type: 'belongsTo',
          target: 'users',
          foreignKey: 'createdById',
          uiSchema: {
            type: 'object',
            title: '{{t("Created by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
          },
        },
      });
    } else {
      await Field.update({
        filter: {
          name: 'createdBy',
          collectionName: 'reportDetail',
        },
        values: {
          name: 'createdBy',
          interface: 'createdBy',
          collectionName: 'reportDetail',
          type: 'belongsTo',
          target: 'users',
          foreignKey: 'createdById',
          uiSchema: {
            type: 'object',
            title: '{{t("Created by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
          },
        },
      });
    }
  }
  async down() {}
}
