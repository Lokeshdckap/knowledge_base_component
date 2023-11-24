import React, { useEffect, useRef, useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import AddNew from "../commonComponents/AddNew";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { ModelPopup } from "../commonComponents/ModelPopup";
import { InviteUsers } from "./InviteUsers";
import { useMyContext } from "../../context/AppContext";

export default function SideNavLarge(props) {
  //navigate
  const navigate = useNavigate();

  const {
    moveState,
    handleMove,
    getTeam,
    getAllTeam,
    teamName,
    setTeam,
    allTeam,
    setAllTeam,
    batch,
    getBatch,
    getScript,
    script,
    setOverState,
    setChildScript,
    overState,
    childScript,
    addNewBatch,
    setLoading,
    loading,
    setAddNewMenu,
    AddNewMenu,
    setPopup,
    popUp,
    showToastMessage,
    addNewScript,
    getLoadScript,
  } = useMyContext();

  //param
  const params = useParams();

  //ref
  const teamRef = useRef(null);
  const iconRef = useRef(null);

  const AddIconRef = useRef(null);
  const AddNewRef = useRef(null);

  //TeamState
  const [teamDropDown, setteamDropDown] = useState(false);

  //Script
  const [overScriptState, setOverScriptState] = useState(null);

  //create Team state
  const [teamPopup, setTeamPopup] = useState(false);

  //create Team state for error
  const [errors, setError] = useState({});
  const [formValues, setFormValues] = useState({});

  //Invite Users State

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");

  const [inviteError, setInviteError] = useState(null);

  //

  useEffect(() => {
    getTeam();
    getAllTeam();
  }, [params.uuid]);

  //

  //Team Switch Event

  const switchTeamEvent = async (e) => {
    const teamId = e.target.id;
    if (teamId !== params.uuid) {
      setLoading(true);
      await axiosClient
        .get(`/switchTeam/${teamId}`)
        .then((res) => {
          if (res.status == 200) {
            navigate(`/dashboard/${res.data.selectedTeam.uuid}`);
            setLoading(false);
            setteamDropDown(false);
            showToastMessage("Team Switched");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //Batch Hover
  const handleMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverState(targetId);
  };

  const handleMouseLeave = () => {
    setOverState(null);
  };

  //Batch Popup
  const addPopUp = (e) => {
    let targetId = e.target.id;
    if (popUp) {
      setPopup(null);
    } else {
      setPopup(targetId);
    }
  };

  //Redirect to Batch
  const redirectToBatch = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/b/${TargetScriptId}`);
  };
  //

  //Script Hover
  const handleScriptMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverScriptState(targetId);
  };

  const handleScriptMouseLeave = () => {
    setOverScriptState(null);
  };
  //Redirect to Script
  const redirectToScript = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/s/${TargetScriptId}`);
  };

  //Create Team Functionalities
  const HandleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const handleCancel = () => {
    setTeamPopup(false);
  };

  const createTeam = () => {
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

  const handleInviteUsers = () => {
    setLoading(true);
    if (!inviteEmail.trim()) {
      setLoading(false);

      setInviteError("Email is required");
    } else if (!role.trim()) {
      setLoading(false);

      setInviteError("Role is required");
    } else {
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

  useEffect(() => {
    setOverState(props.overStates);
    const closeOnOutsideClick = (e) => {
      if (
        teamDropDown &&
        !teamRef.current.contains(e.target) &&
        e.target !== iconRef.current
      ) {
        setteamDropDown(false);
      }
      if (
        AddNewMenu &&
        !AddNewRef.current.contains(e.target) &&
        e.target !== AddIconRef.current
      ) {
        setAddNewMenu(false);
      }
    };
    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [teamDropDown, AddNewMenu, props.overStates]);

  const handleChildrenScripts = async (e) => {
    let batch_uuid = e.target.id;

    getLoadScript(params.uuid, batch_uuid);
  };

  return (
    <div className="bg-primary h-screen  overflow-auto w-[280px] z-10 ">
      <div>
        <img src={mainLogo} alt="" className="max-w-md m-auto mt-4 h-10" />
      </div>
      <div
        className="bg-slate-300 h-6 w-6 rounded-full absolute mt-4 left-[219px] cursor-pointer"
        onClick={handleMove}
      >
        <span className="material-symbols-outlined cursor-pointer">
          chevron_left
        </span>
      </div>

      <div className="">
        <div className="mt-8 w-[200px] m-auto flex items-center space-x-4 ">
          <span className="material-symbols-outlined text-white">group</span>
          <p className="text-xl font-bold w-[100%] text-white  truncate ">
            <Link to={`/dashboard/${params.uuid}`}>{teamName}'s Team</Link>
          </p>

          {teamDropDown ? (
            <i
              className="fa-solid fa-angle-up text-white cursor-pointer"
              onClick={() => setteamDropDown(false)}
              ref={iconRef}
            ></i>
          ) : (
            <i
              className="fa-solid fa-angle-down text-white cursor-pointer"
              onClick={() => setteamDropDown(true)}
            ></i>
          )}
        </div>
        {teamDropDown && (
          <div
            className="box-border bg-white  w-52 p-4 border-[1px] rounded-xl shadow-lg absolute left-48 top-32 z-10"
            ref={teamRef}
          >
            <div>
              <p className="font-semibold text-textPrimary">Change Team</p>
              {allTeam && (
                <ul className={`space-y-2 pt-1 max-h-[200px] overflow-auto`}>
                  {allTeam.map((team) => (
                    <li
                      key={team.uuid}
                      id={team.team_uuid}
                      onClick={switchTeamEvent}
                      className="text-base cursor-pointer hover:text-purple-400 "
                    >
                      {team.name}
                      {team.name == teamName && (
                        <i className="fa-solid fa-circle-check text-primary pl-1"></i>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <hr
                className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
              />
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <i className="fa-solid fa-sliders"></i>
                  <p className="pl-1">
                    <Link to={`/dashboard/${params.uuid}/teamsetting`}>
                      Team setting
                    </Link>
                  </p>
                </div>
                <div
                  className="flex items-center mb-2"
                  onClick={() => setInvitePopup(true)}
                >
                  <i className="fa-solid fa-user-plus cursor-pointer"></i>
                  <p className="pl-1 cursor-pointer">Invite Teamates</p>
                </div>
              </div>
            </div>
            <hr
              className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
            />
            <div
              className="mt-2 flex items-center mb-2 cursor-pointer"
              onClick={() => setTeamPopup(true)}
            >
              <i className="fa-solid fa-plus"></i>
              <p className="pl-1">Create Team</p>
            </div>
          </div>
        )}
        <ul className="mt-5 space-y-1 h-[360px] overflow-auto ">
          {batch.map((batch) => (
            <div className="">
              <li
                key={batch.id}
                id={batch.uuid}
                className={`text-[#BCD1FF] pl-8 cursor-pointer hover:bg-cyan-950 pt-1 pb-1  ${
                  params.slug == batch.uuid ? "bg-cyan-950" : ""
                }
                -z-0 truncate relative `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {overState == batch.uuid ? (
                  <i
                    className="fa-solid fa-angle-down pr-3.5"
                    id={batch.uuid}
                    onClick={handleChildrenScripts}
                  ></i>
                ) : childScript.length > 0 &&
                  childScript[0].batch_uuid == batch.uuid ? (
                  <i
                    className="fa-solid fa-angle-down pr-3"
                    id={batch.uuid}
                    onClick={handleChildrenScripts}
                  ></i>
                ) : (
                  <i className="fa-solid fa-folder pr-3" id={batch.uuid}></i>
                )}
                <span
                  onClick={redirectToBatch}
                  id={batch.uuid}
                  className="truncate max-w-[20px]"
                >
                  {batch.title.slice(0, 7) +
                    (batch.title.length > 6 ? ".." : "")}
                </span>
                {overState == batch.uuid && (
                  <i
                    className="fa-solid fa-ellipsis-vertical text-[#BCD1FF]  pl-14"
                    id={batch.uuid}
                    onClick={addPopUp}
                  ></i>
                )}
              </li>
              {childScript &&
                childScript.map(
                  (child) =>
                    child.batch_uuid == batch.uuid && (
                      <li
                        key={child.id}
                        id={child.uuid}
                        className={`text-[#BCD1FF] pl-12 cursor-pointer hover:bg-cyan-950 ${
                          params.slug == child.uuid && "bg-cyan-950"
                        } pt-1 pb-1 truncate  `}
                        onMouseEnter={handleScriptMouseEnter}
                        onMouseLeave={handleScriptMouseLeave}
                        onClick={redirectToScript}
                      >
                        <i
                          className="fa-solid fa-file pr-3"
                          onClick={redirectToScript}
                          id={child.uuid}
                        ></i>
                        {child.title}
                      </li>
                    )
                )}
              {popUp == batch.uuid && (
                <div className="box-border bg-white  w-44 p-4 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-52 z-50">
                  <div className="w-[130px] m-auto space-y-3">
                    <p
                      className="text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded
                      "
                      id={batch.uuid}
                      onClick={addNewScript}
                    >
                      <i
                        className="fa-regular fa-file pr-[7px]"
                        id={batch.uuid}
                      ></i>
                      New Script
                    </p>
                    <p
                      className="text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded"
                      id="script"
                    >
                      <i className="fa-regular fa-file pr-[7px]"></i>Share
                    </p>
                    <p
                      className="text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded"
                      id="script"
                      onClick={props.handleTrash}
                    >
                      <i className="fa-solid fa-trash pr-[5px]"></i>Trash
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {script.map((script) => (
            <li
              key={script.id}
              id={script.uuid}
              className={`text-[#BCD1FF] pl-8 cursor-pointer hover:bg-cyan-950 pt-1 pb-1 truncate ${
                params.slug == script.uuid && "bg-cyan-950"
              } `}
              onMouseEnter={handleScriptMouseEnter}
              onMouseLeave={handleScriptMouseLeave}
              onClick={redirectToScript}
            >
              <i className="fa-solid fa-file pr-3"></i>
              {script.title}
            </li>
          ))}
        </ul>
        <hr
          className={`h-px  bg-textPrimary border-0 dark:bg-gray-900 m-auto mt-2`}
        />
        <div className=" flex items-center  justify-around w-[200px] m-auto  mt-10">
          <div className="bg-white h-8 w-8 rounded-full cursor-pointer  ">
            <Link to={`/dashboard/${params.uuid}/t/trash`}>
              <p className=" text-primary pl-[8px] pt-[3px]  ">
                <i className="fa-solid fa-trash pr-[5px]"></i>
              </p>
            </Link>
          </div>
          <div className="bg-white h-8 w-8 rounded-full cursor-pointer">
            {AddNewMenu ? (
              <p
                className=" text-primary pl-[9px] pt-[2px]"
                onClick={() => setAddNewMenu(false)}
              >
                <i className="fa-solid fa-x text-lg" ref={AddIconRef}></i>
              </p>
            ) : (
              <p
                className="  text-primary pl-[7px] pt-[3px]"
                onClick={() => setAddNewMenu(true)}
              >
                <i className="fa-regular fa-plus hover:text-primary text-xl"></i>
              </p>
            )}
          </div>
          {AddNewMenu && (
            <div className="absolute left-28 bottom-20" ref={AddNewRef}>
              <AddNew click={addNewBatch} scriptEvent={addNewScript} />
            </div>
          )}

          <div className="bg-white h-8 w-8 rounded-full cursor-pointer  ">
            <p className=" text-primary pl-[7px] pt-[2px]  ">
              <i className="fa-solid fa-gear text-lg text-primary"></i>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
      {loading && (
        <p className="absolute top-72 left-[600px] z-40">
          <HashLoader color="#3197e8" />
        </p>
      )}
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
          team={teamName}
          invitePopup={invitePopup}
          setInvitePopup={setInvitePopup}
          setInviteEmail={setInviteEmail}
          inviteEmail={inviteEmail}
          setRole={setRole}
          handleInviteUsers={handleInviteUsers}
          inviteError={inviteError}
        />
      )}
    </div>
  );
}
