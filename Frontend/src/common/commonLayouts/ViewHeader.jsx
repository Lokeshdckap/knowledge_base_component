import React from "react";
import { Link } from "react-router-dom";

export const ViewHeader = (props) => {
  return (
    <div className="h-[75px] bg-white">
      <div
        className={`flex items-center justify-between m-auto ${props.widths} pt-3 space-y-2`}
      >
        <input
          className="text-primary font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 pl-2 rounded"
          value={props.inputValue}
          readOnly={true}
        />
        <div>
          <button
            type="button"
            className="text-white bg-primary hover:bg-primary pb-1  font-medium rounded-lg text-lg h-9 w-24 mr-2 mb-2  focus:outline-none "
            onClick={props.handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
