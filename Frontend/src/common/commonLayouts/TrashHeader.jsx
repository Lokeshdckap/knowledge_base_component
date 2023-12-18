import React, { useState } from "react";
import { DeleteConfirmation } from "../commonComponents/DeleteConfirmation";

export const TrashHeader = (props) => {

  return (
    <div className="bg-[#fbfbff] border-b-[1px] w-[100%]">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] pt-[11px] pb-[11px] pl-[30px] pr-[30px]`}
      >
        <p className="text-xl text-primary">
          <i className="fa-solid fa-trash text-lg pr-[10px]"></i>Trash
        </p>
        {props.trashData?.length > 0 &&
          <button
            className="bg-primary hover:bg-textPrimary text-white  py-1.5 phone:py-[3px] px-3 phone:px-[8px] rounded"
            onClick={props.deleteAllPopup}
            disabled={props.role == 2 ? true : false}
          >
            Delete All
          </button>
        }
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
