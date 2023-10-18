import React, { useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";
import "./../../";
import EditPage from "../../common/commonLayouts/EditPage";
import EditHeader from "../../common/commonLayouts/EditHeader";

export default function Dashboard() {
  const [state, setState] = useState(false);



  const handleClick = () => {
    setState((prevState) => !prevState);
    console.log(state);
  };

  return (
    <div>
      <div className="flex bg-[#ECEDEF]">
        {state ? (
          <SideNavLarge buttonClicked={handleClick} />
        ) : (
          <SideNav buttonClicked={handleClick} />
        )}
        <div className="bg-[#F9FAFB] h-[80px] w-screen">
          <EditHeader />
          {/* <Header widths={state ? "w-[1000px]" : "w-[1160px]"} /> */}
          {/* <Main widths={state ? "w-[1000px]" : "w-[1120px]"}/> */}
          <EditPage />
          </div>
      </div>
    </div>
  );
}
