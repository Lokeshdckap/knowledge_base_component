import React from "react";

export const BatchHeader = (props) => {
  return (
    <div className="h-[75px] bg-white">
      <div
        className={`flex justify-between items-center ${props.widths} m-auto pt-[20px]`}
      >
        <div className="text-xl">{props.batchTitle}</div>
      </div>
    </div>
  );
};
