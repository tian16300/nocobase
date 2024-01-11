import { Plugin, useCollection, useSchemaInitializer } from '@nocobase/client';
import * as comps from './components';
import * as items from './initializers/components';
import * as scopes from './scopes';
import { ISchema, useField, useFieldSchema } from '@formily/react';
export class PluginProduceManagerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {
    

  }

  // You can get and modify the app instance here
  async load() {
    this.app.addComponents({
      ...comps,
      ...items as any
    });
    this.app.addScopes(scopes)
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
        const {name } = useCollection();
        return name === 'bom';
      }
    })
    this.app.schemaInitializerManager.addItem('TableActionInitializers','enableActions.bomTreeAddAction',{
      name:'bomTreeAddAction',
      title:'新增BOM',
      type:'item',
      Component: 'BomTreeAddActionInitializer',
      useVisible(){
        const {name } = useCollection();
        return name === 'bom';
      }
    })
    this.app.schemaInitializerManager.addItem('RecordFormBlockInitializers','dataBlocks.recordBomFormBlockInitializer',{
      name:'recordBomFormBlockInitializer',
      title:'BOM表单',
      type:'item',
      Component: 'RecordBomFormBlockInitializer',
      useVisible(){
        const {name } = useCollection();
        return name === 'bom';
      }
    })
    // this.app.schemaInitializerManager.add(new );
    /* 增加保存表单 及 提交申请 操作 */
    this.app.schemaInitializerManager.addItem('CreateFormActionInitializers','enableActions.saveBomActionInitializer',{
      name:'saveBomActionInitializer',
      title:'保存BOM',
      type:'item',
      Component: 'SaveBomActionInitializer',
      useVisible(){
        const {name} = useCollection();
        return name === 'bom';
      }
    })
      /* 增加保存表单 及 提交申请 操作 */
      this.app.schemaInitializerManager.addItem('CreateFormActionInitializers','enableActions.saveBomApplyActionInitializer',{
        name:'saveBomActionInitializer',
        title:'提交申请',
        type:'item',
        Component: 'SaveBomApplyActionInitializer',
        useVisible(){
          const {name} = useCollection();
          return name === 'bom';  
        }
      })
  }
}

export default PluginProduceManagerClient;
