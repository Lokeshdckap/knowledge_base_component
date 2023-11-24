import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect } from "react";
import SideNavLarge from "../common/commonLayouts/SideNavLarge.jsx";

export default function TeamLayout() {
  const { auth, setAuth } = useStateContext();

  if (!auth) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <>
      <div>
        <div className="relative">
          <div className="flex bg-[#ECEDEF]">
            {/* <SideNavLarge /> */}
            <Outlet />
          </div>
        </div>
        </div>
      </>
    );
  }
}



