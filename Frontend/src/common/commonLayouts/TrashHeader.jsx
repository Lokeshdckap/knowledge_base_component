import React, { useState } from "react";
import { DeleteConfirmation } from "../commonComponents/DeleteConfirmation";

export const TrashHeader = (props) => {


  return (
    <div className="bg-[#fbfbff] border-b-[1px] w-[100%]">
      <div className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] pt-[11px] pb-[11px] pl-[30px] pr-[30px]`}>
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
