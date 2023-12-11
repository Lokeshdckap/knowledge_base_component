import React, { useEffect, useRef, useState } from "react";
import Main from "./Main";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function Header(props) {
  const params = useParams();
  const profileRef = useRef(null);

  const profileIconRef = useRef(null);

  const [profileState, setProfileState] = useState(false);
  const onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (
        profileState &&
        e.target !== profileIconRef.current
      ) {
        setProfileState(false);
      }
    };

    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [profileState]);

  const handleProfile = () => {
    setProfileState((prevState) => !prevState);
  };

  return (
    <div className="bg-[#fbfbff] h-[70px] border-b-[1px] " >
      <div
        className={`flex items-center  m-auto justify-between  relative  xl:max-w-[1100px] lg:max-w-[1000px]  pt-3.5` } 
      >
        <h2> {props.team}'s Team</h2>
        <div>
          <div className="flex">
            <div className="relative w-[380px]">
              <input
                type="search"
                id="search-dropdown"
                className="block p-[10px] w-[380px] z-20 text-sm text-gray-900 bg-white rounded-lg focus:outline-slate-300  placeholder-gray-400 dark:text-white cursor-pointer border-[1px] "
                placeholder="Search here"
                autoComplete="off"
                required
                ref={props.searchInpRef}
                onClick={props.HandleSearch}
                readOnly
              />
              <button
                type="submit"
                className="absolute top-0 right-0 p-2 text-sm font-medium h-full text-white bg-primary rounded-r-lg border border-primary  focus:outline-none "
              >
                <i className="fa-solid fa-magnifying-glass "></i>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </div>
        <div className=" cursor-pointer p-1" onClick={handleProfile}
       
        >
          {props.userDetail?.avatar ? (
            <img
              src={props.userDetail?.avatar}
              className="w-10 h-10 rounded-full"
              alt=""
              ref={profileIconRef}
            />
          ) : (
            <i className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-3"
            ref={profileIconRef}
            ></i>
          )}
        </div>
        {profileState && (
          <div className="bg-white h-[81px] w-28 absolute top-14 border-[1px] right-[-20px] shadow-md rounded-lg"
          ref={profileRef}
          >
            <Link to={`/setting/${params.uuid}/profile`}>
              {" "}
              <p className="text-lg pl-3 pt-2 text-textPrimary cursor-pointer ">
                <i className="fa-regular text-slate-600 fa-circle-user text-lg cursor-pointer pr-2 pb-0.5"></i>
                Profile
              </p>
            </Link>
            <hr />
            <p
              className="text-lg pl-3 pt-1 text-textPrimary cursor-pointer"
              onClick={onLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-slate-600 text-lg cursor-pointer pr-2"></i>
              Logout
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
