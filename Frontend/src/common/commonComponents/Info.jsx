import React from "react";

import file from "../../assets/images/files.png";

export const Info = (props) => {
  return (
    <div className="">
      <div
        className="bg-white shadow-lg w-36 absolute top-8 z-10 right-[-10px] rounded-lg  max-h-[100px] overflow-auto box-border  border-[1px] border-slate-300"
        ref={props.infoRef}
      >
        <p className="text-center font-medium">Sections</p>
        <hr />
        {props.trashInfoDetails?.map((trashScript) => (
          <div
            className=" pl-2 flex items-center space-x-1 hover:bg-primary"
            key={trashScript.uuid}
          >
            <img src={file} alt="" className="w-[17px] h-[18px]" />
            <p className="cursor-pointer p-0.5  pb-1  text-textPrimary hover:text-white text-sm">
              {trashScript.title}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};
