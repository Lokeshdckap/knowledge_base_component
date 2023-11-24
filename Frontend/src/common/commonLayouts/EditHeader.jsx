import Link from "antd/es/typography/Link";
import React, { useEffect } from "react";
import { ToastContainer,toast } from "react-toastify";
// import axiosClient from "../../axios-client";
// import { useParams } from "react-router-dom";

export default function EditHeader(props) {

  return (
    <div className="">
      <div
        className={`flex items-center justify-between m-auto ${props.widths} pt-3 space-y-2`}
      >
        <input
          className="text-primary font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 pl-2 rounded"
          value={props.inputValue}
          onChange={(e) => props.changeEvent(e.target.value)}
          // onBlur={props.handleTitleBlur}
        />

        <div>
          <button
            type="button"
            className="text-white bg-primary hover:bg-primary pb-1  font-medium rounded-lg text-lg h-9 w-24 mr-2 mb-2  focus:outline-none "
            onClick={props.clickPublish}
          >
            Save
          </button>
          <Link to={`dashboard/*`}>
            <button
              type="button"
              className="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2 "
              onClick={props.HandleShare}
            >
              Share
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
