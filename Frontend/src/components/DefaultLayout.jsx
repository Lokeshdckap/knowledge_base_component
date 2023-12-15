import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect, useState } from "react";
import SideNavLarge from "../common/commonLayouts/SideNavLarge.jsx";
import { MyContextProvider, useMyContext } from "../context/AppContext.jsx";

export default function DefaultLayout() {
  const { auth, setAuth } = useStateContext();

  if (!auth) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <MyContextProvider>
        <div className="flex">
          <SideNavLarge />
          <div className=" 2xl:w-[calc(100%-260px)] xl:w-[calc(100%-220px)] lg:w-[calc(100%-220px)] phone:w-[100%]">
            <Outlet />
          </div>
        </div>
      </MyContextProvider>
    );
  }
}
