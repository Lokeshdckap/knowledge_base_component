import React from "react";
import { MergeHeader } from "../../common/commonLayouts/MergeHeader";
import { MergeView } from "../../common/commonLayouts/MergeView";

export const MergeComponents = (props) => {
  return (
    <>
      <MergeHeader
        changeEvent={props.handleChange}
        inputValue={props.inputValue}
        setInputValue={props.setInputValue}
        renderScript={props.renderScript}
        HandleShare={props.HandleShare}
        publish={props.publish}
        role={props.role}
        getParticularScript={props.getParticularScript}
      />
      <MergeView />
    </>
  );
};
