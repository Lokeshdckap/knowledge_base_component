import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect, useState } from "react";
import SideNavLarge from "../common/commonLayouts/SideNavLarge.jsx";
import { MyContextProvider, useMyContext } from "../context/AppContext.jsx";

export default function DefaultLayout() {

  const { auth, setAuth } = useStateContext();
  const [lastActivityTime, setLastActivityTime] = useState(new Date());

  useEffect(() => {
    
    // Set up a timer to check for inactivity
    const activityTimer = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = currentTime - lastActivityTime;

      // Set an inactivity threshold (e.g., 15 minutes)
      const inactivityThreshold = 8 * 60 * 60 * 1000;//8hours
      const inactivitySecondshold = 20 * 1000; // 20 minutes


      if (timeDifference > inactivityThreshold) {
    
       
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    
        window.location.reload("/signin");
      }
      // if(localStorage.getItem("Time") > inactivitySecondshold){
          
      // }

    }, 8000);

    return () => clearInterval(activityTimer);
  }, [lastActivityTime]);

  const handleMouseActivity = () => {
    // Update the last activity time when there's mouse activity
    setLastActivityTime(new Date());
  };

  if (!auth) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <MyContextProvider>
        <div className="flex" onMouseMove={handleMouseActivity}>
          <SideNavLarge />
          <div className=" 2xl:w-[calc(100%-260px)] xl:w-[calc(100%-220px)] lg:w-[calc(100%-220px)] phone:w-[100%]" >
            <Outlet />
          </div>
        </div>
      </MyContextProvider>
    );
  }
}
