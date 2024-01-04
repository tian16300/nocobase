import { css } from "@emotion/css";
import React from "react";
// import { TreeFormBlockDesigner } from "./TreeFormBlockDesigner";
import { CardItem, TableBlockDesigner, TableBlockProvider, tableActionInitializers } from "@nocobase/client";

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
   {/* <CardItem {...props}> */}
    {props.children}
    {/* </CardItem> */}
  </>
};

// TreeForm.Tree = LeftTree;
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

TreeForm.Tree = ({children})=>{
  return <>{children}</>
 }

TreeForm.Content = ({children})=>{
 return <>{children}</>
}
TreeForm.Form = ({children})=>{
  return <>{children}</>
 }
TreeForm.Filter = (props)=>{
  return <>
    {props.children}
  </>
}


export const TreeFormBlockProvider = TableBlockProvider;
export const TreeFormBlockDesigner = TableBlockDesigner;

export const TreeFormActionInitializers = tableActionInitializers