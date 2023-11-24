import React from "react";
import Main from "./Main";
import { Navigate, useNavigate } from "react-router-dom";

export default function Header(props) {


  const onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.href = "/signin";
  };
  return (
    <div className="h-[75px] bg-[#F9FAFB]">
      <div
        className={`flex items-center justify-between m-auto ${props.widths}  pt-4`}
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
                  >
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <button className="h-[35px] w-[120px] text-white rounded  bg-primary" onClick={onLogout}>Logout <i class="fa-solid fa-arrow-right-from-bracket mx-2"></i></button>
      </div>
    </div>
  );
}
