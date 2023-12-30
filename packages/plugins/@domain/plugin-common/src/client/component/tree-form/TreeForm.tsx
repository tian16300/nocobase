import { css } from "@emotion/css";
import React from "react";
import { TreeFormMain } from "./TreeFormMain";
import { LeftTree } from "./LeftTree";
import { Initializer } from "./Initializer";
import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import { CardItem, TableBlockProvider } from "@nocobase/client";

export const TreeForm = (props)=>{

  return <>
   {/* <div></div>
   <div>
    <div></div>
    <div>
       <div></div>
       <div></div>
    </div>
   </div> */}
   <CardItem {...props}>
    {props.children}
    </CardItem>
  </>
};
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
TreeForm.Designer = ()=>{
  return <></>
};

TreeForm.Content = ()=>{

}

TreeForm.Filter = (props)=>{
  return <>
    {props.children}
  </>
}