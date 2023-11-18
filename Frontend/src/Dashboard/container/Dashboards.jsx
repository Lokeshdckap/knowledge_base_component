import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

export const Dashboards = () => {



  const navigate = useNavigate();



  //hooks

  useEffect(() => {
    getAllTeam();
  }, []);

  const getAllTeam = () => {
    console.log("ghjhk");
    axiosClient
      .get(`/getAllTeam`)
      .then((res) => {
        if(res.data.getAllTeam.length > 0){
          navigate(`/dashboard/${res.data.getAllTeam[0].team_uuid}`);
        }
        else{
         navigate("/teampage")
        }
      })
      .catch((err) => {});
  };

  return (
    <div>Dashboardss</div>
  )
}
