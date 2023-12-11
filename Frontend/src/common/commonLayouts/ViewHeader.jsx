import React from "react";

export const ViewHeader = (props) => {
  return (
    <div className="bg-[#fbfbff] h-[70px] border-b-[1px]">
      <div
        className={`flex items-center m-auto justify-between relative xl:max-w-[1100px] md:max-w-[1600px] lg:max-w-[1000px]  pt-3`}
      >
        <input
          className="text-textPrimary font-bold font-sans text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 pl-2 rounded"
          value={props.inputValue}
          readOnly={true}
        />
        <div>
          <button
            type="button"
            className="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2 "
            onClick={props.handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
