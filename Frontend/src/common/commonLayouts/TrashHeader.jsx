import React from "react";

export const TrashHeader = (props) => {
  return (
    <div className="h-[75px]">
      <div className={`${props.widths} flex justify-between m-auto items-end pt-5`}>
        <p className="text-xl text-primary"><i className="fa-solid fa-trash text-lg pr-[5px]"></i>Trash</p>
        <button class="bg-primary hover:bg-textPrimary text-white  py-1.5 px-3 rounded">
            Delete All
        </button>
      </div>
    </div>
  );
};
