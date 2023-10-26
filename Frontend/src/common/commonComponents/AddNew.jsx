import React, { useState } from "react";
import axiosClient from "../../axios-client";

export default function AddNew(props) {
    // console.log(props.team.uuid);


  return (
    <div>
      <div className="box-border bg-white h-28 w-56 p-4 border-[1px] rounded shadow-lg z-20">
        <p className="text-lg mb-2 pl-2 cursor-pointer" id="" onClick={props.scriptEvent}><i className="fa-regular fa-file pr-2 ml-6"></i>New Script</p>
        <hr className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 `} />
        <p className="text-lg mt-2 pl-2 cursor-pointer" id="batch" onClick={props.click}><i className="fa-regular fa-file pr-2 ml-6"></i>New Batch</p>
      </div>
    </div>
  );
}
