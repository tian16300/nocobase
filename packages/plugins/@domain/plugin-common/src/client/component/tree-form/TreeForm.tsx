import { css } from "@emotion/css";
import React from "react";
import { TreeFormMain } from "./TreeFormMain";
import { LeftTree } from "./LeftTree";
import { Initializer } from "./Initializer";
import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import { CardItem, TableBlockProvider } from "@nocobase/client";

export const TreeForm = ()=>{};
TreeForm.Initializer = Initializer;
TreeForm.Main = TreeFormMain;
TreeForm.Tree = LeftTree;
TreeForm.Decorator = TableBlockProvider;
TreeForm.Wrap = (props) => {
    return (
      <CardItem
        {...props}
        className={css`
          .ant-card-body {
            padding: 0;
          }
        `}
      >
        {props.children}
      </CardItem>
    );
  };
TreeForm.Designer = TreeFormBlockDesigner;