import Application from '@nocobase/server';
import { LOG_TYPE_UPDATE, LOG_TYPE_DEACTIVE, LOG_TYPE_RESTORE } from '../constants';

export function afterUpdate(app: Application) {
  return async (model, options) => {
    const db = app.db;
    const collection = db.getCollection(model.constructor.name);
    if (!collection || !collection.options.logging) {
      return;
    }
    const changed = model.changed();
    if (!changed) {
      return;
    }
    const transaction = options.transaction;
    const AuditLog = db.getCollection('auditLogs');
    const currentUserId = options?.context?.state?.currentUser?.id;
    let operationType = LOG_TYPE_UPDATE;
    const changes = [];
    const isCheckAssociationField = (field) => {
       return ['belongsTo','hasMany','hasOne', 'belongsToMany'].includes(field.type);
    };
    changed.forEach((key: string) => {
      const field = collection.findField((field) => {
        return field.name === key || field.options.field === key;
      });     

      if (field && !field.options.hidden ) {
        const isAssociationField = isCheckAssociationField(field);
        if(!isAssociationField){
          changes.push({
            field: field.options,
            after: model.get(key),
            before: model.previous(key),
          });
        }else{
          // const field = field.options;
          // const before = await model.get;



        }       
      }
    });
    if (!changes.length) {
      return;
    }
    /**
     * 拓展操作类型
     */
    if(changed.includes('isDeleted')){
      const  preVal = model.previous('isDeleted');
      const  val = model.get('isDeleted');
      if(val!=preVal){
        operationType = val?LOG_TYPE_DEACTIVE:LOG_TYPE_RESTORE;
      }
    }
    /**
     * 
     */
    try {
      await AuditLog.repository.create({
        values: {
          type: operationType,
          collectionName: model.constructor.name,
          recordId: model.get(model.constructor.primaryKeyAttribute),
          createdAt: model.get('updatedAt'),
          userId: currentUserId,
          changes,
        },
        transaction,
        hooks: false,
      });
      // if (!options.transaction) {
      //   await transaction.commit();
      // }
    } catch (error) {
      // if (!options.transaction) {
      //   await transaction.rollback();
      // }
    }
  };
}
