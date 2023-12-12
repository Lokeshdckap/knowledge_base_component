import Link from "antd/es/typography/Link";
import React, { useEffect } from "react";



export default function EditHeader(props) { 
  return (
  <div className="bg-[#ffff] w-[100%] border-b-[1px]"
  >
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] pt-[11px] pb-[11px] pl-[30px] pr-[30px]`}
      >
        <input
          className="text-[#444449] font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 pl-2 rounded"
          value={props.inputValue}
          onChange={(e) => props.changeEvent(e.target.value)}
        />
        <div className="flex items-center justify-between max-w-[200px] w-[100%]">
          {props.publish &&
            props.publish.is_published ? (
              <button
              type="button"
              className="text-white bg-primary hover:bg-primary pb-1 font-medium rounded-lg text-lg h-9 w-24   focus:outline-none "
            >
              Edit
            </button>
            ):(
              <button
              type="button"
              className="text-white bg-primary hover:bg-primary  font-medium text-lg h-9 w-24  focus:outline-none rounded "
              onClick={props.clickPublish}
            >
              Save
            </button>
            )
          }
          <Link to={`dashboard/*`}>
            <button
              type="button"
              className="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24  "
              onClick={props.HandleShare}
            >
              Share
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
