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
    console.log("hj");
    axiosClient
      .get(`/getAllTeam`)
      .then((res) => {
        console.log(res);
        navigate(`/dashboard/${res.data.getAllTeam[0].team_uuid}`);
     
      })
      .catch((err) => {});
  };

  return (
    <div>Dashboardss</div>
  )
}
