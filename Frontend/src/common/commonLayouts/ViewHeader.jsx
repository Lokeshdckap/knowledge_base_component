import React from "react";

export const ViewHeader = (props) => {
  return (
    <div className="bg-[#ffff] w-[100%] ">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] py-[10px]  px-[30px] phone:px-[10px]`}
      >
        <input
          className="text-textPrimary font-bold font-sans text-2xl   bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11  phone:h-8 pl-2 phone:w-[160px] rounded"
          value={props.inputValue}
          readOnly={true}
        />
        <div>
          <button
            type="button"
            className="text-textPrimary border-[1px] border-gray-400 phone:text-sm font-medium rounded-lg text-sm h-9 w-24  phone:w-16 phone:h-7 mr-2 mb-2 "
            onClick={props.handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
