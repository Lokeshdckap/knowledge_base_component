import React, { useState } from "react";
import { DeleteConfirmation } from "../commonComponents/DeleteConfirmation";

export const TrashHeader = (props) => {


  return (
    <div className="h-[80px] bg-white shadow-sm">
      <div className={`w-[1000px] flex justify-between m-auto items-end pt-5 `}>
        <p className="text-xl text-primary">
          <i className="fa-solid fa-trash text-lg pr-[10px]"></i>Trash
        </p>
        <button
          class="bg-primary hover:bg-textPrimary text-white  py-1.5 px-3 rounded"
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
