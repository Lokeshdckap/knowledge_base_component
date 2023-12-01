import React, { useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import Dashboard from "../../Dashboard/container/Dashboard";
import AddNew from "../commonComponents/AddNew";

export default function SideNav(props) {
  
  const [AddNewMenu, setAddNewMenu] = useState(false);

  const teamName = String(props.team.name);  


  return (
    <div className="bg-primary h-screen w-[72px]">
      <div>
        <img src={mainLogo} alt="" className="m-4" />
      </div>
      <div className="bg-slate-300 h-6 w-6 rounded-full ml-[58px]">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={props.buttonClicked}
        >
          chevron_right
        </span>
      </div>
      <div className="bg-blue-100 h-[40px] w-[45px] rounded-sm ml-3 mt-7">
        <p className="text-2xl font-bold p-1 ">{teamName.slice(0, 2)}</p>
      </div>

      <div className="space-y-6  mt-64  ">
        <div className="bg-white h-8 w-8 rounded-full ml-5 cursor-pointer relative">
          {AddNewMenu ? (
            <i
              className="fa-solid fa-x text-lg pl-[9px] pt-[2px]  text-textPrimary cursor-pointer"
              onClick={() => setAddNewMenu(false)}
            ></i>
          ) : (
            <i
              className="fa-solid fa-plus text-xl pl-[7px] pt-[2px]  text-textPrimary cursor-pointer"
              title="Add new"
              onClick={() => setAddNewMenu(true)}
            ></i>
          )}
          {AddNewMenu && (
            <div className="absolute left-8 bottom-8">
              <AddNew click={props.addBatchEvent} scriptEvent={props.scriptEvent}/>
            </div>
          )}
        </div>

        <div>
          <i
            className="fa-regular fa-bell ml-7 text-xl text-slate-100 cursor-pointer"
            title="notification"
          ></i>
        </div>
        <div>
          <i
            className="fa-regular fa-trash-can ml-7 text-xl text-slate-100 cursor-pointer"
            title="trash"
          ></i>
        </div>
        <div>
          <i
            className="fa-solid fa-gear ml-7 text-xl text-slate-100 cursor-pointer"
            title="settings"
          ></i>
        </div>
      </div>
    </div>
  );
}
