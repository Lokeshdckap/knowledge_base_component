import React, {  useEffect, useRef, useState } from "react";
import Main from "./Main";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";

export default function Header(props) {
  const params = useParams();
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const profileIconRef = useRef(null);


  const {openSideNave, setOpenSideNave} = useMyContext();
  const [profileState, setProfileState] = useState(false);
  const onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");

    window.location.reload("/signin");
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (profileState && e.target !== profileIconRef.current) {
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

  const handleSideBar  = () => {
    setOpenSideNave("block")
  }

  // setOpenSideNave
  return (
    <div className="bg-[#ffff]  shadow-md w-[100%]">
      <div
        className={`flex items-center  m-auto justify-between  relative  w-[100%]  2xl:py-[30px] pt-[8px] pb-[8px] pl-[30px] pr-[30px]`}
      >
        <div className="flex  space-x-2">
          <div className="2xl:hidden xl:hidden lg:hidden  phone:block phone:text-[12px] "
            onClick={handleSideBar}
          >
            <i className="fa-solid fa-bars"></i>
          </div>
          <h2 className="phone:text-[12px]"> {props.team}'s Team</h2>
        </div>

        <div>
          <div className="flex">
            <div className="relative phone:w-[150px] w-[380px]">
              <input
                type="search"
                id="search-dropdown"
                className="block p-[10px] phone:p-[5px] w-[380px] phone:w-[150px] z-20 text-sm text-gray-900 bg-white rounded-lg focus:outline-slate-300  placeholder-gray-400 dark:text-white cursor-pointer border-[1px] "
                placeholder="Search here"
                autoComplete="off"
                required
                ref={props.searchInpRef}
                onClick={props.HandleSearch}
                readOnly
              />
              <button
                type="submit"
                className="absolute top-0 right-0 p-2 text-sm font-medium h-full text-white bg-[#99a5b8] rounded-r-lg  focus:outline-none "
              >
                <i className="fa-solid fa-magnifying-glass "></i>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </div>
        <div className=" cursor-pointer p-1" onClick={handleProfile}>
          {props.userDetail?.avatar ? (
            <img
              src={props.userDetail?.avatar}
              className="w-10 h-10 rounded-full"
              alt=""
              ref={profileIconRef}
            />
          ) : (
            <i
              className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-3"
              ref={profileIconRef}
            ></i>
          )}
        </div>
        {profileState && (
          <div
            className="bg-white  w-52 absolute top-14 border-[1px] right-[35px] z-30 shadow-md rounded-lg"
            ref={profileRef}
          >
            <div className="w-[85%] m-auto pt-[12px] ">
              <div className="flex justify-center">
                {props.userDetail?.avatar ? (
                  <img
                    src={props.userDetail?.avatar}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                ) : (
                  <i
                    className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-3"
                  ></i>
                )}
              </div>
              <div className="flex justify-center ">
                <p className="text-[12px] text-textPrimary pt-[2px] pb-[10px]">
                  {props.userDetail?.email}
                </p>
              </div>
              <hr />

              <Link
                to={`/setting/${params.uuid}/profile`}
                className="hover:text-slate-600"
              >
                {" "}
                <div className="hover:text-primary py-[10px] flex items-center space-x-2">
                  <i className="fa-regular fa-circle-user text-[16px]  cursor-pointer "></i>
                  <p className="text-[16px]  cursor-pointer  ">Profile</p>
                </div>
              </Link>
              <div className="hover:text-primary  pb-[12px]  flex items-center space-x-2">
                <i className="fa-solid fa-arrow-right-from-bracket  text-[16px]  cursor-pointer"></i>

                <p className="text-[16px]   cursor-pointer" onClick={onLogout}>
                  Signout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
