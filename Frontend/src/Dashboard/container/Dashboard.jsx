import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";
import { ModelPopup } from "../../common/commonComponents/ModelPopup";
import { PublishPopup } from "../../common/commonComponents/PublishPopup";

export default function Dashboard() {
  const navigate = useNavigate();

  //hooks

  useEffect(() => {
    getTeam();
    getAllTeam();
  }, []);

  //state
  const [state, setState] = useState(true);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [scriptCount, setScriptCount] = useState([]);
  const [script, setScript] = useState([]);
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);


  //create Team state
  const [teamPopup,setTeamPopup] = useState(false);
  const [formValues, setFormValues] = useState({

  });
  const [errors, setError] = useState({});

    
  
  //

  //Event
  const handleClick = () => {
    setState((prevState) => !prevState);
    // if(state)
    // {
    //   setState(localStorage.setItem("sidePopUp",true))
    // }
    // else{

    //   // localStorage.setItem("sidePopUp",true);
    //   setState(localStorage.setItem("sidePopUp",false))
    // }
    // // console.log(localStorage.setItem("sidePopUp",true));
    // console.log(state);
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
      .catch((err) => {});
  };

  const getBatch = async (teamuuid) => {
    await axiosClient
      .get(`/getBatch/${teamuuid}`)
      .then((res) => {
        console.log(res);
        setBatch(res.data.batchs);
        setScriptCount(res.data.results);
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

  // create team

  const handleCancel = () =>{
    setTeamPopup(false);
  
  }

  const handleCreate = () =>{
    setTeamPopup(true);
  }

  const HandleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };



  const createTeam = () => {
    // alert("je")

    const validationErrors = {};

    if (!formValues.team_name) {
      validationErrors.team_name = "Team is required";
    }
      
  setError(validationErrors);
  if (Object.keys(validationErrors).length === 0) {

      axiosClient.post("/team",formValues)
      .then((res) => {

        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {

            // console.log(response);
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
            console.log(value);

            error[keys] = value;

            setError(error);

          } 
          else {

            console.error("Error:", response.status);
          }
        });
    
  }
}






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
            handleCreate={handleCreate}
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
            scriptCount={scriptCount}
            scripts={script}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
          />
        </div>
          {teamPopup &&
            <ModelPopup click={handleCancel}  HandleChange={HandleChange} createTeam={createTeam} columnName={"team_name"} error={errors}/>
          }
      </div>
    </div>
  );
}
