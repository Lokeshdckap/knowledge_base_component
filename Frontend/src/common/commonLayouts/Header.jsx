import React, { useState } from "react";
import Main from "./Main";
import { Navigate, useNavigate } from "react-router-dom";

export default function Header(props) {
  const [profileState, setProfileState] = useState(false);
  const onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.href = "/signin";
  };

  const handleProfile = () => {
    setProfileState((prevState) => !prevState);
  };
  return (
    <div className="h-[75px] bg-white shadow-sm">
      <div
        className={`flex items-center justify-between m-auto relative ${props.widths}  pt-4`}
      >
        <h2> {props.team}'s Team</h2>
        <div>
          <form>
            <div className="flex">
              <div className="relative w-[380px]">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-[10px] w-[380px] z-20 text-sm text-gray-900 bg-white rounded-lg focus:outline-primary  placeholder-gray-400 dark:text-white cursor-pointer outline outline-1 "
                  placeholder="Search here"
                  autoComplete="off"
                  required
                  ref={props.searchInpRef}
                  onClick={props.HandleSearch}
                  readOnly
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 p-2 text-sm font-medium h-full text-white bg-primary rounded-r-lg border border-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  ></svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className=" cursor-pointer p-1" onClick={handleProfile}>
          <i class="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-3"></i>
        </div>
        {profileState && (
          <div className="bg-white h-[81px] w-28 absolute top-14 border-[1px] right-[-20px] shadow-md rounded-lg">
            <p className="text-lg pl-3 pt-2 text-textPrimary cursor-pointer ">
              <i class="fa-regular text-slate-600 fa-circle-user text-lg cursor-pointer pr-2 pb-0.5"></i>
              Profile
            </p>
            <hr />
            <p
              className="text-lg pl-3 pt-1 text-textPrimary cursor-pointer"
              onClick={onLogout}
            >
              <i class="fa-solid fa-arrow-right-from-bracket text-slate-600 text-lg cursor-pointer pr-2"></i>
              Logout
            </p>
          </div>
        )}

        {/* <button className="h-[35px] w-[120px] text-white rounded  bg-primary" onClick={onLogout}>Logout <i class="fa-solid fa-arrow-right-from-bracket mx-2"></i></button> */}
      </div>
    </div>
  );
}
