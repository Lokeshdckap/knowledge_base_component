import React from "react";

export const BatchHeader = (props) => {
  return (
    <div className={`h-[75px] bg-[#F9FAFB] `}>
      <div className={`flex justify-between items-center bg-white  h-[75px]  `}>
        <div className={`${props.widths} m-auto `}>
          <div>{props.batchTitle}</div>
        </div>
      </div>
    </div>
  );
};
