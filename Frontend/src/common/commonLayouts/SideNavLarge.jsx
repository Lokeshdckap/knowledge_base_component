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
    handleTrash,
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
    getScripts,
    handleAfterAddedChildrenScripts,
    userInfo,
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
    getAllTeam();
  }, [params.uuid]);

  //

  //Team Switch Event

  const switchTeamEvent = async (e) => {
    const teamId = e.target.id;
    if (teamId !== params.uuid) {
      setLoading(true);
      await axiosClient
        .get(`/api/teams/switchTeam/${teamId}`)
        .then((res) => {
          if (res.status == 200) {
            navigate(`/dashboard/${res.data.selectedTeam.uuid}`);
            setLoading(false);
            setteamDropDown(false);
            showToastMessage(res.data.msg);
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
        .post("/api/teams/team", formValues)
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
        .post("/api/invites/inviteUsers", {
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
        console.log("j");
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
    <div className="bg-[#efeffa] h-screen border-r-[1px] w-[220px] shadow">
      <div className="flex items-center pt-6 pl-7 space-x-2 ">
        <div>
          <img
            src={"https://i.postimg.cc/q7jqHKxQ/book.png"}
            alt=""
            className="h-6 text-textPrimary"
          />
        </div>

        <p className=" text-lg text-textPrimary font-medium">Rhino Tome</p>
      </div>

      <div className="">
        <div className="mt-8  flex items-center justify-between w-[200px] m-auto ">
          <span className="material-symbols-outlined text-textPrimary">group</span>
          <p className="text-xl font-bold  text-textPrimary  truncate ">
            <Link to={`/dashboard/${params.uuid}`}>{teamName}'s Team</Link>
          </p>
          {teamDropDown ? (
            <i
              className="fa-solid fa-angle-up text-textPrimary cursor-pointer"
              onClick={() => setteamDropDown(false)}
              ref={iconRef}
            ></i>
          ) : (
            <i
              className="fa-solid fa-angle-down text-textPrimary cursor-pointer"
              onClick={() => setteamDropDown(true)}
            ></i>
          )}
        </div>
        {teamDropDown && (
          <div
            className="box-border bg-white  w-52 p-4 border-[1px] rounded-xl shadow-lg absolute left-48 top-28 z-10"
            ref={teamRef}
          >
            <div>
              <p className="font-semibold text-textPrimary">Change Team</p>
              {allTeam && (
                <ul className={`space-y-2 pt-1 max-h-[250px] overflow-auto`}>
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
                    <Link to={`/setting/${params.uuid}/teamsetting`}>
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
              className="mt-2 flex items-center mb-2 cursor-pointer hover:text-primary"
              onClick={() => setTeamPopup(true)}
            >
              <i className="fa-solid fa-plus "></i>
              <p className="pl-1 ">Create Team</p>
            </div>
          </div>
        )}
        <ul className="mt-5 space-y-1 h-[350px] overflow-auto ">
          {batch.map((batch) => (
            <div className=""
            key={batch.uuid}
            >
              <li
                key={batch.uuid}
                id={batch.uuid}
                className={`text-textPrimary pl-8 cursor-pointer hover:bg-[#e0e0e6] pt-1 pb-1  ${
                  params.slug == batch.uuid ? "bg-[#e0e0e6]" : ""
                }
                -z-0 truncate relative `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {overState == batch.uuid ? (
                  <i
                    className="fa-solid fa-angle-down pr-3.5 "
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
                  <i className="fa-solid fa-folder pr-3 text-[#424244]" id={batch.uuid}></i>
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
                    className="fa-solid fa-ellipsis-vertical text-textPrimary  pl-14"
                    id={batch.uuid}
                    onClick={addPopUp}
                  ></i>
                )}
              </li>
              {popUp == batch.uuid && (
                <div className="box-border bg-white  w-44 p-4 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-48 z-50">
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
                      id={batch.uuid}
                      onClick={handleTrash}
                    >
                      <i className="fa-solid fa-trash pr-[5px]"></i>Trash
                    </p>
                  </div>
                </div>
              )}
              {childScript &&
                childScript.map(
                  (child) =>
                    child.batch_uuid == batch.uuid && (
                      <div className=""
                      key={child.id}
                      >
                        <li
                          key={child.id}
                          id={child.uuid}
                          data-set={child.batch_uuid}
                          className={`text-textPrimary pl-11 cursor-pointer hover:bg-[#e0e0e6] pt-1 pb-1 truncate ${
                            params.slug == child.uuid && "bg-[#e0e0e6]"
                          } `}
                          onMouseEnter={handleScriptMouseEnter}
                          onMouseLeave={handleScriptMouseLeave}
                        >
                          <i
                            className="fa-solid fa-file pr-3 text-[#424244]"
                            id={child.uuid}
                            onClick={redirectToScript}
                          ></i>
                          <span
                            onClick={redirectToScript}
                            id={child.uuid}
                            className="truncate max-w-[20px] text-textPrimary"
                          >
                            {child.title.slice(0, 7) +
                              (child.title.length > 6 ? ".." : "")}
                          </span>
                          {overScriptState == child.uuid && (
                            <i
                              className="fa-solid fa-ellipsis-vertical text-textPrimary  pl-14"
                              id={child.uuid}
                              onClick={addPopUp}
                            ></i>
                          )}
                        </li>
                        {popUp == child.uuid && (
                          <div className="box-border bg-white  w-44 p-4 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-52 z-50">
                            <div className="w-[130px] m-auto space-y-3">
                              <p
                                className={`text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded`}
                                id={child.uuid}
                                onClick={handleTrash}
                                data-set={child.batch_uuid}
                              >
                                <i
                                  className="fa-solid fa-trash pr-[5px]"
                                  id={child.uuid}
                                  onClick={handleTrash}
                                  data-set={child.batch_uuid}
                                ></i>
                                Trash
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                )}
            </div>
          ))}
          {script.map((script) => (
            <div
            key={script.id}
            >
              <li
                key={script.id}
                id={script.uuid}
                className={`text-textPrimary pl-8 cursor-pointer hover:bg-[#e0e0e6] pt-1 pb-1 truncate ${
                  params.slug == script.uuid && "bg-[#e0e0e6]"
                } `}
                onMouseEnter={handleScriptMouseEnter}
                onMouseLeave={handleScriptMouseLeave}
              >
                <i
                  className="fa-solid fa-file pr-3 text-[#424244] "
                  id={script.uuid}
                  onClick={redirectToScript}
                ></i>
                
                <span
                  onClick={redirectToScript}
                  id={script.uuid}
                  className="truncate max-w-[20px] text-textPrimary"
                >
                  {script.title.slice(0, 7) +
                    (script.title.length > 6 ? ".." : "")}
                </span>
                {overScriptState == script.uuid && (
                  <i
                    className="fa-solid fa-ellipsis-vertical text-textPrimary  pl-14"
                    id={script.uuid}
                    onClick={addPopUp}
                  ></i>
                )}
              </li>
              {popUp == script.uuid && (
                <div className="box-border bg-white  w-44 p-4 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-52 z-50">
                  <div className="w-[130px] m-auto space-y-3">
                    <p
                      className="text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded"
                      id={script.uuid}
                    >
                      <i className="fa-regular fa-file pr-[7px]"></i>Share
                    </p>
                    <p
                      className={`text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded`}
                      id={script.uuid}
                      onClick={handleTrash}
                    >
                      <i className="fa-solid fa-trash pr-[5px]"></i>Trash
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </ul>
        <hr
          className={`h-px bg-[#c2c2c9] border-0 dark:bg-gray-300 m-auto mt-2`}
        />
        <div className=" flex items-center  justify-around w-[200px] m-auto  mt-6">
          <div
            className={` ${
              params.slug == "trash" ? "bg-textPrimary" : "bg-white"
            } h-8 w-8    rounded-full cursor-pointer `}
          >
            <Link to={`/dashboard/${params.uuid}/t/trash`}>
              <p className={` text-slate-500 pl-[8px] pt-[3px]  `}>
                <i
                  className={`fa-solid fa-trash pr-[5px] ${
                    params.slug == "trash" && "text-white"
                  }`}
                ></i>
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
            <div className="absolute left-28 bottom-20 z-10" ref={AddNewRef}>
              <AddNew click={addNewBatch} scriptEvent={addNewScript} />
            </div>
          )}
          <Link to={`/setting/${params.uuid}/teamsetting`}>
            <div className="bg-white h-8 w-8 rounded-full cursor-pointer  ">
              <p className=" text-primary pl-[7px] pt-[2px]  ">
                <i className="fa-solid fa-gear text-lg text-slate-500"></i>
              </p>
            </div>
          </Link>
        </div>
      </div>
      <ToastContainer />
      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
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
