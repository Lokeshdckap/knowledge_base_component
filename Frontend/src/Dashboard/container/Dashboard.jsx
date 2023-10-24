import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";

import axiosClient from "../../axios-client";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {


  const navigate = useNavigate();

   //hooks

   useEffect(() => {
    getTeam();
    getAllTeam();
  }, []);

  const [state, setState] = useState(false);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);

//Event
  const handleClick = () => {
    setState((prevState) => !prevState);
  };

//Api

  const getTeam = async () => {

    let teamUUID = localStorage.getItem("team_uuid");
    await axiosClient
      .get(`/getTeam/${teamUUID}`)
      .then((res) => {
        setTeam(res.data[0]);
        getBatch(teamUUID);
        getScript(teamUUID);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTeam = () => {
    axiosClient
      .get(`/getAllTeam`)
      .then((res) => {
        setAllTeam(res.data.getAllTeam);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBatch = async (teamuuid) => {

    await axiosClient
      .get(`/getBatch/${teamuuid}`)
      .then((res) => {

        setBatch(res.data.batchs);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  const getScript = async (teamuuid) => {

    await axiosClient
      .get(`/getScript/${teamuuid}`)
      .then((res) => {
        setScript(res.data.script);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  const addNewBatch = (e) => {

    let team_uuid = localStorage.getItem("team_uuid");
    

    axiosClient.post("/addNewBatch", {"uuid" : team_uuid})
      .then((res) => {
          getBatch(team_uuid);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const addNewScript = () => {
    let team_uuid = localStorage.getItem("team_uuid");
  
    axiosClient.post("/addNewScript",{"uuid" : team_uuid})
    .then((res) => {
          getScript(team_uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    localStorage.removeItem("team_uuid");
    localStorage.setItem("team_uuid", TeamId);
    getTeam();
    getAllTeam();
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}`)

  };

  


  return (
    <div className="relative">
      <div className="flex bg-[#ECEDEF] ">


        {state ? (
          <SideNavLarge
            buttonClicked={handleClick}
            team={team}
            allTeams={allTeam}
            clickSwitch={switchTeamEvent}
            addBatchEvent = {addNewBatch}
            scriptEvent={addNewScript}
            batches={batch}
            scripts={script}

          />
        ) : (
          <SideNav buttonClicked={handleClick} team={team} addBatchEvent = {addNewBatch} scriptEvent={addNewScript} />
        )}

        <div className="bg-[#F9FAFB] h-[80px] w-screen z-[10px] ">
          <Header
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            team={team}
          />
          {/* <EditHeader widths={state ? "w-[1040px]" : "w-[1200px]"} /> */}
          <Main
            widths={state ? "w-[1000px]" : "w-[1120px]"}
            team={team} batches={batch} scripts={script}
            addBatchEvent = {addNewBatch} scriptEvent={addNewScript}
          />
          {/* <EditPage widths={state ? "w-[800px]" : "w-[933px]"} /> */}
        </div>
      </div>
    </div>
  );
}





































      {/* <div className="bg-primary opacity-[0.5] w-[1294px] h-[664px] absolute top-0 left-0"></div>
      <div className=" absolute left-0 top-0 ">
        <div className="bg-white h-[300px] w-[600px] ml-[350px] mt-[150px] rounded">
          <div className="">
            <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer text-end"></i>
          </div>
          <div className="flex pt-20 items-center space-x-2">
            <i class="fa-solid fa-user-plus"></i>
            <p>Create Team</p>
          </div>
          <p>Teamwork makes what's impossible to do alone possible.</p>
          <div>
            <input type="text" className="border h-[33px] dark:placeholder-gray-400 bg-gray-50 rounded-sm " placeholder="Create team"/>
          </div>
         
        </div>
      </div> */}