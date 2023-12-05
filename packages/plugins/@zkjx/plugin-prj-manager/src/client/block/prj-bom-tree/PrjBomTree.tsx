import React from "react"
import { BlockItem, GeneralSchemaDesigner, SchemaSettings, SchemaSettingsDivider, SchemaSettingsRemove, useCollection, useSchemaTemplate } from "@nocobase/client"



export const PrjBomTree = (props)=>{
    return <BlockItem><div>BOM结构</div></BlockItem>
}


PrjBomTree.Decorator = (props)=>{
    return <>{props.children}</>
} 


PrjBomTree.Designer = () => {
    const template = useSchemaTemplate();
    const { name, title, sortable } = useCollection();
    return (
      <GeneralSchemaDesigner template={template} title={title || name}>
        <SchemaSettingsDivider />
        <SchemaSettingsRemove
          removeParentsIfNoChildren
          breakRemoveOn={{
            'x-component': 'Grid',
          }}
        />
      </GeneralSchemaDesigner>
    );
  };