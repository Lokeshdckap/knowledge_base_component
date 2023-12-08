import React, { useState } from "react";
import { DeleteConfirmation } from "../commonComponents/DeleteConfirmation";

export const TrashHeader = (props) => {


  return (
    <div className="bg-[#fbfbff] h-[70px] border-b-[1px]">
      <div className={`flex items-center m-auto justify-between relative xl:max-w-[1100px] lg:max-w-[1000px] pt-3`}>
        <p className="text-xl text-primary">
          <i className="fa-solid fa-trash text-lg pr-[10px]"></i>Trash
        </p>
        <button
          className="bg-primary hover:bg-textPrimary text-white  py-1.5 px-3 rounded"
          onClick={props.deleteAllPopup}
        >
          Delete All
        </button>
      </div>
      {props.deletePopup && (
        <DeleteConfirmation
          deleteAllPopup={props.deleteAllPopup}
          handleDelete={props.handleDelete}
        />
      )}
    </div>
  );
};
