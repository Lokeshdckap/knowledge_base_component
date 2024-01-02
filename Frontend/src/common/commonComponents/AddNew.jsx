import React, { useState } from "react";
import axiosClient from "../../axios-client";
import folder from "../../assets/images/folderKb.png";
import file from "../../assets/images/files.png";

export default function AddNew(props) {
  return (
    <div>
      <div className="box-border bg-white w-44 border-[1px] border-slate-300 rounded-lg shadow-lg ">
        <div className="w-[150px] m-auto py-2">
          <div
            className="flex items-center space-x-1 py-1.5 cursor-pointer hover:bg-primary hover:text-white hover:rounded"
            onClick={props.scriptEvent}
          >
            <img src={file} alt="" className="w-[17px] h-[18px] ml-1.5" />

            <p className="text-lg  cursor-pointer" id="">
              New Section
            </p>
          </div>

          <hr className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 my-2`} />
          <div
            className="flex items-center space-x-2 py-1.5 cursor-pointer hover:bg-primary hover:text-white hover:rounded"
            onClick={props.click}
          >
            <img src={folder} alt="" className="w-[17px] h-[18px] ml-2.5" />

            <p className="text-lg  cursor-pointer" id="batch">
              New Folder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
