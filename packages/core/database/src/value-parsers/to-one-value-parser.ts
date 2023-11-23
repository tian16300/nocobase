import { Repository } from '../repository';
import { BaseValueParser } from './base-value-parser';

export class ToOneValueParser extends BaseValueParser {
  async setValue(value: any, { transaction }, _instance?: any) {
    const dataIndex = this.ctx?.column?.dataIndex || [];
    if (Array.isArray(dataIndex) && dataIndex.length < 2) {
      this.errors.push(`data index invalid`);
      return;
    }
    const key = this.ctx.column.dataIndex[1];
    const repository = this.field.database.getRepository(this.field.target) as Repository;
    let instance = _instance;
    if (!instance) {
      instance = await repository.findOne({ filter: { [key]: this.trim(value), transaction } });
    }
    if (instance) {
      this.value = instance.get(this.field.targetKey || 'id');
    } else {
      this.errors.push(`"${value}" does not exist`);
    }
  }
}
