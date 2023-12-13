import React, { useEffect, useRef, useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import AddNew from "../commonComponents/AddNew";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { ModelPopup } from "../commonComponents/ModelPopup";
import { InviteUsers } from "./InviteUsers";
import settings from "../../assets/images/settings.png";
import { useMyContext } from "../../context/AppContext";

export default function SideNavLarge(props) {
  //navigate
  const navigate = useNavigate();

  const {
    handleTrash,
    getAllTeam,
    teamName,
    allTeam,
    batch,
    script,
    setOverState,
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
  } = useMyContext();

  //param
  const params = useParams();

  //ref
  const teamRef = useRef(null);
  const iconRef = useRef(null);

  const AddIconRef = useRef(null);
  const AddNewRef = useRef(null);

  const addPopup = useRef(null);
  const addIconRef = useRef(null);
  
  //TeamState
  const [teamDropDown, setteamDropDown] = useState(false);

  //Script
  const [overScriptState, setOverScriptState] = useState(null);
  const [childOpen, setChildOpen] = useState(false);

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

  const [topState,setTopState] = useState(null)
  //

  useEffect(() => {
    getAllTeam();
    if (localStorage.getItem("mainId")) {
      localStorage.removeItem("mainId");
    }
  }, [params.uuid]);

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
    console.log(e.target);

    e.preventDefault();
    e.stopPropagation();
 
    const element = addIconRef.current;  
    // Check if the element is available
    if (element) {
      // Use getBoundingClientRect to get the size and position
      const top = element.getBoundingClientRect().top;
      setTopState(top+30);
    }

    let targetId = e.target.id;
    localStorage.setItem("mainId", targetId);
    setOverState(targetId);
    setPopup(targetId);
    setOverScriptState(targetId);
  };

  //Script Hover
  const handleScriptMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverScriptState(targetId);
  };

  const handleScriptMouseLeave = () => {
    setOverScriptState(null);
  };

  //Create Team Functionalities
  const HandleChange = (e) => {
    const { name, value } = e.target;
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
          showToastMessage(res.data.Success);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
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
    const closeOnOutsideClick = (e) => {
      if (
        teamDropDown &&
        teamRef.current &&
        !teamRef.current.contains(e.target) &&
        e.target !== iconRef.current
      ) {
        setteamDropDown(false);
      }
      if (
        AddNewMenu &&
        AddNewRef.current &&
        !AddNewRef.current.contains(e.target) &&
        e.target !== AddIconRef.current
      ) {
        setAddNewMenu(false);
      }
      if (
        popUp &&
        addPopup.current &&
        !addPopup.current.contains(e.target) &&
        e.target !== addIconRef.current
      ) {
        setPopup(null);
        setOverScriptState(null);
        if (localStorage.getItem("mainId")) {
          localStorage.removeItem("mainId");
        }
      }
    };

    window.addEventListener("click", closeOnOutsideClick);

    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [teamDropDown, AddNewMenu, props.overStates, popUp]);

  return (
    <div className="bg-[#181F38] h-screen border-r-[1px] 2xl:w-[260px] xl:w-[220px] lg:w-[220px] shadow">
      <div className="flex items-center pt-6 pl-7 space-x-2 ">
        <div>
          <img
            src={"https://i.postimg.cc/W11rypJ7/book-3.png"}
            alt=""
            className="h-6 text-[#F9EFD4]"
          />
        </div>
        <p className=" text-lg text-[#F9EFD4] font-medium">Rhino Tome</p>
      </div>
      <div className="">
        <div className="mt-8 flex items-center justify-between w-[200px] m-auto ">
          <span className="material-symbols-outlined text-[#F9EFD4]">
            group
          </span>
          <p className="text-xl font-bold  text-[#F9EFD4]  truncate ">
            <Link to={`/dashboard/${params.uuid}`}>{teamName}'s Team</Link>
          </p>
          {teamDropDown ? (
            <i
              className="fa-solid fa-angle-up text-[#F9EFD4] cursor-pointer"
              onClick={() => setteamDropDown(false)}
              ref={iconRef}
            ></i>
          ) : (
            <i
              className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer"
              onClick={() => setteamDropDown(true)}
            ></i>
          )}
        </div>
        {teamDropDown && (
          <div
            className="box-border bg-white w-52 pt-4 pl-4 pb-4 border-[1px] rounded-xl shadow-lg absolute left-48 top-28 z-10"
            ref={teamRef}
          >
            <div>
              <p className="font-semibold text-textPrimary">Change Team</p>
              {allTeam && (
                <ul className={`space-y-2 pt-2 max-h-[250px] overflow-auto`}>
                  {allTeam.map((team, index) => (
                    <li
                      key={index}
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
                className={`h-px  bg-[#454E5E] border-0 dark:bg-gray-900 mt-2`}
              />
              <div className="mt-2">
                <div className="flex items-center mb-2 hover:text-primary">
                  <i className="fa-solid fa-sliders cursor-pointer"></i>
                  <p className="pl-1">
                    <Link to={`/setting/${params.uuid}/teamsetting`}>
                      Team setting
                    </Link>
                  </p>
                </div>
                <div
                  className="flex items-center mb-2 hover:text-primary"
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

        <ul className="mt-5 space-y-1 2xl:max-h-[650px] xl:max-h-[380px] lg:max-h-[350px] overflow-auto">
          {batch.map((batch, index) => (
            <div key={index}>
              <Link to={`/dashboard/${params.uuid}/b/${batch.uuid}`}>
                <div
                  className={`flex items-center  justify-between cursor-pointer font-sans font-medium text-base hover:bg-[#323F5E] pl-6 pt-1 pb-1 pr-5 ${
                    params.slug == batch.uuid ? "bg-[#323F5E]" : ""
                  }`}
                  key={index}
                  id={batch.uuid}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <i
                      className="fa-solid fa-folder text-[#F9EFD4] pr-2.5"
                      id={batch.uuid}
                    ></i>
                    <li
                      key={batch.uuid}
                      id={batch.uuid}
                      className={`text-[#F9EFD4]  cursor-pointer  hover:bg-[#323F5E]  ${
                        params.slug == batch.uuid ? "bg-[#323F5E]" : ""
                      }
                      -z-0 truncate`}
                    >
                      {batch.title.slice(0, 7) +
                        (batch.title.length > 6 ? ".." : "")}
                    </li>
                  </div>
                  <div>
                    {(overState == batch.uuid ||
                      localStorage.getItem("mainId") == batch.uuid) && (
                      <i
                        className="fa-solid fa-ellipsis-vertical text-[#F9EFD4]   pt-[3px] pb-[3px] pl-[7px] pr-[7px] rounded-[4px] "
                        id={batch.uuid}
                        onClick={addPopUp}
                        ref={addIconRef}
                      ></i>
                    )}
                  </div>
                </div>
              </Link>

              {popUp == batch.uuid && (
                <>
                  <div className="bg-[#a3a2e9] opacity-[0] w-screen h-screen absolute top-0 left-0  z-10"></div>
                  <div
                    className="box-border bg-white  w-40   border-[1px] border-slate-300 rounded-lg shadow-lg absolute  left-40  z-10"
                    ref={addPopup}
                    style={{
                      top:topState
                    }}
                  >
                    <div className="w-[145px] m-auto space-y-3 pt-3 pb-3">
                      <p
                        className="text-lg cursor-pointer  text-textPrimary hover:bg-primary  hover:text-white hover:rounded
                      "
                        id={batch.uuid}
                        onClick={addNewScript}
                      >
                        <i
                          className="fa-regular fa-file p-2 "
                          id={batch.uuid}
                        ></i>
                        New Script
                      </p>
                      <p
                        className="text-lg cursor-pointer  text-textPrimary  hover:bg-primary  hover:text-white hover:rounded"
                        id={batch.uuid}
                        onClick={handleTrash}
                      >
                        <i className="fa-solid fa-trash p-2"></i>Trash
                      </p>
                    </div>
                  </div>
                </>
              )}
              {childScript &&
                childScript.map(
                  (child, index) =>
                    child.batch_uuid == batch.uuid && (
                      <div className="pt-1" key={index}>
                        <Link to={`/dashboard/${params.uuid}/s/${child.uuid}`}>
                          <div
                            className={`flex items-center justify-between pl-10 font-medium text-base cursor-pointer hover:bg-[#323F5E] pt-1 pb-1 pr-7  ${
                              params.slug == child.uuid && "bg-[#323F5E]"
                            }`}
                            id={child.uuid}
                            data-set={child.batch_uuid}
                            onMouseEnter={handleScriptMouseEnter}
                            onMouseLeave={handleScriptMouseLeave}
                          >
                            <div className={`flex items-center truncate`}>
                              <i
                                className="fa-solid fa-file  text-[#F9EFD4] pr-2"
                                id={child.uuid}
                              ></i>
                              <li
                                key={child.id}
                                id={child.uuid}
                                data-set={child.batch_uuid}
                                className={`text-[#F9EFD4]  cursor-pointer truncate `}
                              >
                                {child.title.slice(0, 7) +
                                  (child.title.length > 6 ? ".." : "")}
                              </li>
                            </div>
                            {(overScriptState == child.uuid ||
                              localStorage.getItem("mainId") == child.uuid) && (
                              <i
                                className="fa-solid fa-ellipsis-vertical text-[#F9EFD4]   pt-[3px] pb-[3px] pl-[7px] pr-[7px] rounded-[4px] "
                                id={child.uuid}
                                onClick={addPopUp}
                                ref={addIconRef}
                              ></i>
                            )}
                          </div>
                        </Link>
                        {popUp == child.uuid && (
                          <>
                            <div className="box-border bg-white w-40 p-2.5 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-40 z-50"
                             style={{
                              top: topState
                            }}
                            >
                              <div
                                className="w-[140px] m-auto space-y-3"
                                ref={addPopup}
                               
                              >
                                <p
                                  className={`text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded p-0.5`}
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
                          </>
                        )}
                      </div>
                    )
                )}
            </div>
          ))}
          {script.map((script, index) => (
            <div key={script.uuid}>
              <Link to={`/dashboard/${params.uuid}/s/${script.uuid}`}>
                <div
                  className={`flex items-center justify-between hover:bg-[#323F5E] font-medium text-base cursor-pointer pl-6 pt-[4px] pb-[4px] pr-6 ${
                    params.slug == script.uuid && "bg-[#323F5E]"
                  } `}
                  id={script.uuid}
                  key={script.uuid}
                  onMouseEnter={handleScriptMouseEnter}
                  onMouseLeave={handleScriptMouseLeave}
                >
                  <div className="flex items-center hover:bg-[#323F5E] cursor-pointer">
                    <i
                      className="fa-solid fa-file pr-2.5  text-[#F9EFD4]"
                      id={script.uuid}
                    ></i>
                    <li
                      key={script.id}
                      id={script.uuid}
                      className={`text-[#F9EFD4] cursor-pointer truncate `}
                    >
                      {script.title.slice(0, 7) +
                        (script.title.length > 6 ? ".." : "")}
                    </li>
                  </div>
                  {(overScriptState == script.uuid ||
                    localStorage.getItem("mainId") == script.uuid) && (
                    <i
                      className="fa-solid fa-ellipsis-vertical text-[#F9EFD4]   pt-[3px] pb-[3px] pl-[7px] pr-[7px] rounded-[4px] "
                      id={script.uuid}
                      ref={addIconRef}
                      onClick={addPopUp}
                    ></i>
                  )}
                </div>
              </Link>

              {popUp == script.uuid && (
                <>
                  <div className="bg-[#a3a2e9] opacity-[0] w-screen h-screen absolute top-0 left-0  z-10"></div>
                  <div
                    className="box-border bg-white  w-40   border-[1px] border-slate-300 rounded-lg shadow-lg absolute left-40 z-50"
                    ref={addPopup}
                    style={{
                      top:topState
                    }}
                  >
                    <div className="w-[145px] m-auto space-y-3 pt-3 pb-3">
                      <p
                        className="text-lg cursor-pointer  text-textPrimary hover:bg-primary  hover:text-white hover:rounded"
                        id={script.uuid}
                        onClick={handleTrash}
                      >
                        <i className="fa-solid fa-trash p-2"></i>Trash
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </ul>
      </div>
      <div className="">
        <div className="h-px bg-[#c2c2c9] w-[100%]">

        </div>
        {/* <hr
          className={`h-px bg-[#c2c2c9] border-0 dark:bg-gray-300 m-auto mt-2 align-bottom`}
        /> */}
        <div className=" flex items-center  justify-around w-[200px] m-auto  mt-6">
          <div
            className={` ${
              params.slug == "trash" ? "bg-textPrimary" : "bg-white"
            } h-8 w-8    rounded-full cursor-pointer `}
          >
            <Link to={`/dashboard/${params.uuid}/t/trash`}>
              <p className={` text-slate-500 pl-[8px] pt-[3px]  `}>
                <i
                  className={`fa-solid fa-trash  ${
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
            <div className="absolute left-28 bottom-14 z-10" ref={AddNewRef}>
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
          <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
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
