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
        <div>
          <div className="relative">
            <div className="flex bg-[#ECEDEF]">
              <SideNavLarge />
              <Outlet />
            </div>
          </div>
        </div>
      </MyContextProvider>
    );
  }
}
