import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import HashLoader from "react-spinners/HashLoader";

export const Dashboards = () => {
  const navigate = useNavigate();

  //hooks

  useEffect(() => {

      getAllTeam();
  }, []);

  const getAllTeam = () => {
    axiosClient
      .get(`/api/teams/getAllTeam`)
      .then((res) => {
        if(res.status == 200){
          if (
            res.data.getAllTeam.length > 0 &&
            localStorage.getItem("ACCESS_TOKEN")
          ) {
            navigate(`/dashboard/${res.data.getAllTeam[0].team_uuid}`);
          } else if (localStorage.getItem("ACCESS_TOKEN")) {
            navigate("/teampage");
          } 
        }
        else {
          console.log("sdfsdf");
          navigate("/signin");
        }
       
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 401) {
          window.location.reload("/signin");
        } else {
          console.error("Error:", response?.status);
        }
      });
  };

  return (
    <>
      <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
      <div className="">
        <p className="absolute top-[48%] left-[48%] z-50 ">
          <HashLoader color="#3197e8" />
        </p>
      </div>
    </>
  );
};
