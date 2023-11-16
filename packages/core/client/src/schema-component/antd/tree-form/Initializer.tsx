import { useTranslation } from "react-i18next";
import { useCollectionManager } from "../../../collection-manager";
import { SchemaOptionsContext } from "@formily/react";
import { useContext } from "react";
import { useGlobalTheme } from "../../../global-theme";
import { DataBlockInitializer } from "../../../schema-initializer";
import { FormOutlined } from "@ant-design/icons";
import { createSchema } from "./schema/createSchema";
import React from "react";

export const Initializer = (props) => {
    const { insert } = props;
    return (
      <DataBlockInitializer
        {...props}
        componentType={'TreeForm'}
        icon={<FormOutlined />}
        onCreateBlockSchema={async ({ item }) => {
          const name = item.name;
          insert(
            createSchema({
              collection: name
            }),
          );
        }}
      ></DataBlockInitializer>
    );
  };