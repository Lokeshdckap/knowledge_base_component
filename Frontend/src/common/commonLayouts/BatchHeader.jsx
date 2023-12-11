import React from "react";

export const BatchHeader = (props) => {
  return (
    <div className="bg-[#ffff] h-[70px] border-b-[1px]">
      <div
        className={`flex items-center  m-auto justify-between  relative md:max-w-[1600px] xl:max-w-[1100px] lg:max-w-[1000px]  pt-4`}
      >
        <div className="text-[22px] font-medium text-textPrimary">
          {props.batchTitle}
        </div>
      </div>
    </div>
  );
};
