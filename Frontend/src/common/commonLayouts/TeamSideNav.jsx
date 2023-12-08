import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";


export const TeamSideNav = (props) => {

  const params = useParams();

  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    team();
  }, [params]);

  const team = () => {
    axiosClient
      .get(`/api/teams/getTeam/${params.uuid}`)
      .then((res) => {
        setTeamName(res.data.Teams[0].name);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div>
      <div className="bg-white h-screen overflow-auto w-56 shadow-md">
        <div className="bg-slate-300 h-14">
          <p className="w-20 m-auto pt-4 truncate">
            {teamName && teamName}
          </p>
        </div>
        <div className="w-48 m-auto  xl:h-[464px] lg:h-[500px]">
          <p className="text-textPrimary font-bold text-lg mt-3 ">
            Team Setting
          </p>
          <Link to={`/setting/${params.uuid}/teamsetting`}>
            <div
              className={`flex space-x-2 items-center mt-2 p-2 hover:bg-[#e5e8f1] cursor-pointer rounded ${
                window.location.pathname ==
                  `/setting/${params.uuid}/teamsetting` && "bg-[#e5e8f1]"
              }`}
            >
              <i className="fa-solid fa-people-group"></i>
              <p>Team Profile</p>
            </div>
          </Link>
          <Link to={`/setting/${params.uuid}/activeusers`}>
            <div
              className={`flex space-x-2 items-center p-2 mt-2 hover:bg-[#e5e8f1] cursor-pointer rounded ${
                window.location.pathname ==
                  `/setting/${params.uuid}/activeusers` && "bg-[#e5e8f1]"
              }`}
            >
              <i className="fa-solid fa-user-group"></i>
              <p>Active users</p>
            </div>
          </Link>
          <div>
            <p className="text-textPrimary font-bold text-lg mt-3 ">Personal</p>
            <Link to={`/setting/${params.uuid}/profile`}>
              <div
                className={`flex space-x-2 items-center p-2 mt-2   hover:bg-[#e5e8f1] cursor-pointer rounded ${
                  window.location.pathname ==
                    `/setting/${params.uuid}/profile` && "bg-[#e5e8f1]"
                }`}
              >
                <i className="fa-solid fa-user-group"></i>
                <p>Profile</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-primary h-16 p-5  flex items-center space-x-2">
          <i className="fa-solid fa-arrow-left text-white"></i>
          <Link to={`/dashboard/${params.uuid}`}>
            {" "}
            <p className="text-white">Back to Home</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
