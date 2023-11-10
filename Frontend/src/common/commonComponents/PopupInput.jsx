import React from "react";

export const PopupInput = (props) => {
  return (
    <div className="mb-2 mt-5">
      {/* <input type="text" className="border h-[33px] dark:placeholder-gray-400 bg-gray-50 rounded-sm " placeholder="Create team"/> */}
      <label
        for="default-input"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {props.lableName}
      </label>
      <input
        type="text"
        id="default-input"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={props.HandleChange}
        name={props.columnName}
      />
    </div>
  );
};
