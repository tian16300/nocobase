// 引入字段类型基类
import { BaseColumnFieldOptions, DataTypes, Field } from '@nocobase/database';
// 引入算法工具包
import { Snowflake } from 'nodejs-snowflake';


export class DicField extends Field {
  get dataType() {
    return DataTypes.STRING;
  }
  constructor(options , context) {
    super(options, context);

    // const {
    //   epoch: custom_epoch,
    //   instanceId: instance_id = process.env.INSTANCE_ID ? Number.parseInt(process.env.INSTANCE_ID) : 0,
    // } = options;
    // this.generator = new Snowflake({ custom_epoch, instance_id });
  }

  setValue = (instance) => {
    const { name } = this.options;
    // instance.set(name, this.generator.getUniqueID());
  };

  bind() {
    super.bind();
    this.on('beforeCreate', this.setValue);
  }

  unbind() {
    super.unbind();
    this.off('beforeCreate', this.setValue);
  }
}

export default DicField;
