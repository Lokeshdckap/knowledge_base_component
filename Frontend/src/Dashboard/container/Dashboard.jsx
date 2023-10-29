import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";

import axiosClient from "../../axios-client";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { useNavigate } from "react-router-dom";
import { EditorComponents } from "../../common/commonComponents/EditorComponents";
import { BatchHeader } from "../../common/commonLayouts/BatchHeader";
import { BatchLayouts } from "../../common/commonLayouts/BatchLayouts";

export default function Dashboard() {
  const navigate = useNavigate();

  //hooks

  useEffect(() => {
    getTeam();
    getAllTeam();
   
   
  }, []);

 


  //state
  const [state, setState] = useState(localStorage.getItem("sidePopUp"));
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);

  //Event
  const handleClick = () => {
    // setState((prevState) => !prevState);    
    if(state)
    {
      setState(localStorage.setItem("sidePopUp",true))
    }
    else{

      // localStorage.setItem("sidePopUp",true);
      setState(localStorage.setItem("sidePopUp",false))
    }
    // console.log(localStorage.setItem("sidePopUp",true));
    console.log(state);
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

    axiosClient
      .post("/addNewBatch", { uuid: team_uuid })
      .then((res) => {
        getBatch(team_uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewScript = (e) => {
    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = e.target.id;

    axiosClient
      .post("/addNewScript", { uuid: team_uuid, batch_uuid: batch_uuid })
      .then((res) => {
        getScript(team_uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    localStorage.removeItem("team_uuid");
    localStorage.setItem("team_uuid", TeamId);
    getTeam();
    getAllTeam();
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}`);
  };

  const handleChildrenScripts = async (e) => {
    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = e.target.id;

    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSave = () => {
    console.log(data);
  };

  const getValue = (data) => {
    setData(data);
  };

  return (
    <div className="relative">
      <div className="flex bg-[#ECEDEF] ">

       {console.log(state)}
        {state ? (
          <SideNavLarge
            buttonClicked={handleClick}
            team={team}
            allTeams={allTeam}
            clickSwitch={switchTeamEvent}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
            batches={batch}
            scripts={script}
            handleChildrenScripts={handleChildrenScripts}
            childScript={childScript}
          />
        ) : (
          <SideNav
            buttonClicked={handleClick}
            team={team}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
          />
        )}

        <div className="bg-[#F9FAFB] h-[80px] w-screen z-[10px] ">

          <Header widths={state ? "w-[1000px]" : "w-[1160px]"} team={team} />

          <Main
            widths={state ? "w-[1010px]" : "w-[1120px]"}
            team={team}
            batches={batch}
            scripts={script}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="bg-primary opacity-[0.5] w-[1294px] h-[664px] absolute top-0 left-0"></div>
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
      </div> */
}
