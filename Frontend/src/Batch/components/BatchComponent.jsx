import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";

import axiosClient from "../../axios-client";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { useNavigate, useParams } from "react-router-dom";
import { EditorComponents } from "../../common/commonComponents/EditorComponents";
import { BatchHeader } from "../../common/commonLayouts/BatchHeader";
import { BatchLayouts } from "../../common/commonLayouts/BatchLayouts";
import { ModelPopup } from "../../common/commonComponents/ModelPopup";

export const BatchComponent = () => {
  const navigate = useNavigate();
  const params = useParams();

  //hooks


  //state
  const [formValues, setFormValues] = useState({

  });
  const [errors, setError] = useState({});
  const [teamPopup,setTeamPopup] = useState(false);
  const [state, setState] = useState(true);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);
  const [scripts, setScripts] = useState(null);
  const [batchTitle, setBatchTitle] = useState("");
  const [batchDescription, setbatchDescription] = useState("");


  useEffect(() => {
    getTeam();
    getAllTeam();
    getScripts();

  }, [params.slug,batchTitle]);
  //Event
  const handleClick = () => {
    // setState((prevState) => !prevState);
    if (state) {
      setState(localStorage.setItem("sidePopUp", true));
    } else {

      setState(localStorage.setItem("sidePopUp", false));
    }

  };

  //Api

  const getTeam = async () => {

    await axiosClient
      .get(`/getTeam/${params.uuid}`)
      .then((res) => {
        setTeam(res.data[0]);

        getBatch(params.uuid);
        getScript(params.uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTeam = () => {

    axiosClient.get("/getAllTeam")
      .then((res) => {
        setAllTeam(res.data.getAllTeam);
      })
      .catch((err) => {});
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
    let team_uuid = params.uuid;
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
    let team_uuid = params.uuid;
    let batch_uuid = e.target.id;

    axiosClient
      .post("/addNewScript", { uuid: team_uuid, batch_uuid: batch_uuid })
      .then((res) => {
        getScript(team_uuid);
        getScripts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    getTeam();
    getAllTeam();
    navigate(`/dashboard/${TeamId}`);
  };

  const handleChildrenScripts = async (e) => {
    let team_uuid = params.uuid;
    let batch_uuid = e.target.id;
    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
        setScripts(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScripts = async () => {
    let team_uuid = params.uuid;
    let batch_uuid = params.slug;

    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        // console.log(res.data.result[0].batch.title);
        // console.log(res.data.result[0].batch.description);
        setBatchTitle(res.data.result[0].batch.title);
        setbatchDescription(res.data.result[0].batch.description);
        setScripts(res.data.result);
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const handleSave = () => {
  //   console.log(data);
  // };

  const AddScript = () => {
    let team_uuid = params.uuid;
    let batch_uuid = params.slug;
    axiosClient
      .post("/addNewScript", { uuid: team_uuid, batch_uuid: batch_uuid })
      .then((res) => {
        getScript(team_uuid);
        getScripts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTitleAndDescription = async (event) => {
    if (event.name == "title") {
      const batchTitle = event.value;
      setBatchTitle(batchTitle);
      await axiosClient
        .get(
          `/addBatchTitleAndDescription?param1=${batchTitle}&param2=${batchDescription}&queryParameter=${params.slug}`
        )
        .then((res) => {
          getScripts();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const batchDescription = event.value;
      setbatchDescription(batchDescription);
      await axiosClient
        .get(
          `/addBatchTitleAndDescription?param1=${batchTitle}&param2=${batchDescription}&queryParameter=${params.slug}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };




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
          <BatchHeader
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            batchTitle={batchTitle}
          />
          <BatchLayouts
            widths={state ? "w-[1010px]" : "w-[1120px]"}
            AddScript={AddScript}
            scripts={scripts}
            batchTitle={batchTitle}
            setBatchTitle={setBatchTitle}
            batchDescription={batchDescription}
            setbatchDescription={setbatchDescription}
            changeEvent={handleTitleAndDescription}
            batch={batch}
          />
        </div>
        {teamPopup &&
            <ModelPopup click={handleCancel}  HandleChange={HandleChange} createTeam={createTeam} columnName={"team_name"} error={errors}/>
          }
      </div> 
    </div>
  );
};
