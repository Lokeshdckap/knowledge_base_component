import React, { useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import AddNew from "../commonComponents/AddNew";

export default function SideNavLarge(props) {

  const teamName = props.teams.name;

  const [AddNewMenu, setAddNewMenu] = useState(false);

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
      <div className="mt-8 w-[200px] m-auto flex items-center space-x-4 ">
        <span class="material-symbols-outlined text-white">group</span>
        <p className="text-xl font-bold  text-white">{teamName} Tea...</p>
        <i class="fa-solid fa-angle-down text-white cursor-pointer"></i>
      </div>
      <div className=" ml-[27px] space-y-4 mt-80 relative">
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
            <AddNew team={props.teams} />
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
