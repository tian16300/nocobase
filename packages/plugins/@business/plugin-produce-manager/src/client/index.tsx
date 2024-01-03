import { Plugin, useSchemaInitializer } from '@nocobase/client';
import * as comps from './components';
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
  }
}

export default PluginProduceManagerClient;
