import React from "react";

export const BatchHeader = (props) => {
  return (
    <div className="h-[75px] bg-white shadow-sm">
      <div
        className={`flex justify-between items-center ${props.widths} m-auto pt-[20px]`}
      >
        <div className="text-[20px] font-medium text-textPrimary">{props.batchTitle}</div>
      </div>
    </div>
  );
};
