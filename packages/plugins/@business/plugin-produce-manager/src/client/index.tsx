import { Plugin, useCollection, useSchemaInitializer } from '@nocobase/client';
import * as comps from './components';
import * as items from './initializers/components';
import * as scopes from './scopes';
import { ISchema, useField, useFieldSchema } from '@formily/react';
import * as providers  from './providers';
import { UseSubTableActionBarComponentProps } from './initializers/use-component-props';
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
      ...items as any,
      ...providers as any
    });
    this.app.addScopes(scopes);
    // this.app.addProviders();
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.addSchemaInitializers()
  }
  addSchemaInitializers(){
    this.app.schemaInitializerManager.addItem('SubTableActionInitializers','enableActions.getWlStockAction',{
      type:'item',
      title:'提取库存',
      Component: 'GetWlStockActionInitializer'
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

    this.app.schemaInitializerManager.addItem('TableActionInitializers','enableActions.initBomApplyAction',{
      name:'initBomApplyAction',
      title:'一键创建单据',
      type:'item',
      Component: 'InitBomApplyActionInitializer',
      useVisible(){
        const {name } = useCollection();
        return name === 'bom_apply';
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
      });
      this.app.schemaInitializerManager.addItem('FormItemInitializers', 'subTableActionBar',{
        name:'subTableActionBar',
        title:'子表操作栏',
        type:'item',
        useComponentProps: UseSubTableActionBarComponentProps
      });
      this.app.schemaInitializerManager.addItem('SubTableActionInitializers','enableActions.emptyAction',{
        type:'item',
        title:'清空',
        Component: 'EmptyActionInitializer'
      })
      this.app.schemaInitializerManager.addItem('SubTableActionInitializers','enableActions.fullScreenAction',{
        type:'item',
        title:'全屏',
        Component: 'FullScreenActionInitializer'
      })
     
  }
}

export default PluginProduceManagerClient;
