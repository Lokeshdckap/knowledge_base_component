import React from "react";
import Main from "./Main";
import { Navigate, useNavigate } from "react-router-dom";

export default function Header(props) {
<<<<<<< HEAD
 


=======

>>>>>>> origin
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };
  return (
    <div className="h-[65px] ">
      <div
        className={`flex items-center justify-between m-auto ${props.widths}  mt-4`}
      >
        <h2>{props.teams} 's Team</h2>
        <div>
          <form>
            <div class="flex">
              <button
                id="dropdown-button"
                data-dropdown-toggle="dropdown"
                class="flex-shrink-0 z-10 inline-flex items-center p-2 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                type="button"
              >
                All
                <svg
                  class="w-2.5 h-2.5 ml-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div class="relative w-[380px]">
                <input
                  type="search"
                  id="search-dropdown"
                  class="block p-[10px] w-[380px] z-20 text-sm text-gray-900 bg-white rounded-r-lg focus:outline-primary  placeholder-gray-400 dark:text-white "
                  placeholder="Search here"
                  required
                />
                <button
                  type="submit"
                  class="absolute top-0 right-0 p-2 text-sm font-medium h-full text-white bg-primary rounded-r-lg border border-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span class="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
