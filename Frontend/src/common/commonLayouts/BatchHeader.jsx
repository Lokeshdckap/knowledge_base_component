import React from "react";

export const BatchHeader = (props) => {
  return (
    <div className="bg-[#ffff]  w-[100%]">
      <div
        className={`flex items-center  m-auto justify-between  relative w-[100%]  2xl:py-[30px] pt-[15.5px] pb-[15.5px] pl-[30px] pr-[30px]`}
      >
        <div className="text-[22px] font-medium text-textPrimary">
          {props.batchTitle}
        </div>
      </div>
    </div>
  );
};
