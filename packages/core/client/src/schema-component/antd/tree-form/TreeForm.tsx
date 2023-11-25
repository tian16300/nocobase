import { css } from "@emotion/css";
import { TableBlockProvider } from "../../../block-provider";
import { CardItem } from "../card-item";
import React from "react";
import { Designer } from "./Designer";
import { TreeFormMain } from "./TreeFormMain";
import { LeftTree } from "./LeftTree";
import { Initializer } from "./Initializer";
import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";

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