import Link from "antd/es/typography/Link";
import React, { useEffect } from "react";



export default function EditHeader(props) { 
  return (
  <div className="bg-[#ffff] w-[100%]"
  >
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] py-[10px]  px-[30px] phone:px-[10px]`}
      >
        <input
          className="text-[#444449] font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 phone:h-8 pl-2 phone:w-[160px] rounded"
          value={props.inputValue}
          onChange={(e) => props.changeEvent(e.target.value)}
        />
        <div className="flex items-center justify-between max-w-[200px] phone:max-w-[140px]  w-[100%]">
          {props.publish &&
            props.publish.is_published ? (
              <button
              type="button"
              className="text-white bg-primary hover:bg-primary pb-1 font-medium rounded-lg text-lg h-9 w-24  phone:w-14 phone:h-6 focus:outline-none "
            >
              Edit
            </button>
            ):(
              <button
              type="button"
              className="text-white bg-primary hover:bg-primary  font-medium text-lg phone:text-sm h-9 w-24 phone:w-16 phone:h-7 focus:outline-none rounded "
              onClick={props.clickPublish}
            >
              Save
            </button>
            )
          }
          <Link to={`dashboard/*`}>
            <button
              type="button"
              className="text-textPrimary border-[1px] phone:text-sm border-gray-400 font-medium rounded-lg text-sm h-9 w-24 phone:w-16 phone:h-7 "
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
