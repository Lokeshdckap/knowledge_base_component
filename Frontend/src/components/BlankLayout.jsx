import React from "react";
import { useStateContext } from "../context/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";

export const BlankLayout = () => {
  const { auth, setAuth } = useStateContext();

  if (!auth) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <>
        <div>
          <Outlet />
        </div>
      </>
    );
  }
};
