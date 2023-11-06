import React from "react";
import { GeneralSchemaDesigner, SchemaSettings } from "../../../schema-settings";
import { useTranslation } from "react-i18next";





export const Designer = () => {
  const { t } = useTranslation();
    return (
      <GeneralSchemaDesigner>
        
        <SchemaSettings.Remove
          key="remove"
          removeParentsIfNoChildren
          confirm={{
            title: t('Delete field'),
          }}
          breakRemoveOn={{
            'x-component': 'Divider',
          }}
        />
      </GeneralSchemaDesigner>
    );
  };