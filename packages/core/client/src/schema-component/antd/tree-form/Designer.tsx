import React from "react";
import { useCollection } from "../../../collection-manager";
import { GeneralSchemaDesigner, SchemaSettings } from "../../../schema-settings";

export const Designer =  ()=>{
    const { name, title } = useCollection();
    return (
      <GeneralSchemaDesigner title={title || name}>
        
        <SchemaSettings.Remove
          removeParentsIfNoChildren
          breakRemoveOn={{
            'x-component': 'Grid'
          }}
        />
      </GeneralSchemaDesigner>
    );
    
}