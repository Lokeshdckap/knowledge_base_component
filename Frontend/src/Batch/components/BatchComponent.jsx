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

export const BatchComponent = () => {
  const navigate = useNavigate();
  const param = useParams();

  //hooks

  useEffect(() => {
    getTeam();
    getAllTeam();
    getScripts();
    console.log("hello");
  }, [param.uuid]);

  //state
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

  //Event
  const handleClick = () => {
    // setState((prevState) => !prevState);
    if (state) {
      setState(localStorage.setItem("sidePopUp", true));
    } else {
      // localStorage.setItem("sidePopUp",true);
      setState(localStorage.setItem("sidePopUp", false));
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
      .catch((err) => {});
  };

  const getBatch = async (teamuuid) => {
    await axiosClient
      .get(`/getBatch/${teamuuid}`)
      .then((res) => {
        console.log(res);
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
        getScripts();
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
        setScripts(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScripts = async () => {
    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = param.uuid;
    // console.log(batch_uuid,"scr");

    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setBatchTitle(res.data.result[0].batch.title);
        setbatchDescription(res.data.result[0].batch.description);
        setScripts(res.data.result);
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSave = () => {
    console.log(data);
  };

  const AddScript = () => {
    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = param.uuid;
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
          `/addBatchTitleAndDescription?param1=${batchTitle}&param2=${batchDescription}&queryParameter=${param.uuid}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const batchDescription = event.value;
      setbatchDescription(batchDescription);
      await axiosClient
        .get(
          `/addBatchTitleAndDescription?param1=${batchTitle}&param2=${batchDescription}&queryParameter=${param.uuid}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
      </div>
    </div>
  );
};
