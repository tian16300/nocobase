import path from 'path';
import { Plugin } from '@nocobase/server';
import { Registry } from '@nocobase/utils';
import { Pattern, SequenceField } from './fields/sequence-field';
import { TreeSequenceField } from './fields/tree-sequence-field';
import { LevelField } from './fields/level-field';

export default class SequenceFieldPlugin extends Plugin {
  patternTypes = new Registry<Pattern>();

  async load() {
    const { app, db, options } = this;

    db.registerFieldTypes({
      sequence: SequenceField,
      treeSequence: TreeSequenceField,
      level: LevelField
    });

    db.addMigrations({
      namespace: 'sequence-field',
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });

    await this.importCollections(path.resolve(__dirname, 'collections'));

    db.on('fields.beforeSave', async (field, { transaction }) => {      
      if (field.get('type') == 'sequence') {
        return await SequenceField.beforeSave(field, { transaction }, db);
      }
      return;
    });

    db.on('fields.afterDestroy', async (field, { transaction }) => {
      if (field.get('type') == 'sequence') {
        SequenceField.afterDestroy(field, { transaction }, db);
      }
      return;
    });
  }

  async install() {}
}
