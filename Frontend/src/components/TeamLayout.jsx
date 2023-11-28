import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect } from "react";
import { TeamSideNav } from "../common/commonLayouts/TeamSideNav.jsx";


export default function TeamLayout() {
  const { auth, setAuth } = useStateContext();

  if (!auth) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <>
        <div>
          <div className="flex bg-[#ECEDEF]">
            <TeamSideNav 
            />
            <Outlet
        
            />
          </div>
        </div>
      </>
    );
  }
}
