import { Migration } from '@nocobase/server';

export default class FieldsMigration extends Migration {
  async up() {
    const tableRepo = this.db.getRepository<any>('collections');
    const fieldRepo =  this.context.db.getRepository('fields');
    if(tableRepo && fieldRepo){
      const collectionName = 'prj';
      const collection = await tableRepo.database.getCollection(collectionName);

    // const fieldRepo = this.context.db.getRepository('fields');
    // collection.fields.forEach(async (field) => {
    //   const existField = await fieldRepo.findOne({
    //     where: {
    //       collectionName: collectionName,
    //       name: field.name,
    //     },
    //   });
    //   if (existField) {
    //     // await fieldRepo.update({
    //     //   filter: {
    //     //     key: existField.key,
    //     //   },
    //     //   values: {
    //     //     options: {
    //     //       ...field.options,
    //     //     },
    //     //   },
    //     // });
    //   }else{
    //     // const value = {
    //     //   name: field
    //     // };
    //     // await fieldRepo.create({

    //     //   values: {
    //     //     options: {
    //     //       ...field.options,
    //     //     },
    //     //   },
    //     // })

    //   }
    // })
    // const field = await repo.findOne({
    //   where: {
    //     collectionName: 'roles',
    //     name: 'title',
    //   },
    // });
    // if (field) {
    //   await repo.update({
    //     filter: {
    //       key: field.key,
    //     },
    //     values: {
    //       options: {
    //         ...field.options,
    //         translation: true,
    //       },
    //     },
    //   });
    // }

    }
    
  }

  async down() { }
}
