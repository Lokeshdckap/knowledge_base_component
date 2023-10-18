import React, { useEffect, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import SideNav from "../../common/commonLayouts/SideNav";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import Main from "../../common/commonLayouts/Main";
import "./../../";
import axiosClient from "../../axios-client";

export default function Dashboard() {
  const [state, setState] = useState(false);
  const [team, setTeam] = useState({});

  const handleClick = () => {
    setState((prevState) => !prevState);
  };

  const getTeam = async () => {
    // console.log("ee");

    await axiosClient
      .get("/getTeam")
      .then((res) => {
        setTeam(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBatch = async () => {
    // console.log(team.uuid);
    await getTeam();
    await axiosClient
      .get(`/getBatch/${team.uuid}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
     getBatch();
  }, []);

  return (
    <div>
      <div className="flex bg-[#ECEDEF]">
        {state ? (
          <SideNavLarge buttonClicked={handleClick} teams={team} />
        ) : (
          <SideNav buttonClicked={handleClick} teams={team} />
        )}
        <div className="bg-[#F9FAFB] h-[80px] w-screen">
          <Header
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            teams={team.name}
          />
          <Main
            widths={state ? "w-[1000px]" : "w-[1120px]"}
            teams={team.name}
          />
        </div>
      </div>
    </div>
  );
}
