import { Migration } from '@nocobase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<=0.19.0-alpha.3';

  async up() {
    // coding
     // coding
     const { db } = this.context;
     const repo = db.getRepository('fields');
     const createdBy = await repo.findOne({
       filter: {
         name: 'createdBy',
         collectionName: 'bom_apply',
       },
     });
     if (!createdBy) {
       await repo.create({
         values: {
          name: 'createdBy',
          type: 'belongsTo',
          interface: 'createdBy',
          collectionName: 'bom_apply',
          description: null,
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
            'x-read-pretty': true,
          },
          targetKey: 'id',
        }
       });
     }else if(!createdBy.get('interface')){
      await createdBy.update({
        filter:{
          key: createdBy.get('key')
        },
        values:{
          interface: 'createdBy',
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
            'x-read-pretty': true,
          }
        }
      });
     }
     const updatedBy = await repo.findOne({
      filter: {
        name: 'updatedBy',
        collectionName: 'bom_apply',
      },
    });
    if (!updatedBy) {
      await repo.create({
        values: {
          name: 'updatedBy',
          type: 'belongsTo',
          interface: 'updatedBy',
          collectionName: 'bom_apply',
          target: 'users',
          foreignKey: 'updatedById',
          uiSchema: {
            type: 'object',
            title: '{{t("Last updated by")}}',
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
        }
      });
    }else if(!updatedBy.get('interface')){
      await updatedBy.update({
        filter:{
          key: updatedBy.get('key')
        },
        values:{
          interface: 'updatedBy',
          uiSchema: {
            type: 'object',
            title: '{{t("Last updated by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
            'x-read-pretty': true,
          }
        }
      });
    }
  }
}
