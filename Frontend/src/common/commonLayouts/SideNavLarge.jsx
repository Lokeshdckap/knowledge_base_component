import React, { useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import AddNew from "../commonComponents/AddNew";

export default function SideNavLarge(props) {
  const teamName = props.teams.name;
  const batchList = props.batch;
  const allTeam = props.allTeamName;

  const [AddNewMenu, setAddNewMenu] = useState(false);
  const [teamDropDown, setteamDropDown] = useState(false);

  return (
    <div className="bg-primary h-[664px] w-[280px]">
      <div>
        <img src={mainLogo} alt="" srcset="" className="max-w-md m-auto mt-4" />
      </div>
      <div className="bg-slate-300 h-6 w-6 rounded-full absolute mt-4 left-[217px]">
        <span
          class="material-symbols-outlined cursor-pointer"
          onClick={props.buttonClicked}
        >
          chevron_left
        </span>
      </div>
      <div className="relative">
        <div className="mt-8 w-[200px] m-auto flex items-center space-x-4 ">
          <span class="material-symbols-outlined text-white">group</span>
          <p className="text-xl font-bold  text-white">{teamName} Tea...</p>
          {teamDropDown ? (
            <i
              class="fa-solid fa-angle-up text-white cursor-pointer"
              onClick={() => setteamDropDown(false)}
            ></i>
          ) : (
            <i
              class="fa-solid fa-angle-down text-white cursor-pointer"
              onClick={() => setteamDropDown(true)}
            ></i>
          )}
        </div>
        {teamDropDown && (
          <div className="box-border bg-white  w-52 p-4 border-[1px] rounded-xl shadow-lg absolute left-48 top-5 ">
            <div>
              <p>Change Team</p>
              {allTeam && (
                <ul className="space-y-2 pt-1">
                  {allTeam.map((team) => (
                    <li key={team.id} className="text-base cursor-pointer hover:text-purple-400 ">{team.name}{team.name == teamName && <i class="fa-solid fa-circle-check text-sky-400 pl-1" ></i> }</li>
                  ))}
                </ul>
              )}
            </div>
            <hr
              className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
            />
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <i class="fa-solid fa-sliders"></i>
                <p className="pl-1">Team setting</p>
              </div>

              <div className="flex items-center mb-2">
                <i class="fa-solid fa-user-plus"></i>
                <p className="pl-1">Invite Teamates</p>
              </div>
            </div>
            <hr
              className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 mt-2`}
            />
            <div className="mt-2 flex items-center mb-2">
              <i class="fa-solid fa-plus"></i>
              <p className="pl-1">Create Team</p>
            </div>
          </div>
        )}
      </div>

      {batchList && (
        <ul className="mt-5 space-y-1 h-[310px] overflow-auto ">
          {batchList.map((batch) => (
            <li key={batch.id} className="text-[#BCD1FF] pl-8 cursor-pointer hover:bg-cyan-950 pt-1 pb-1 "><i class="fa-solid fa-folder pr-3"></i>{batch.title} <i class="fa-solid fa-ellipsis-vertical text-[#BCD1FF] pl-6"></i></li>
          ))}
        </ul>
      )}
      <div className=" ml-[27px] space-y-4 pt-2 relative">
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] hover:bg-white hover:first-line:text-primary  text-primary rounded cursor-pointer  ">
          {AddNewMenu ? (
            <p
              className="text-base text-white pt-1 pl-5  hover:text-primary  "
              onClick={() => setAddNewMenu(false)}
            >
              <i class="fa-regular fa-x hover:text-primary "></i> Close
            </p>
          ) : (
            <p
              className="text-base text-white pt-1 pl-5  hover:text-primary  "
              onClick={() => setAddNewMenu(true)}
            >
              <i class="fa-regular fa-plus hover:text-primary "></i> Add
            </p>
          )}
        </div>
        {AddNewMenu && (
          <div className="absolute left-28 bottom-48   ">
            <AddNew click={props.clickEvent} />
          </div>
        )}
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary  ">
            <i class="fa-regular fa-bell hover:text-primary"></i> Notifications
          </p>
        </div>
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white ">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary ">
            <i class="fa-solid fa-trash hover:text-primary"></i> Trash
          </p>
        </div>
        <div className="border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer hover:first-line:text-primary hover:bg-white ">
          <p className="text-base text-white pt-1 pl-5 hover:text-primary ">
            <i class="fa-solid fa-gear hover:text-primary"></i>Settings
          </p>
        </div>
      </div>
    </div>
  );
}
