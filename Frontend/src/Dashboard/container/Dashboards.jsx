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
    console.log("res");
    axiosClient
      .get(`/api/teams/getAllTeam`)
      .then((res) => {
       
        console.log(res,"jh");
        if (res.data.getAllTeam.length > 0) {
          navigate(`/dashboard/${res.data.getAllTeam[0].team_uuid}`);
        } else {
          navigate("/teampage");
        }
      })
      .catch((err) => {
        const response = err.response;
        console.log(response.status);
        if (response && response?.status === 401) {

        //   // localStorage.removeItem("ACCESS_TOKEN");
          navigate("/signin");
        } 
        // else {
        //   console.error("Error:", response?.status);
        // }
      });
  };

  return (
    <>
      <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
      <p className="absolute top-72 left-[600px] z-40">
        <HashLoader color="#3197e8" />
      </p>
    </>
  );
};
