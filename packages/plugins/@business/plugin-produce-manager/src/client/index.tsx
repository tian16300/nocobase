import { Plugin, useSchemaInitializer } from '@nocobase/client';
import * as comps from './components';
import { ISchema, useField, useFieldSchema } from '@formily/react';
export class PluginProduceManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {
    

  }

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    this.app.addComponents(comps);
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.addSchemaInitializers()
  }
  addSchemaInitializers(){
    this.app.schemaInitializerManager.addItem('FormItemInitializers','getWlStockAction',{
      type:'item',
      useComponentProps(){
        const { insert } = useSchemaInitializer();
        return {
          title:'提取库存',
          onClick: ()=>{
            insert({
              type:'void',
              'x-decorator': 'FormItem',
              'x-designer': 'GetWlStock.Design',
              title:'提取库存',
              'x-component':'Action',
              'x-component-props':{
                component: 'GetWlStock.Action',
                type:'primary',
                useAction: () => {
                  return {
                    run() {},
                  };
                },

              }
            })
          }
        }
      },


    })
    this.app.schemaInitializerManager.addItem('TableActionInitializers','enableActions.countTableChangeAction',{
      name:'countTableChangeAction',
      title:'明细/统计',
      type:'item',
      Component: 'CountTableChangeActionInitializer',
      useVisible(){
        const fieldSchema = useFieldSchema();
        return true;
      }
    })
    this.app.schemaInitializerManager.addItem('TableActionInitializers','enableActions.bomTreeAddAction',{
      name:'bomTreeAddAction',
      title:'新增BOM',
      type:'item',
      Component: 'BomTreeAddActionInitializer',
    })
    this.app.schemaInitializerManager.addItem('RecordFormBlockInitializers','dataBlocks.formBlockInitializer2',{
      name:'formBlockInitializer2',
      title:'表单块2',
      type:'item',
      Component: 'FormBlockInitializer2',
    })
  }
}

export default PluginProduceManagerClient;
