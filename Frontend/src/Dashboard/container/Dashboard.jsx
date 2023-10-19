import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";
import axiosClient from "../../axios-client";

import EditPage from "../../common/commonLayouts/EditPage";
import EditHeader from "../../common/commonLayouts/EditHeader";


export default function Dashboard() {

  const [state, setState] = useState(false);
  const [team, setTeam] = useState({});
  const [batch, setBatch] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
 

  let teamId = null;

  const handleClick = () => {
    setState((prevState) => !prevState);
  };

  const getTeam = async () => {
    
    await axiosClient.get("/getTeam")
      .then((res) => {
        // console.log(res);
        setTeam(res.data[1]);
        setAllTeam(res.data)

        teamId = res.data[1];
        
        getBatch(teamId.uuid)
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

  useEffect(() => {
    getTeam();

  }, []);




  const addNewBatch = (e) => {

  const teamUUID = {"uuid" :team.uuid};
    axiosClient.post("/addNewBatch", teamUUID)
      .then((res) => {

          getBatch(team.uuid);


        })
        .catch((err) => {
          console.log(err);
        });
  };



  return (
    <div>

      <div className="flex bg-[#ECEDEF] ">
        {state ? (
          <SideNavLarge buttonClicked={handleClick} clickEvent={addNewBatch} batch = {batch} teams={team} allTeamName = {allTeam} />
        ) : (
          <SideNav buttonClicked={handleClick} clickEvent={addNewBatch} teams={team} />
        )}

        <div className="bg-[#F9FAFB] h-[80px] w-screen z-[10px] ">
          <Header
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            teams={team.name}
          />        
          <Main
            widths={state ? "w-[1000px]" : "w-[1120px]"}
            teams={team.name}
            allBatch = {batch}
          />
        </div>

          </div>

      </div>

  );
}
