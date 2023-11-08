import React from "react";
import { TeamSideNav } from "../../common/commonLayouts/TeamSideNav";
import { TeamProfile } from "../../common/commonLayouts/TeamProfile";
import { useParams } from "react-router-dom";
import { ActiveUsers } from "../../common/commonLayouts/ActiveUsers";

export const TeamComponents = (props) => {
    const params = useParams();

  return (
    <div className="flex bg-[#F4F4F4]">
      <TeamSideNav
        teamname={props.teamname}
        setTeamName={props.setTeamName}
        handleUpdate={props.handleUpdate}
        message={props.message}
      />

      <div className="m-auto">
        {params.slug == "teamsetting" ? (
          <TeamProfile
            teamname={props.teamname}
            setTeamName={props.setTeamName}
            message={props.message}
            handleUpdate={props.handleUpdate}
          />
        ) : (
          <ActiveUsers 
          teamname={props.teamname}
          handleInvite={props.handleInvite}
          invitePopup={props.invitePopup}
          setInvitePopup={props.setInvitePopup}
          />
        )}
      </div>
    </div>
  );
};
