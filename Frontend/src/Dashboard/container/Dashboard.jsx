import React, { useEffect, useRef, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { ModelPopup } from "../../common/commonComponents/ModelPopup";
import { PublishPopup } from "../../common/commonComponents/PublishPopup";
import { InviteUsers } from "../../common/commonLayouts/InviteUsers";
import { Search } from "../../common/commonLayouts/Search";

import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export default function Dashboard() {
  const navigate = useNavigate();
  const params = useParams();
  const searchInpRef = useRef();



  //hooks

  useEffect(() => {
    getTeam();
    getAllTeam();
  }, [params.uuid]);



  //state
  const [state, setState] = useState(true);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [scriptCount, setScriptCount] = useState([]);
  const [script, setScript] = useState([]);
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);

  const [loading, setLoading] = useState(false);

  const [inviteError, setInviteError] = useState(null);


  //create Team state
  const [teamPopup, setTeamPopup] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");


  //search states
  const [searchPopup, setsearchPopup] = useState(false);
  const [searchData, setSearchData] = useState(null);


  //state for overflow 
  const [overflowState,setOverflowState] = useState("overflow-auto");

  //toaster


  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };



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
    axiosClient
      .post("/addNewBatch", { uuid: params.uuid })
      .then((res) => {
        getBatch(params.uuid);
        showToastMessage("New Batch added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewScript = (e) => {
    let batch_uuid = e.target.id;

    axiosClient
      .post("/addNewScript", { uuid: params.uuid, batch_uuid: batch_uuid })
      .then((res) => {
        getScript(params.uuid);
        showToastMessage("New Script added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    setTeamPopup(false);

    getTeam();
    getAllTeam();
    navigate(`/dashboard/${TeamId}`);
  };

  const handleChildrenScripts = async (e) => {
    let batch_uuid = e.target.id;

    await axiosClient
      .get(`/getBatchAndScripts/${params.uuid}/${batch_uuid}`)
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

  const handleCancel = () => {
    setTeamPopup(false);
  };

  const handleCreate = () => {
    setTeamPopup(true);
  };

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
      axiosClient
        .post("/team", formValues)
        .then((res) => {
          setTeamPopup(false);
          getAllTeam();
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
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };


  // search

  const HandleSearch = () => {
    setsearchPopup(true);
    console.log("ehey");
  };

  const searchEvent = async (e) => {
    let value = e.target.value;

    await axiosClient
      .get(`${params.uuid}/search/items?q=${value}`)
      .then((res) => {
        if (res.data.length > 0) {
          setSearchData(res.data);
        } else {
          setSearchData(null);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 404) {
          setSearchData(null);
        } else {
          console.error("Error:", response.status);
        }
      });
  };


  //invite

  const handleInvite = () => {
    setInvitePopup(true);
  };

  const handleInviteUsers = () => {

    setLoading(true);
    console.log(inviteEmail);
    console.log(role);
    if(!inviteEmail.trim()) {
    setLoading(false);
      
      setInviteError("Email is required");
    }
    else if(!role.trim()) {
      setLoading(false);
        
        setInviteError("Role is required");
      }
    else{
    axiosClient
      .post("/inviteUsers", {
        email: inviteEmail,
        role: role,
        team_uuid: params.uuid,
      })
      .then((res) => {
        showToastMessage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          setInviteError(response.data);
          setTimeout(() => {
            setInviteError("");
          }, 1500);
          setLoading(false);
        } else {
          console.error("Error:", response.status);
        }
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex bg-[#ECEDEF]">
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
            setInvitePopup={setInvitePopup}
            overflowState={overflowState}
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
          <Header
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            team={team}
            HandleSearch={HandleSearch}
            searchInpRef={searchInpRef}
          />
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
        {teamPopup && (
          <ModelPopup
            click={handleCancel}
            HandleChange={HandleChange}
            createTeam={createTeam}
            columnName={"team_name"}
            error={errors}
          />
        )}
        {invitePopup && (
          <InviteUsers
          team={team}
            invitePopup={invitePopup}
            setInvitePopup={setInvitePopup}
            setInviteEmail={setInviteEmail}
            inviteEmail={inviteEmail}
            setRole={setRole}
            handleInviteUsers={handleInviteUsers}
            inviteError={inviteError}
          />
        )}
        {searchPopup && (
          <Search
            searchEvent={searchEvent}
            searchData={searchData}
            setsearchPopup={setsearchPopup}
            searchInpRef={searchInpRef}
          />
        )}

        <ToastContainer />

        {loading && (
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        )}
      </div>
    </div>
  );
}
