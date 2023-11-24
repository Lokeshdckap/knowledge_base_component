import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { TeamProfile } from "./TeamProfile";

export const TeamSideNav = (props) => {

  const params = useParams();

  return (
    <div>
      <div className=" ">
        <div className="bg-white h-screen overflow-auto w-56 shadow-md">
          <div className="bg-slate-300 h-14">
            <p className="w-20 m-auto pt-4 truncate">
              {props.team && props.team}
            </p>
          </div>
          <div className="w-48 m-auto h-[532px] ">
            <p className="text-textPrimary font-bold text-lg mt-3 ">
              Team Setting
            </p>
            <Link
              to={`/dashboard/${params.uuid}/teamsetting`}
            >
              <div
                className={`flex space-x-2 items-center mt-2 p-2 hover:bg-[#e5e8f1] cursor-pointer rounded ${
                  params.slug == "teamsetting" && "bg-[#e5e8f1]"
                }`}
              >
                <i className="fa-solid fa-people-group"></i>
                <p>Team Profile</p>
              </div>
            </Link>
            <Link
              to={`/dashboard/${params.uuid}/activeusers`}
            >
              <div
                className={`flex space-x-2 items-center p-2 mt-2 hover:bg-[#e5e8f1] cursor-pointer rounded ${
                  params.slug == "activeusers" && "bg-[#e5e8f1]"
                }`}
              >
                <i className="fa-solid fa-user-group"></i>
                <p>Active users</p>
              </div>
            </Link>
          </div>
          <div className="bg-primary h-16 p-5  flex items-center space-x-2">
            <i className="fa-solid fa-arrow-left text-white"></i>
            <Link to={`/dashboard/${params.uuid}`}> <p className="text-white">Back to dashboard</p></Link>
          </div>
        </div>
      </div>
    </div>
  );
};
