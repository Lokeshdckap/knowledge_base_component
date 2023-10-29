import React, { useEffect, useRef, useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import AddNew from "../commonComponents/AddNew";
import { Link, useNavigate } from "react-router-dom";

export default function SideNavLarge(props) {


  const teamName = props.team.name;
  const AllTeams = props.allTeams;
  const batchList = props.batches;
  const scriptList = props.scripts;
  const childScript = props.childScript



  

  const navigate = useNavigate();

  const [AddNewMenu, setAddNewMenu] = useState(false);
  const [teamDropDown, setteamDropDown] = useState(false);
  const [overState, setOverState] = useState(null);
  const [overScriptState, setOverScriptState] = useState(null);
  const [popUp, setPopup] = useState(null);


  //ref
  const teamRef = useRef(null);
  const iconRef = useRef(null);

  //

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if(teamDropDown && !teamRef.current.contains(e.target) && e.target !== iconRef.current){
          setteamDropDown(false)
      }
    };
    window.addEventListener('click', closeOnOutsideClick);
    return () => {
      window.removeEventListener('click', closeOnOutsideClick);
    };
  },[teamDropDown])

 

  const handleMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverState(targetId);
  };

  const handleMouseLeave = () => {
    setOverState(null);
  };

  const handleScriptMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverScriptState(targetId);
  };

  const handleScriptMouseLeave = () => {
    setOverScriptState(null);
  };

  const addPopUp = (e) => {
    let targetId = e.target.id;
    if(popUp){
      setPopup(null);
    }
    else{
      setPopup(targetId);
    }
  };


  const renderPage =(e) =>{
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}/s/${TargetScriptId}`);
    props.getParticularScript(TargetScriptId); 
  }

  const handleBatch = (e) =>{
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}/b/${TargetScriptId}`);
  }

  return (
    <div className="bg-primary h-[632px] w-[280px] z-10">
      <div>
        <img src={mainLogo} alt="" srcset="" className="max-w-md m-auto mt-4" />
      </div>
      <div className="bg-slate-300 h-6 w-6 rounded-full absolute mt-4 left-[219px]">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={props.buttonClicked}
        >
          chevron_left
        </span>
      </div>
      <div className="relative">
        <div className="mt-8 w-[200px] m-auto flex items-center space-x-4 ">
          <span className="material-symbols-outlined text-white">group</span>
          <p className="text-xl font-bold  text-white w-48 truncate ">
           <Link to={`/dashboard/${localStorage.getItem("team_uuid")}`}>{teamName} Tea...</Link> 
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
          <div className="box-border bg-white  w-52 p-4 border-[1px] rounded-xl shadow-lg absolute left-48 top-5 z-10" ref={teamRef}>
            <div>
              <p>Change Team</p>
              {AllTeams && (
                <ul className="space-y-2 pt-1 h-[200px] overflow-auto" >
                  {AllTeams.map((team) => (
                    <li
                      key={team.uuid}
                      id={team.uuid}
                      onClick={props.clickSwitch}
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
            </div>
            <hr
              className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
            />
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-sliders"></i>
                <p className="pl-1">Team setting</p>
              </div>

              <div className="flex items-center mb-2">
                <i className="fa-solid fa-user-plus"></i>
                <p className="pl-1">Invite Teamates</p>
              </div>
            </div>
            <hr
              className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
            />
            <div className="mt-2 flex items-center mb-2">
              <i className="fa-solid fa-plus"></i>
              <p className="pl-1">Create Team</p>
            </div>
          </div>
        )}
      </div>
      {
        <ul className="mt-5 space-y-1 h-[280px] overflow-auto ">
          {batchList.map((batch) => (
            <div className="">
              <li
                key={batch.id}
                id={batch.uuid}
                className={`text-[#BCD1FF] pl-8 cursor-pointer hover:bg-cyan-950 pt-1 pb-1  -z-0 truncate relative `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {overState == batch.uuid ? (
                  <i
                    className="fa-solid fa-angle-down pr-3.5"
                    id={batch.uuid}
                    onClick={props.handleChildrenScripts}
                  ></i>
                ) : (
                  (childScript.length > 0 && childScript[0].batch_uuid == batch.uuid) ? (
                    <i className="fa-solid fa-angle-down pr-3" id={batch.uuid}></i>

                  ) :(
                    <i className="fa-solid fa-folder pr-3" id={batch.uuid}></i>
                  )
                  )
                }
                <span onClick={handleBatch} id={batch.uuid}> {batch.title}</span>
                {overState == batch.uuid && (
                  <i
                    className="fa-solid fa-ellipsis-vertical text-[#BCD1FF] pl-[54px]"
                    id={batch.uuid}
                    onClick={addPopUp}
                  ></i>
                )}
              </li>
                  {childScript && 
                    childScript.map((child) => (
                        (child.batch_uuid == batch.uuid &&
                          <li
                          key={child.id}
                          id={child.uuid}
                          className="text-[#BCD1FF] pl-12 cursor-pointer hover:bg-cyan-950 pt-1 pb-1 truncate"
                          onMouseEnter={handleScriptMouseEnter}
                          onMouseLeave={handleScriptMouseLeave}
                          onClick={renderPage}
                        
                        >
                          <i className="fa-solid fa-file pr-3" onClick={renderPage}  id={child.uuid}></i>
                          {child.title}
                        </li>
                        )
                    ))
                  }
              {popUp == batch.uuid && (
                <div className="box-border bg-white  w-44 p-4 border-[1px] border-slate-300 rounded-xl shadow-lg absolute left-52 z-50">
                  <div className="w-[130px] m-auto space-y-3">
                    <p
                      className="text-lg cursor-pointer text-textPrimary hover:bg-primary  hover:text-white hover:rounded
                      " 
                      id={batch.uuid}
                      onClick={props.scriptEvent}
                    >
                      <i className="fa-regular fa-file pr-[7px]" id={batch.uuid}></i>New Script                      
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
                    >
                      <i className="fa-solid fa-trash pr-[5px]"></i>Trash
                    </p>
                  </div>
                </div>
              )}
            </div>
     
          ))}

          {scriptList.map((script) => (
            <li
              key={script.id}
              id={script.uuid}
              className="text-[#BCD1FF] pl-8 cursor-pointer hover:bg-cyan-950 pt-1 pb-1 truncate"
              onMouseEnter={handleScriptMouseEnter}
              onMouseLeave={handleScriptMouseLeave}
            >
              <i className="fa-solid fa-file pr-3"></i>
              {script.title}
              {overScriptState == script.uuid && (
                <i className="fa-solid fa-ellipsis-vertical text-[#BCD1FF] pl-6"></i>
              )}
            </li>
          ))}
        </ul>
      }

      <div className=" ml-[27px] space-y-4 pt-2 relative">
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] hover:bg-white hover:first-line:text-primary  text-primary rounded cursor-pointer  ">
          {AddNewMenu ? (
            <p
              className="text-base text-white pt-1 pl-5  hover:text-primary  "
              onClick={() => setAddNewMenu(false)}
            >
              <i className="fa-regular fa-x hover:text-primary "></i> Close
            </p>
          ) : (
            <p
              className="text-base text-white pt-1 pl-5  hover:text-primary  "
              onClick={() => setAddNewMenu(true)}
            >
              <i className="fa-regular fa-plus hover:text-primary "></i> Add
            </p>
          )}
        </div>
        {AddNewMenu && (
          <div className="absolute left-28 bottom-48   ">
            <AddNew
              click={props.addBatchEvent}
              scriptEvent={props.scriptEvent}
            />
          </div>
        )}
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary  ">
            <i className="fa-regular fa-bell hover:text-primary"></i>{" "}
            Notifications
          </p>
        </div>
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white ">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary ">
            <i className="fa-solid fa-trash hover:text-primary"></i> Trash
          </p>
        </div>
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white ">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary ">
            <i className="fa-solid fa-gear hover:text-primary"></i>Settings
          </p>
        </div>
      </div>
    </div>
  );
}
